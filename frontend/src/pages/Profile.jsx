

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
      try {
        const response = await api.get(API_ENDPOINTS.USERS.PROFILE);
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
    const formData = new FormData();
    formData.append('profileImage', selectedImage);

    try {
      const response = await api.put(
        API_ENDPOINTS.USERS.UPDATE(profileData._id),
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        setProfileData(prev => ({
          ...prev,
          profileImage: response.data.imagePath
        }));
        setSuccessMessage('Profile image updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Image upload failed');
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
      const response = await axios.put(
        API_ENDPOINTS.USERS.UPDATE(profileData._id),
        profileData,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      if (response.data.success) {
        setSuccessMessage('Profile updated successfully!');
        setIsEditing(false);
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
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


        </div>
      </div>
    </div>
  );
};

export default Profile;
