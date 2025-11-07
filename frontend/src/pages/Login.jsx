// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios'; // You need to import axios
// import LoginImage from '../assets/login.jpg';
// import bglogin from '../assets/bg-login.png';

// const Login = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     email: '',
//     password: ''
//   });
//   const [errors, setErrors] = useState({
//     email: '',
//     password: ''
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState(''); // Added for API error handling

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value
//     });
//     // Clear error when user starts typing
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
//       email: '',
//       password: ''
//     };

//     // Email validation
//     if (!formData.email) {
//       newErrors.email = 'Email is required';
//       isValid = false;
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       newErrors.email = 'Please enter a valid email address';
//       isValid = false;
//     }

//     // Password validation
//     if (!formData.password) {
//       newErrors.password = 'Password is required';
//       isValid = false;
//     } else if (formData.password.length < 6) {
//       newErrors.password = 'Password must be at least 6 characters';
//       isValid = false;
//     }

//     setErrors(newErrors);
//     return isValid;
//   };

//   const handleSubmit = async (e) => { // Changed from handleLogin to handleSubmit to match form submission
//     e.preventDefault();
    
//     if (!validateForm()) {
//       return;
//     }
    
//     setIsSubmitting(true);
//     setError('');

//     try {
//       const response = await axios.post(
//         'http://localhost:4000/UserOperations/login',
//         { 
//           email: formData.email, // Use formData.email instead of just email
//           password: formData.password // Use formData.password instead of just password
//         },
//         {
//           headers: { 'Content-Type': 'application/json' },
//           withCredentials: true
//         }
//       );

//       if (response.data && response.data.token) {
//         localStorage.setItem('authToken', response.data.token);
//         if (response.data.user) {
//           localStorage.setItem('userData', JSON.stringify(response.data.user));
//         }
//         if (response.data.user.type === 'admin') {
//           navigate('/AdminDashboard');
//         } else {
//           navigate('/Profile');
//         }
//       } else {
//         throw new Error('Invalid response from server');
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || 'Invalid login credentials');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div
//       className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
//       style={{
//         background: `linear-gradient(to right, rgba(255, 255, 255, 0), rgba(232, 232, 232, 0)), url(${bglogin})`,
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//         backgroundRepeat: 'no-repeat',
//         backgroundAttachment: 'fixed',
//       }}>
//       {/* Yellow Circle */}
//       <div
//         className="absolute opacity-40 rounded-full"
//         style={{
//           backgroundColor: '#BF9B30',
//           width: '120px',
//           height: '120px',
//           top: '-50px',
//           left: '20px',
//           zIndex: 0,
//         }}
//       ></div>

//       {/* Yellow Blur */}
//       <div
//         className="absolute opacity-60 rounded-full blur-2xl"
//         style={{
//           backgroundColor: '#BF9B30',
//           width: '300px',
//           height: '300px',
//           top: '-40px',
//           left: '-80px',
//           zIndex: 0,
//         }}
//       ></div>

//       {/* Red Circle */}
//       <div
//         className="absolute opacity-60 rounded-full"
//         style={{
//           backgroundColor: '#BF3030',
//           width: '160px',
//           height: '160px',
//           bottom: '-50px',
//           right: '-90px',
//           zIndex: 0,
//         }}
//       ></div>

//       {/* Red Blur */}
//       <div
//         className="absolute opacity-70 rounded-full blur-2xl"
//         style={{
//           backgroundColor: '#BF3030',
//           width: '260px',
//           height: '260px',
//           bottom: '-130px',
//           right: '-30px',
//           zIndex: 0,
//         }}
//       ></div>

//       <form onSubmit={handleSubmit}>
//         <div
//           className="grid grid-cols-1 md:grid-cols-2 w-full max-w-4xl rounded-lg shadow-lg overflow-hidden"
//           style={{
//             backgroundColor: 'rgba(255, 255, 255, 0.2)',
//             backdropFilter: 'blur(8px)',
//             border: '1px solid rgba(59, 62, 69, 0.5)',
//           }}
//         >
//           <div className="p-8 md:p-10 flex flex-col justify-center">
//             <h1 className="text-3xl text-black font-sans font-medium mb-6 text-center md:text-left">
//               Sign in
//             </h1>

//             {/* Display API error if exists */}
//             {error && (
//               <div className="mb-4 p-2 text-sm text-red-600 bg-red-100 rounded">
//                 {error}
//               </div>
//             )}

//             <fieldset className="mb-4">
//               <label className="text-sm text-gray-800">Your Email</label>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className={`w-full mt-2 px-4 py-2 rounded-lg border text-white ${
//                   errors.email ? 'border-red-500' : 'border-[#3B3E45]'
//                 }`}
//                 style={{
//                   backgroundColor: '#212224',
//                 }}
//                 placeholder="studio@gmail.com"
//               />
//               {errors.email && (
//                 <p className="text-red-500 text-xs mt-1">{errors.email}</p>
//               )}
//             </fieldset>

//             <div className="flex justify-between items-center mb-1">
//               <label className="text-sm font-medium text-gray-800">Password</label>
//               <a href="#" className="text-sm font-medium text-gray-800 hover:underline hover:text-white">
//                 Forgot Password?
//               </a>
//             </div>

//             <fieldset className="mb-6 mt-4">
//               <input
//                 type="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 className={`w-full px-4 py-2 rounded-lg border text-white ${
//                   errors.password ? 'border-red-500' : 'border-[#3B3E45]'
//                 }`}
//                 style={{
//                   backgroundColor: '#212224',
//                 }}
//                 placeholder="• • • • • • • •"
//               />
//               {errors.password && (
//                 <p className="text-red-500 text-xs mt-1">{errors.password}</p>
//               )}
//             </fieldset>

//             <button 
//               type="submit"
//               disabled={isSubmitting}
//               className={`w-full text-white font-medium py-2 rounded-lg bg-gradient-to-r from-gray-600 to-black hover:from-gray-400 hover:to-gray-800 ${
//                 isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
//               }`}
//             >
//               {isSubmitting ? 'Signing in...' : 'Sign in'}
//             </button>

//             <p className="text-sm font-medium text-gray-800 text-center mt-4">
//               Don&apos;t have an account?{' '}
//               <button 
//                 type="button"
//                 onClick={() => navigate('/signup')}
//                 className="btn btn-link no-underline text-gray-800 hover:underline hover:text-white p-0 mb-1"
//               >
//                 Sign up
//               </button>
//             </p>
//           </div>

//           <div className="hidden md:block h-full w-full mt-3 p-3">
//             <img
//               src={LoginImage}
//               alt="Login Illustration"
//               className="h-full w-full object-cover rounded-lg"
//               style={{
//                 maxHeight: 'calc(100% - 40px)'
//               }}
//             />
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default Login;

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { GoogleLogin } from '@react-oauth/google';
// import { jwtDecode } from 'jwt-decode';
// import LoginImage from '../assets/login.jpg';
// import bglogin from '../assets/bg-login.png';

// const Login = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//     authProvider: 'email' // Track authentication method
//   });
  
//   const [errors, setErrors] = useState({
//     email: '',
//     password: ''
//   });
  
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState('');

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
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
//     const newErrors = { email: '', password: '' };

//     if (!formData.email) {
//       newErrors.email = 'Email is required';
//       isValid = false;
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       newErrors.email = 'Please enter a valid email address';
//       isValid = false;
//     }

//     // Only validate password for email login
//     if (formData.authProvider === 'email' && !formData.password) {
//       newErrors.password = 'Password is required';
//       isValid = false;
//     }

//     setErrors(newErrors);
//     return isValid;
//   };

//   const handleGoogleSuccess = async (credentialResponse) => {
//     try {
//         const decoded = jwtDecode(credentialResponse.credential);
//         setIsSubmitting(true);
//         setError('');

//         const response = await axios.post(
//             'http://localhost:4000/UserOperations/login',
//             { 
//                 email: decoded.email,
//                 authProvider: 'google'
//             },
//             {
//                 headers: { 'Content-Type': 'application/json' }
//             }
//         );

//         if (response.data?.token) {
//             localStorage.setItem('authToken', response.data.token);
//             if (response.data.user) {
//                 localStorage.setItem('userData', JSON.stringify(response.data.user));
//                           localStorage.setItem('userId', response.data.user._id);  

//             }
//             navigate(response.data.user?.type === 'admin' ? '/AdminProfile' : '/UserHomePage');
//         } else {
//             throw new Error('Google authentication failed');
//         }
//     } catch (err) {
//         setError(err.response?.data?.message || 'Google login failed. Please try again.');
//     } finally {
//         setIsSubmitting(false);
//     }
// };

// const handleGoogleError = () => {
//     setError('Google Sign-In failed. Please try again or use email login.');
// };

// // // Add this to your GoogleLogin component props:
// // <GoogleLogin
// //     onSuccess={handleGoogleSuccess}
// //     onError={handleGoogleError}
// //     useOneTap
// //     theme="filled_black"
// //     size="large"
// //     text="signin_with"
// //     shape="rectangular"
// //     logo_alignment="left"
// //     width="300"
// //     ux_mode="popup"  // Add this line
// //     clientId="YOUR_GOOGLE_CLIENT_ID"  // Make sure to add your actual client ID
// // />

//   const handleLoginSuccess = (data) => {
//     localStorage.setItem('authToken', data.token);
//     if (data.user) {
//       localStorage.setItem('userData', JSON.stringify(data.user));
//           localStorage.setItem('userId', data.user._id);  

//     }
//     navigate(data.user?.type === 'admin' ? '/AdminProfile' : '/UserHomePage');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       return;
//     }
    
//     setIsSubmitting(true);
//     setError('');

//     console.log("Sending login request with:", {
//       email: formData.email,
//       password: formData.password,
//       authProvider: formData.authProvider
//     });

//     try {
//       const response = await axios.post(
//         'http://localhost:4000/UserOperations/login',
//         {
//           email: formData.email,
//           password: formData.password,
//           authProvider: formData.authProvider
//         },
//         {
//           headers: { 'Content-Type': 'application/json' },
//           withCredentials: true
//         }
//       );

//       if (response.data?.token) {
//         handleLoginSuccess(response.data);
//       } else {
//         throw new Error('Invalid response from server');
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || 'Invalid login credentials');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
//       style={{
//         background: `linear-gradient(to right, rgba(255, 255, 255, 0), rgba(232, 232, 232, 0)), url(${bglogin})`,
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//       }}>
      
//       {/* Background elements (same as before) */}

//       <form onSubmit={handleSubmit}>
//         <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-4xl rounded-lg shadow-lg overflow-hidden"
//           style={{
//             backgroundColor: 'rgba(255, 255, 255, 0.2)',
//             backdropFilter: 'blur(8px)',
//             border: '1px solid rgba(59, 62, 69, 0.5)',
//           }}>
          
//           <div className="p-8 md:p-10 flex flex-col justify-center">
//             <h1 className="text-3xl text-black font-sans font-medium mb-6 text-center md:text-left">
//               Sign in
//             </h1>

//             {error && (
//               <div className="mb-4 p-3 text-sm text-red-600 bg-red-100 rounded">
//                 {error}
//               </div>
//             )}

//             <div
//             className="mb-6 flex justify-center transition-all duration-300 hover:scale-105 hover:shadow-xl"
//             >
//             <GoogleLogin
//               onSuccess={handleGoogleSuccess}
//               onError={handleGoogleError}
//               useOneTap
//               theme="filled_white"
//               size="large"
//               text="signin_with"
//               shape="rectangular"
//               logo_alignment="left"
//               width="370"
//             />
//             </div>


//             <div className="relative flex items-center py-4">
//               <div className="flex-grow border-t border-gray-300"></div>
//               <span className="flex-shrink mx-4 text-gray-400">or sign in with email</span>
//               <div className="flex-grow border-t border-gray-300"></div>
//             </div>

//             <fieldset className="mb-4">
//               <label className="text-sm text-gray-800">Your Email</label>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className={`w-full mt-2 px-4 py-2 rounded-lg border ${
//                   errors.email ? 'border-red-500' : 'border-gray-300'
//                 } bg-white bg-opacity-70`}
//                 // style={{ backgroundColor: '#212224' }}
//                 placeholder="kfm@gmail.com"
//               />
//               {errors.email && (
//                 <p className="text-red-500 text-xs mt-1">{errors.email}</p>
//               )}
//             </fieldset>

//             <div className="flex justify-between items-center mb-1">
//               <label className="text-sm font-medium text-gray-800">Password</label>
//               <a href="#" className="text-sm font-medium text-gray-800 hover:underline hover:text-white">
//                 Forgot Password?
//               </a>
//             </div>

//             <fieldset className="mb-6 mt-4">
//               <input
//                 type="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 className={`w-full px-4 py-2 rounded-lg border ${
//                   errors.password ? 'border-red-500' : 'border-gray-300'
//                 } bg-white bg-opacity-70`}
//                 // style={{ backgroundColor: '#212224' }}
//                 placeholder="••••••••"
//               />
//               {errors.password && (
//                 <p className="text-red-500 text-xs mt-1">{errors.password}</p>
//               )}
//             </fieldset>

//             <button 
//               type="submit"
//               disabled={isSubmitting}
//               className={`w-full text-white font-medium py-2 rounded-lg bg-gray-800 hover:bg-gray-700 ${
//                 isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
//               }`}
//             >
//               {isSubmitting ? 'Signing in...' : 'Sign in'}
//             </button>

//             <p className="text-sm font-medium text-gray-800 text-center mt-4">
//               Don&apos;t have an account?{' '}
//               <button 
//                 type="button"
//                 onClick={() => navigate('/signup')}
//                 className="btn btn-link no-underline text-gray-800 hover:underline hover:text-white p-0 mb-1"
//               >
//                 Sign up
//               </button>
//             </p>
//           </div>

//           <div className="hidden md:block h-full w-full mt-3 p-3">
//             <img
//               src={LoginImage}
//               alt="Login Illustration"
//               className="h-full w-full object-cover rounded-lg"
//               style={{ maxHeight: 'calc(100% - 40px)' }}
//             />
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default Login;


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { GoogleLogin } from '@react-oauth/google';
import LoginImage from '../assets/login.jpg';
import bglogin from '../assets/login.jpg';

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    authProvider: 'email'
  });

  const [errors, setErrors] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: '', password: '' };

    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (formData.authProvider === 'email' && !formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLoginSuccess = (data) => {
    localStorage.setItem('authToken', data.token);
    if (data.user) {
      localStorage.setItem('userData', JSON.stringify(data.user));
      localStorage.setItem('userId', data.user._id);
    }

    // ✅ Use role (NOT "type")
    navigate(data.user?.role === 'admin' ? '/AdminProfile' : '/UserHomePage');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setError('');

    try {
      const response = await axios.post(
        'http://localhost:4000/UserOperations/login',
        {
          email: formData.email,
          password: formData.password,
          authProvider: formData.authProvider
        },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );

      if (response.data?.token) {
        handleLoginSuccess(response.data);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid login credentials');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      setIsSubmitting(true);
      setError('');

      const response = await axios.post(
        'http://localhost:4000/UserOperations/login',
        {
          email: decoded.email,
          authProvider: 'google'
        },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );

      if (response.data?.token) {
        handleLoginSuccess(response.data);
      } else {
        throw new Error('Google authentication failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Google login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google Sign-In failed. Please try again or use email login.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{
        background: `linear-gradient(to right, rgba(255, 255, 255, 0), rgba(232, 232, 232, 0)), url(${bglogin})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-4xl rounded-lg shadow-lg overflow-hidden"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(59, 62, 69, 0.5)',
          }}>
          <div className="p-8 md:p-10 flex flex-col justify-center">
            <h1 className="text-3xl text-white font-sans font-medium mb-6 text-center md:text-left">
              Sign in
            </h1>


            <fieldset className="mb-4 mt-4">
              <label className="text-sm text-gray-800">Your Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full mt-2 px-4 py-2 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} bg-white bg-opacity-70`}
                placeholder="kfm@gmail.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </fieldset>

            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium text-gray-800">Password</label>
              <a href="#" className="text-sm font-medium text-gray-800 hover:underline hover:text-white">
                Forgot Password?
              </a>
            </div>

            <fieldset className="mb-6 mt-4">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'} bg-white bg-opacity-70`}
                placeholder="••••••••"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </fieldset>

            {error && (
              <div className="mb-4 p-3 text-sm text-red-600 bg-red-100 rounded">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full text-white font-medium py-2 rounded-lg bg-amber-500 hover:bg-amber-600 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>



            <div className="relative flex items-center py-6 mt-8">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-gray-400">or sign in with email</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>


            <div className="mb-6 flex justify-center transition-all duration-300 hover:scale-105 hover:shadow-xs">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap
                theme="filled_white"
                size="large"
                text="signin_with"
                shape="rectangular"
                logo_alignment="left"
                width="200"
              />
            </div>

            <p className="text-sm font-medium text-gray-800 text-center mt-4">
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="btn btn-link no-underline text-gray-800 hover:underline hover:text-white p-0 mb-1"
              >
                Sign up
              </button>
            </p>
          </div>

          <div className="hidden md:block h-full w-full mt-3 p-3">
            <img
              src={LoginImage}
              alt="Login Illustration"
              className="h-full w-full object-cover rounded-lg"
              style={{ maxHeight: 'calc(100% - 40px)' }}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
