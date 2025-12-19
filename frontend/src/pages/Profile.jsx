

import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS, api } from '../api';
import { useNavigate, Link } from 'react-router-dom';
import { FiEdit, FiLogOut, FiHome, FiUser, FiMail, FiPhone, FiMapPin, FiBookOpen, FiCamera } from 'react-icons/fi';

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    _id: '',
    name: '',
    email: '',
    address: '',
    mobile: '',
    profileImage: ''
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const response = await api.get(API_ENDPOINTS.USERS.PROFILE, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response?.success) {
          setProfileData({
            _id: response.data._id,
            name: response.data.name,
            email: response.data.email,
            address: response.data.address,
            mobile: response.data.mobile,
            profileImage: response.data.profileImage || ''
          });
          if (response.data.profileImage) {
            setPreviewImage(response.data.profileImage);
          }
        }
      } catch (err) {
        setError(err.data?.message || err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const uploadProfileImage = async () => {
    if (!selectedImage) return;

    setImageLoading(true);
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }
    const formData = new FormData();
    formData.append('profileImage', selectedImage);

    try {
      const response = await api.put(
        API_ENDPOINTS.USERS.UPDATE(profileData._id),
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response?.success) {
        setProfileData(prev => ({
          ...prev,
          profileImage: response.data?.imagePath || prev.profileImage
        }));
        setSuccessMessage('Profile image updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err) {
      setError(err.data?.message || err.message || 'Image upload failed');
      setTimeout(() => setError(''), 3000);
    } finally {
      setImageLoading(false);
    }
  };

  const validateProfile = () => {
    const errors = {};
    if (!profileData.name.trim()) errors.name = 'Name is required';
    if (!profileData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(profileData.email)) {
      errors.email = 'Invalid email format';
    }
    if (!profileData.mobile.trim()) {
      errors.mobile = 'Mobile number is required';
    } else if (!/^\d{10,15}$/.test(profileData.mobile)) {
      errors.mobile = 'Mobile number must be 10–15 digits';
    }
    if (!profileData.address.trim()) errors.address = 'Address is required';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateProfile();
    setValidationErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }
      const response = await api.put(
        API_ENDPOINTS.USERS.UPDATE(profileData._id),
        profileData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response?.success) {
        setSuccessMessage('Profile updated successfully!');
        setIsEditing(false);
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err) {
      setError(err.data?.message || err.message || 'Update failed');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800">
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
            Studio
          </span>
          <span className="text-2xl font-bold text-white">
            KFM
          </span>
        </Link>
        <div className="flex items-center space-x-4">
          <Link 
            to="/UserHomePage" 
            className="p-2 text-gray-300 hover:text-amber-400 transition-colors"
            title="Home"
          >
            <FiHome className="text-xl" />
          </Link>
          <Link 
            to="/BookingHistory" 
            className="p-2 text-gray-300 hover:text-amber-400 transition-colors"
            title="Booking History"
          >
            <FiBookOpen className="text-xl" />
          </Link>
          <button 
            onClick={handleLogout} 
            className="p-2 text-gray-300 hover:text-red-400 transition-colors"
            title="Logout"
          >
            <FiLogOut className="text-xl" />
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Status Messages */}
        {error && (
          <div className="bg-red-500/90 text-white p-4 rounded-lg mb-6 flex items-center justify-between shadow-lg animate-fade-in">
            <span>{error}</span>
            <button onClick={() => setError('')} className="text-white hover:text-gray-200">
              ×
            </button>
          </div>
        )}
        {successMessage && (
          <div className="bg-emerald-500/90 text-white p-4 rounded-lg mb-6 flex items-center justify-between shadow-lg animate-fade-in">
            <span>{successMessage}</span>
            <button onClick={() => setSuccessMessage('')} className="text-white hover:text-gray-200">
              ×
            </button>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-gray-800/70 rounded-xl border border-gray-700 shadow-xl overflow-hidden">
          {/* Card Header */}
          <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700">
            <div className="flex items-center">
              <FiUser className="text-amber-400 mr-2 text-xl" />
              <h2 className="text-xl font-semibold text-white">
                {isEditing ? 'Edit Profile' : 'My Profile'}
              </h2>
            </div>
            <div className="flex items-center space-x-2">
              <span className="hidden sm:inline-block text-sm text-gray-400">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                })}
              </span>
              {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)} 
                  className="p-2 text-gray-300 hover:text-amber-400 transition-colors"
                  title="Edit Profile"
                >
                  <FiEdit className="text-xl" />
                </button>
              ) : (
                <button 
                  onClick={() => setIsEditing(false)} 
                  className="p-2 text-gray-300 hover:text-red-400 transition-colors"
                  title="Cancel"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Profile Body */}
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left column: avatar + quick stats */}
              <div className="lg:col-span-1">
                <div className="bg-gray-900/60 border border-gray-700 rounded-2xl p-6">
                  <div className="flex items-center justify-center">
                    <div className="relative">
                      {previewImage || profileData.profileImage ? (
                        <img
                          src={previewImage || profileData.profileImage}
                          alt="Profile"
                          className="h-28 w-28 rounded-full object-cover ring-2 ring-amber-400/60"
                        />
                      ) : (
                        <div className="h-28 w-28 rounded-full bg-gradient-to-br from-amber-400/30 via-gray-800 to-black flex items-center justify-center text-2xl font-semibold text-amber-200 ring-2 ring-amber-400/60">
                          {profileData.name?.trim()?.[0] || 'K'}
                        </div>
                      )}
                      {isEditing && (
                        <label className="absolute -bottom-2 -right-2 h-9 w-9 rounded-full bg-amber-500 text-black flex items-center justify-center cursor-pointer shadow-lg">
                          <FiCamera className="text-lg" />
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <h3 className="text-lg font-semibold text-white">{profileData.name || 'Your Name'}</h3>
                    <p className="text-sm text-gray-400">{profileData.email || 'your@email.com'}</p>
                  </div>
                  {selectedImage && isEditing && (
                    <button
                      type="button"
                      onClick={uploadProfileImage}
                      disabled={imageLoading}
                      className="mt-4 w-full rounded-lg bg-gray-800 border border-gray-700 text-amber-200 py-2 hover:bg-gray-700 transition-colors disabled:opacity-60"
                    >
                      {imageLoading ? 'Uploading...' : 'Save Photo'}
                    </button>
                  )}
                </div>
              </div>

              {/* Right column: form */}
              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs uppercase tracking-wider text-gray-400">Name</label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      disabled={!isEditing}
                      className={`mt-2 w-full rounded-lg border ${validationErrors.name ? 'border-red-500' : 'border-gray-700'} bg-gray-900/70 px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400/40`}
                      placeholder="Your name"
                    />
                    {validationErrors.name && (
                      <p className="mt-1 text-xs text-red-400">{validationErrors.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-gray-400">Email</label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      disabled={!isEditing}
                      className={`mt-2 w-full rounded-lg border ${validationErrors.email ? 'border-red-500' : 'border-gray-700'} bg-gray-900/70 px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400/40`}
                      placeholder="you@example.com"
                    />
                    {validationErrors.email && (
                      <p className="mt-1 text-xs text-red-400">{validationErrors.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-gray-400">Mobile</label>
                    <input
                      type="tel"
                      value={profileData.mobile}
                      onChange={(e) => setProfileData({ ...profileData, mobile: e.target.value })}
                      disabled={!isEditing}
                      className={`mt-2 w-full rounded-lg border ${validationErrors.mobile ? 'border-red-500' : 'border-gray-700'} bg-gray-900/70 px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400/40`}
                      placeholder="07X XXX XXXX"
                    />
                    {validationErrors.mobile && (
                      <p className="mt-1 text-xs text-red-400">{validationErrors.mobile}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-gray-400">Address</label>
                    <input
                      type="text"
                      value={profileData.address}
                      onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                      disabled={!isEditing}
                      className={`mt-2 w-full rounded-lg border ${validationErrors.address ? 'border-red-500' : 'border-gray-700'} bg-gray-900/70 px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400/40`}
                      placeholder="Street, City"
                    />
                    {validationErrors.address && (
                      <p className="mt-1 text-xs text-red-400">{validationErrors.address}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-gray-700 pt-6">
                  <div className="text-xs text-gray-500">
                    Profile updates are saved securely to your account.
                  </div>
                  {isEditing && (
                    <button
                      type="submit"
                      disabled={loading}
                      className="rounded-lg bg-amber-500 px-6 py-2 text-black font-semibold hover:bg-amber-600 transition-colors disabled:opacity-60"
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
