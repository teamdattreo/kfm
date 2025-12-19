import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS, api } from '../api';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    address: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const token = getAuthToken();
    
    if (!token) {
      navigate('/login');
      return;
    }

    // If we get here, we have a token
    setAuthChecked(true);
    fetchUsers();
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const response = await api.get(API_ENDPOINTS.USERS.ALL);
      
      // Handle both array and object responses
      const userData = Array.isArray(response) 
        ? response 
        : response?.data || [];
      
      setUsers(userData);
      setLoading(false);
    } catch (error) {
      console.error('API Error:', error);
      setError(error.message || 'Failed to fetch users. Please check your authentication.');
      if (error.status === 401) {
        navigate('/login');
      }
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      address: user.address
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }
    
    try {
      await api.delete(API_ENDPOINTS.USERS.DELETE(userId));
      setError('');
      fetchUsers();
    } catch (error) {
      console.error('Delete error:', error);
      setError(error.message || 'Failed to delete user');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const token = getAuthToken();
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await api.put(
        API_ENDPOINTS.USERS.UPDATE(editingUser._id),
        formData
      );

      if (response.success) {
        setIsModalOpen(false);
        fetchUsers();
      } else {
        setError(response.message || 'Failed to update user');
      }
    } catch (error) {
      console.error('Update error:', error);
      if (error.status === 401) {
        setError('Session expired. Please login again.');
        localStorage.removeItem('authToken');
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError(error.message || 'Failed to update user');
      }
    }
};

  return (
    <div className="relative min-h-screen">
      {/* Background with subtle overlay */}
      <div className="fixed inset-0 bg-cover bg-center z-0 bg-gradient-to-br from-amber-900/20 via-black/70 to-amber-900/20">
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-4 pt-16 pb-10">
        <div className="max-w-7xl mx-auto">
          {/* Card Header with Gradient */}
          <div className="bg-gradient-to-r from-amber-400/40 via-amber-500/50 to-amber-600/40 py-5 px-6 rounded-t-xl">
            <h2 className="text-3xl font-bold text-center text-white drop-shadow-lg">
              <span className="bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
                Studio
              </span>
              <span className="text-white">KFM</span>
            </h2>
            <p className="text-sm text-center text-amber-100 mt-1 tracking-wider font-medium">
              USER MANAGEMENT
            </p>
          </div>
          
          {/* Content Card */}
          <div className="bg-white/20 backdrop-blur-lg rounded-b-xl shadow-2xl overflow-hidden border border-white/30 p-6">
            {/* Error message */}
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-100">
                {error}
              </div>
            )}

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white/20">
                <thead className="bg-white/10">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-amber-200 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-amber-200 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-amber-200 uppercase tracking-wider">
                      Mobile
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-amber-200 uppercase tracking-wider">
                      Address
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-amber-200 uppercase tracking-wider">
                      Verified
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-amber-200 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-amber-100">
                        Loading...
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-amber-100">
                        No users found
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user._id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-100">
                          {user.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-100">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-100">
                          {user.mobile}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-100">
                          {user.address}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-100">
                          {user.verified ? 'Yes' : 'No'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEdit(user)}
                            className="text-amber-300 hover:text-amber-400 mr-4 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this user?')) {
                                handleDelete(user._id);
                              }
                            }}
                            className="text-red-400 hover:text-red-500 transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-amber-900/30 via-black/70 to-amber-900/30 rounded-xl shadow-2xl border border-amber-500/30 w-full max-w-md">
            <div className="bg-gradient-to-r from-amber-400/40 via-amber-500/50 to-amber-600/40 py-4 px-6 rounded-t-xl">
              <h3 className="text-lg font-medium text-white">Edit User</h3>
            </div>
            
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-amber-100/90 text-sm font-medium mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white/15 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-amber-100/90 text-sm font-medium mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white/15 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-transparent"
                    required
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-amber-100/90 text-sm font-medium mb-2">
                    Mobile *
                  </label>
                  <input
                    type="text"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white/15 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-amber-100/90 text-sm font-medium mb-2">
                    Address *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-2 bg-white/15 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-transparent"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2 border border-amber-300/50 text-amber-100 rounded-lg hover:bg-amber-900/30 transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-300"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;