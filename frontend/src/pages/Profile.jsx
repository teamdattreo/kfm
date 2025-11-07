// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import ProfileImage from '../assets/profile.jpg';
// import { useNavigate } from 'react-router-dom';

// const Profile = () => {
//   const navigate = useNavigate();
//   const [isEditing, setIsEditing] = useState(false);
//   const [profileData, setProfileData] = useState({
//     _id: '',
//     name: '',
//     email: '',
//     address: '',
//     mobile: '',
//     bio: '',
//     specialization: ''
//   });

//   const [errors, setErrors] = useState({
//     name: '',
//     email: '',
//     address: '',
//     mobile: '',
//     bio: '',
//     specialization: ''
//   });

//   const [loading, setLoading] = useState({ profile: false, update: false });
//   const [error, setError] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');

//   const handleLogout = () => {
//     localStorage.removeItem('authToken');
//     localStorage.removeItem('userData');
//     navigate('/login');
//   };

//   const fetchProfile = async () => {
//     setLoading(prev => ({ ...prev, profile: true }));
//     setError('');
    
//     const token = localStorage.getItem('authToken');
//     if (!token) {
//       setError('Please login to view profile');
//       navigate('/login');
//       return;
//     }

//     try {
//       const response = await axios.get('http://localhost:4000/UserOperations/getUser', {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         withCredentials: true
//       });
      
//       if (response.data?.success) {
//         setProfileData({
//           _id: response.data.data._id,
//           name: response.data.data.name,
//           email: response.data.data.email,
//           address: response.data.data.address,
//           mobile: response.data.data.mobile,
//           bio: response.data.data.bio || '',
//           specialization: response.data.data.specialization || ''
//         });
//         localStorage.setItem('userData', JSON.stringify(response.data.data));
//       }
//     } catch (err) {
//       console.error('Profile fetch error:', err);
//       if (err.response?.status === 401) {
//         handleLogout();
//         setError('Session expired. Please login again.');
//       } else {
//         setError(err.response?.data?.message || 'Failed to load profile.');
//       }
//     } finally {
//       setLoading(prev => ({ ...prev, profile: false }));
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setProfileData({
//       ...profileData,
//       [name]: value
//     });
//     if (errors[name]) {
//       setErrors({
//         ...errors,
//         [name]: ''
//       });
//     }
//   };

//   const validateForm = () => {
//     let isValid = true;
//     const newErrors = {
//       name: '',
//       email: '',
//       address: '',
//       mobile: '',
//       bio: '',
//       specialization: ''
//     };

//     if (!profileData.name.trim()) {
//       newErrors.name = 'Name is required';
//       isValid = false;
//     }

//     if (!profileData.email) {
//       newErrors.email = 'Email is required';
//       isValid = false;
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
//       newErrors.email = 'Please enter a valid email address';
//       isValid = false;
//     }

//     if (!profileData.mobile) {
//       newErrors.mobile = 'Mobile number is required';
//       isValid = false;
//     } else if (!/^[0-9]{10,15}$/.test(profileData.mobile)) {
//       newErrors.mobile = 'Please enter a valid mobile number';
//       isValid = false;
//     }

//     setErrors(newErrors);
//     return isValid;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;
    
//     setLoading(prev => ({ ...prev, update: true }));
//     setError('');
//     setSuccessMessage('');

//     try {
//       const token = localStorage.getItem('authToken');
//       const response = await axios.put(
//         `http://localhost:4000/UserOperations/update/${profileData._id}`,
//         {
//           name: profileData.name,
//           email: profileData.email,
//           mobile: profileData.mobile,
//           address: profileData.address,
//           bio: profileData.bio,
//           specialization: profileData.specialization
//         },
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           },
//           withCredentials: true
//         }
//       );

//       if (response.data.success) {
//         setSuccessMessage('Profile updated successfully!');
//         setProfileData(response.data.data);
//         localStorage.setItem('userData', JSON.stringify(response.data.data));
//         setIsEditing(false);
//       }
//     } catch (err) {
//       console.error('Update error:', err);
//       if (err.response?.status === 401) {
//         setError('Session expired. Please login again.');
//         handleLogout();
//       } else {
//         setError(err.response?.data?.message || 'Update failed. Please try again.');
//       }
//     } finally {
//       setLoading(prev => ({ ...prev, update: false }));
//     }
//   };

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   return (
//     <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-gradient-to-r from-gray-800 to-gray-900">
//       {/* Notification Messages */}
//       {error && (
//         <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded z-50">
//           {error}
//         </div>
//       )}
//       {successMessage && (
//         <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded z-50">
//           {successMessage}
//         </div>
//       )}

//       {/* Background Elements */}
//       <div className="absolute opacity-40 rounded-full bg-yellow-600 w-32 h-32 -top-12 left-4 z-0"></div>
//       <div className="absolute opacity-40 rounded-full blur-2xl bg-yellow-600 w-72 h-72 -top-10 -left-20 z-0"></div>
//       <div className="absolute opacity-60 rounded-full bg-red-600 w-40 h-40 -bottom-12 -right-20 z-0"></div>
//       <div className="absolute opacity-70 rounded-full blur-2xl bg-red-600 w-64 h-64 -bottom-32 -right-8 z-0"></div>

//       {/* Profile Card */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 w-full max-w-6xl rounded-lg shadow-lg overflow-hidden bg-gradient-to-r from-gray-700 to-gray-800 border-2 border-gray-600">
//         {/* Profile Image Section */}
//         <div className="hidden lg:flex flex-col items-center justify-center p-8 bg-gray-800 relative">
//           <div className="relative mb-6">
//             <img
//               src={ProfileImage}
//               alt="Profile"
//               className="w-40 h-40 rounded-full object-cover border-4 border-gray-600"
//             />
//             {isEditing && (
//               <button className="absolute bottom-0 right-0 bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-full">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                   <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
//                 </svg>
//               </button>
//             )}
//           </div>
//           <h2 className="text-2xl text-white font-medium mb-2">{profileData.name}</h2>
//           <p className="text-gray-400 mb-6">{profileData.specialization}</p>
          
//           {!isEditing && (
//             <div className="w-full px-6">
//               <button
//                 onClick={() => setIsEditing(true)}
//                 className="w-full text-white font-medium py-2 rounded bg-gradient-to-r from-gray-600 to-gray-900 hover:from-gray-500 hover:to-gray-700 transition-colors"
//                 disabled={loading.profile}
//               >
//                 {loading.profile ? 'Loading...' : 'Edit Profile'}
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Profile Info Section */}
//         <div className="p-8 flex flex-col col-span-2">
//           <div className="flex justify-between items-center mb-8">
//             <h1 className="text-3xl text-white font-medium">
//               {isEditing ? 'Edit Profile' : 'My Profile'}
//             </h1>
//             {isEditing && (
//               <button
//                 onClick={() => setIsEditing(false)}
//                 className="text-gray-400 hover:text-white"
//                 disabled={loading.update}
//               >
//                 Cancel
//               </button>
//             )}
//           </div>

//           <form onSubmit={handleSubmit}>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//               {/* Name Field */}
//               <fieldset className="mb-4">
//                 <label className="text-sm text-gray-400">Full Name</label>
//                 {isEditing ? (
//                   <>
//                     <input
//                       type="text"
//                       name="name"
//                       value={profileData.name}
//                       onChange={handleChange}
//                       className={`w-full mt-2 px-4 py-2 rounded border text-white ${
//                         errors.name ? 'border-red-500' : 'border-gray-600'
//                       } bg-gray-700`}
//                       disabled={loading.update}
//                     />
//                     {errors.name && (
//                       <p className="text-red-500 text-xs mt-1">{errors.name}</p>
//                     )}
//                   </>
//                 ) : (
//                   <p className="text-white mt-2">{profileData.name}</p>
//                 )}
//               </fieldset>

//               {/* Email Field */}
//               <fieldset className="mb-4">
//                 <label className="text-sm text-gray-400">Email Address</label>
//                 {isEditing ? (
//                   <>
//                     <input
//                       type="email"
//                       name="email"
//                       value={profileData.email}
//                       onChange={handleChange}
//                       className={`w-full mt-2 px-4 py-2 rounded border text-white ${
//                         errors.email ? 'border-red-500' : 'border-gray-600'
//                       } bg-gray-700`}
//                       disabled={loading.update}
//                     />
//                     {errors.email && (
//                       <p className="text-red-500 text-xs mt-1">{errors.email}</p>
//                     )}
//                   </>
//                 ) : (
//                   <p className="text-white mt-2">{profileData.email}</p>
//                 )}
//               </fieldset>

//               {/* Address Field */}
//               <fieldset className="mb-4">
//                 <label className="text-sm text-gray-400">Address</label>
//                 {isEditing ? (
//                   <>
//                     <input
//                       type="text"
//                       name="address"
//                       value={profileData.address}
//                       onChange={handleChange}
//                       className={`w-full mt-2 px-4 py-2 rounded border text-white ${
//                         errors.address ? 'border-red-500' : 'border-gray-600'
//                       } bg-gray-700`}
//                       disabled={loading.update}
//                     />
//                     {errors.address && (
//                       <p className="text-red-500 text-xs mt-1">{errors.address}</p>
//                     )}
//                   </>
//                 ) : (
//                   <p className="text-white mt-2">{profileData.address}</p>
//                 )}
//               </fieldset>

//               {/* Mobile Field */}
//               <fieldset className="mb-4">
//                 <label className="text-sm text-gray-400">Mobile Number</label>
//                 {isEditing ? (
//                   <>
//                     <input
//                       type="tel"
//                       name="mobile"
//                       value={profileData.mobile}
//                       onChange={handleChange}
//                       className={`w-full mt-2 px-4 py-2 rounded border text-white ${
//                         errors.mobile ? 'border-red-500' : 'border-gray-600'
//                       } bg-gray-700`}
//                       disabled={loading.update}
//                     />
//                     {errors.mobile && (
//                       <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>
//                     )}
//                   </>
//                 ) : (
//                   <p className="text-white mt-2">{profileData.mobile}</p>
//                 )}
//               </fieldset>

//               {/* Specialization Field */}
//               <fieldset className="mb-4">
//                 <label className="text-sm text-gray-400">Specialization</label>
//                 {isEditing ? (
//                   <>
//                     <input
//                       type="text"
//                       name="specialization"
//                       value={profileData.specialization}
//                       onChange={handleChange}
//                       className={`w-full mt-2 px-4 py-2 rounded border text-white ${
//                         errors.specialization ? 'border-red-500' : 'border-gray-600'
//                       } bg-gray-700`}
//                       disabled={loading.update}
//                     />
//                     {errors.specialization && (
//                       <p className="text-red-500 text-xs mt-1">{errors.specialization}</p>
//                     )}
//                   </>
//                 ) : (
//                   <p className="text-white mt-2">{profileData.specialization}</p>
//                 )}
//               </fieldset>
//             </div>

//             {/* Bio Field */}
//             <fieldset className="mb-6">
//               <label className="text-sm text-gray-400">Bio</label>
//               {isEditing ? (
//                 <>
//                   <textarea
//                     name="bio"
//                     value={profileData.bio}
//                     onChange={handleChange}
//                     rows="4"
//                     className={`w-full mt-2 px-4 py-2 rounded border text-white ${
//                       errors.bio ? 'border-red-500' : 'border-gray-600'
//                     } bg-gray-700`}
//                     disabled={loading.update}
//                   />
//                   {errors.bio && (
//                     <p className="text-red-500 text-xs mt-1">{errors.bio}</p>
//                   )}
//                 </>
//               ) : (
//                 <p className="text-white mt-2">{profileData.bio}</p>
//               )}
//             </fieldset>

//             {isEditing && (
//               <div className="flex justify-end gap-4">
//                 <button
//                   type="button"
//                   onClick={() => setIsEditing(false)}
//                   className="px-6 py-2 text-gray-400 hover:text-white"
//                   disabled={loading.update}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-6 py-2 text-white font-medium rounded bg-gradient-to-r from-gray-600 to-gray-900 hover:from-gray-500 hover:to-gray-700 transition-colors"
//                   disabled={loading.update}
//                 >
//                   {loading.update ? 'Saving...' : 'Save Changes'}
//                 </button>
//               </div>
//             )}
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
        const response = await axios.get('http://localhost:4000/UserOperations/getUser', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.data?.success) {
          setProfileData({
            _id: response.data.data._id,
            name: response.data.data.name,
            email: response.data.data.email,
            address: response.data.data.address,
            mobile: response.data.data.mobile,
            profileImage: response.data.data.profileImage || ''
          });
          if (response.data.data.profileImage) {
            setPreviewImage(`http://localhost:4000/${response.data.data.profileImage}`);
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile');
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
      const response = await axios.post(
        `http://localhost:4000/UserOperations/upload-profile-image/${profileData._id}`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
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
        `http://localhost:4000/UserOperations/update/${profileData._id}`,
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

          {/* Card Body */}
          <div className="p-6">

            
            {/* Profile Image Section */}
            {/* <div className="flex flex-col items-center mb-8">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full bg-gray-700 border-2 border-amber-500 overflow-hidden">
                  {previewImage ? (
                    <img 
                      src={previewImage} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-600">
                      <FiUser className="text-4xl text-gray-400" />
                    </div>
                  )}
                </div>
                <label 
                  htmlFor="profileImage"
                  className="absolute bottom-0 right-0 bg-amber-500 text-white p-2 rounded-full cursor-pointer hover:bg-amber-600 transition-colors shadow-lg"
                  title="Change profile image"
                >
                  <FiCamera className="text-lg" />
                  <input
                    id="profileImage"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
              
              {selectedImage && (
                <div className="mt-4 flex space-x-3">
                  <button
                    onClick={uploadProfileImage}
                    disabled={imageLoading}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-70"
                  >
                    {imageLoading ? 'Uploading...' : 'Save Image'}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedImage(null);
                      setPreviewImage(profileData.profileImage ? 
                        `http://localhost:4000/${profileData.profileImage}` : '');
                    }}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div> */}



            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name Field */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-400">
                    <FiUser className="mr-2" />
                    Full Name
                  </label>
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg bg-gray-700/80 text-white border border-gray-600 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all"
                        placeholder="Enter your full name"
                      />
                      {validationErrors.name && (
                        <p className="text-sm text-red-400">{validationErrors.name}</p>
                      )}
                    </>
                  ) : (
                    <div className="px-4 py-2.5 bg-gray-700/50 rounded-lg border border-gray-700">
                      <p className="text-white">{profileData.name}</p>
                    </div>
                  )}
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-400">
                    <FiMail className="mr-2" />
                    Email Address
                  </label>
                  {isEditing ? (
                    <>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg bg-gray-700/80 text-white border border-gray-600 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all"
                        placeholder="Enter your email"
                      />
                      {validationErrors.email && (
                        <p className="text-sm text-red-400">{validationErrors.email}</p>
                      )}
                    </>
                  ) : (
                    <div className="px-4 py-2.5 bg-gray-700/50 rounded-lg border border-gray-700">
                      <p className="text-white">{profileData.email}</p>
                    </div>
                  )}
                </div>

                {/* Mobile Field */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-400">
                    <FiPhone className="mr-2" />
                    Mobile Number
                  </label>
                  {isEditing ? (
                    <>
                      <input
                        type="tel"
                        value={profileData.mobile}
                        onChange={(e) => setProfileData({ ...profileData, mobile: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg bg-gray-700/80 text-white border border-gray-600 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all"
                        placeholder="Enter your mobile number"
                      />
                      {validationErrors.mobile && (
                        <p className="text-sm text-red-400">{validationErrors.mobile}</p>
                      )}
                    </>
                  ) : (
                    <div className="px-4 py-2.5 bg-gray-700/50 rounded-lg border border-gray-700">
                      <p className="text-white">{profileData.mobile}</p>
                    </div>
                  )}
                </div>

                {/* Address Field */}
                <div className="space-y-2 md:col-span-2">
                  <label className="flex items-center text-sm font-medium text-gray-400">
                    <FiMapPin className="mr-2" />
                    Address
                  </label>
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        value={profileData.address}
                        onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg bg-gray-700/80 text-white border border-gray-600 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all"
                        placeholder="Enter your address"
                      />
                      {validationErrors.address && (
                        <p className="text-sm text-red-400">{validationErrors.address}</p>
                      )}
                    </>
                  ) : (
                    <div className="px-4 py-2.5 bg-gray-700/50 rounded-lg border border-gray-700">
                      <p className="text-white">{profileData.address}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Form Actions */}
              {isEditing && (
                <div className="mt-8 flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-2.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors border border-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-70"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </span>
                    ) : 'Save Changes'}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;