import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { API_ENDPOINTS, api } from '../api';
import { 
  FaUser, FaBoxOpen, FaUsers, 
  FaCalendarCheck, FaTags, FaImages,
  FaMoneyBillWave, FaProductHunt, FaSignOutAlt
} from 'react-icons/fa';
import { FiMenu, FiX } from 'react-icons/fi';
import ExpenseManagement from './ExpenseManagement';


const AdminProfile = () => {
  const [admin, setAdmin] = useState({ 
    _id: '',
    name: '', 
    email: '', 
    phone: '',
    address: '',
    costPerHour: 0,
    additionalCosts: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Professional dark theme
  const theme = useMemo(() => ({
    bg: 'bg-gray-900',
    card: 'bg-gray-800 border border-gray-700',
    accent: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    text: 'text-gray-100',
    muted: 'text-gray-400',
    border: 'border-indigo-500',
    sidebar: 'bg-gray-800',
    sidebarText: 'text-gray-300',
    sidebarHover: 'hover:bg-gray-700 hover:text-white',
    sidebarActive: 'bg-indigo-600 text-white',
    inputBg: 'bg-gray-700',
    inputBorder: 'border-gray-600',
    buttonSecondary: 'bg-gray-700 hover:bg-gray-600 text-white',
    notificationSuccess: 'bg-green-800 text-green-100 border-green-700',
    notificationError: 'bg-red-800 text-red-100 border-red-700'
  }), []);

 const NAV_ITEMS = useMemo(() => [
  // { icon: <FaUser className="text-lg" />, label: "Profile", path: "/Profile" },
  { icon: <FaBoxOpen className="text-lg" />, label: "Packages", path: "/PackagesPage" },
  { icon: <FaProductHunt className="text-lg" />, label: "Products", path: "/ProductsPage" },
  { icon: <FaUsers className="text-lg" />, label: "Users", path: "/AdminUsersPage" },
  { icon: <FaCalendarCheck className="text-lg" />, label: "Bookings", path: "/BookingDetailsPage" },
  { icon: <FaMoneyBillWave className="text-lg" />, label: "Gallery", path: "/AdminGalleryUploadTable" },
  { icon: <FaTags className="text-lg" />, label: "Promotions", path: "/AdminPromo" },
  { icon: <FaImages className="text-lg" />, label: "Banners", path: "/AdminBannerPage" }
], []);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('No authentication token found');

      const response = await api.get(API_ENDPOINTS.USERS.PROFILE, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      if (!response?.success) {
        throw new Error(response?.message || 'Invalid response format');
      }

      const { _id, name, email, mobile, address } = response.data;
      setAdmin(prev => ({
        ...prev,
        _id: _id || '',
        name: name || '',
        email: email || '',
        phone: mobile || '',
        address: address || ''
      }));

    } catch (err) {
      const errorMessage = err.data?.message || err.message || 'Failed to load profile';
      setError(errorMessage);
      if (err.status === 401) {
        handleLogout();
      }
      console.error('Profile fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setAdmin(prev => ({ ...prev, [name]: value }));
    setIsEditing(true);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('authToken');
    navigate('/login');
  }, [navigate]);

  const handleSaveChanges = useCallback(async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }
      const response = await api.put(
        API_ENDPOINTS.USERS.UPDATE(admin._id),
        {
          name: admin.name,
          email: admin.email,
          mobile: admin.phone,
          address: admin.address
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response?.success) {
        setSuccessMessage('Profile updated successfully');
        setIsEditing(false);
        setTimeout(() => setSuccessMessage(''), 3000);
        fetchProfile();
      } else {
        throw new Error(response?.message || 'Update failed');
      }
    } catch (err) {
      setError(err.data?.message || err.message || 'Failed to update profile');
      setTimeout(() => setError(''), 3000);
    }
  }, [admin, fetchProfile]);

const SidebarButton = ({ icon, label, path, onClick }) => {
  const active = location.pathname === path;
  const Component = path ? Link : 'button';
  
  return (
    <Component
      to={path}
      onClick={(e) => {
        if (onClick) onClick(e);
        setMobileMenuOpen(false); // Close mobile menu when an item is clicked
      }}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
        active ? theme.sidebarActive : `${theme.sidebarText} ${theme.sidebarHover}`
      } focus:outline-none`}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </Component>
  );
};

  if (error) {
    return (
      <div className={`${theme.bg} min-h-screen flex items-center justify-center`}>
        <div className={`${theme.card} p-6 rounded-lg max-w-md text-center`}>
          <div className={`text-red-400 text-xl mb-4`}>Error: {error}</div>
          <button 
            onClick={fetchProfile}
            className={`${theme.accent} px-4 py-2 rounded-lg`}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${theme.bg} min-h-screen flex flex-col md:flex-row`}>
      {/* Mobile Header */}
      <header className="md:hidden flex justify-between items-center p-4 bg-gray-800 border-b border-gray-700">
        <h1 className="text-xl font-bold text-indigo-400">Admin Dashboard</h1>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-gray-300 hover:text-white focus:outline-none"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </header>

      {/* Sidebar */}
      <aside className={`md:w-64 w-full md:h-screen flex flex-col ${theme.sidebar} fixed border-r border-gray-700 p-4 gap-2 
        ${mobileMenuOpen ? 'fixed inset-0 z-50' : 'hidden md:flex'}`}>
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <h1 className="text-xl font-bold text-amber-400 hidden md:block mx-4 mt-4">Admin Dashboard</h1>
          {mobileMenuOpen && (
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden text-gray-300 hover:text-white focus:outline-none"
              aria-label="Close menu"
            >
              <FiX size={24} />
            </button>
          )}
        </div>

        <nav className="flex-1 flex flex-col gap-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <SidebarButton
              key={item.path}
              icon={item.icon}
              label={item.label}
              path={item.path}
            />
          ))}
        </nav>

        <div className="mt-auto pt-4 border-t border-gray-700">
          <SidebarButton
            icon={<FaSignOutAlt className="text-lg" />}
            label="Logout"
            onClick={handleLogout}
          />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-10 overflow-y-auto ml-0 md:ml-64">
        <div className="max-w-4xl mx-auto">
          {/* Success/Error Messages */}
          {successMessage && (
            <div className={`mb-4 p-3 ${theme.notificationSuccess} rounded-lg border`}>
              {successMessage}
            </div>
          )}
          {error && (
            <div className={`mb-4 p-3 ${theme.notificationError} rounded-lg border`}>
              {error}
            </div>
          )}
          
          {/* Profile Section */}
          <section className={`${theme.card} rounded-xl p-6 mb-6 shadow-lg`}>
            <div className="flex flex-col gap-6">
              <div className="flex-1 space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className={`text-2xl font-bold ${theme.text}`}>Profile Information</h2>
                  {isEditing && (
                    <span className="text-sm text-indigo-400">Editing mode</span>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className={`block ${theme.muted} mb-1 text-sm font-medium`}>Full Name</label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={admin.name}
                      onChange={handleInputChange}
                      className={`${theme.inputBg} border ${theme.inputBorder} ${theme.text} rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className={`block ${theme.muted} mb-1 text-sm font-medium`}>Email</label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={admin.email}
                      onChange={handleInputChange}
                      className={`${theme.inputBg} border ${theme.inputBorder} ${theme.text} rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className={`block ${theme.muted} mb-1 text-sm font-medium`}>Phone</label>
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      value={admin.phone}
                      onChange={handleInputChange}
                      className={`${theme.inputBg} border ${theme.inputBorder} ${theme.text} rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="address" className={`block ${theme.muted} mb-1 text-sm font-medium`}>Address</label>
                    <textarea
                      id="address"
                      name="address"
                      value={admin.address}
                      onChange={handleInputChange}
                      rows={3}
                      className={`${theme.inputBg} border ${theme.inputBorder} ${theme.text} rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Expense Management */}
          <ExpenseManagement 
            costPerHour={admin.costPerHour}
            additionalCosts={admin.additionalCosts}
            theme={theme}
          />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button 
              onClick={handleSaveChanges}
              disabled={!isEditing}
              className={`${theme.accent} px-6 py-3 rounded-lg font-semibold shadow-md flex-1 transition-all ${
                !isEditing ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg transform hover:-translate-y-0.5'
              }`}
            >
              Save Changes
            </button>
            <button 
              onClick={() => {
                if (isEditing && window.confirm('Are you sure you want to discard all changes?')) {
                  fetchProfile();
                  setIsEditing(false);
                }
              }}
              disabled={!isEditing}
              className={`${theme.buttonSecondary} px-6 py-3 rounded-lg font-semibold shadow-md flex-1 transition-all ${
                !isEditing ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg transform hover:-translate-y-0.5'
              }`}
            >
              Discard Changes
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminProfile;
