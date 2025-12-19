
import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS, api } from '../api';
import SignUpImage from '../assets/signup1.jpg';
import { useNavigate } from 'react-router-dom';

import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { FiArrowLeft } from 'react-icons/fi';
import bgsignup from '../assets/signup1.jpg'
import Animation from '../components/animation';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    mobile: '',
    password: '',
    cpassword: '',
    authProvider: 'email'
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    address: '',
    mobile: '',
    password: '',
    cpassword: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const [isGoogleSignUp, setIsGoogleSignUp] = useState(false);
  const [showVerificationPopup, setShowVerificationPopup] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  // Handle countdown for resend button
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    // Reset errors
    Object.keys(newErrors).forEach(key => {
      newErrors[key] = '';
    });

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
      isValid = false;
    }

    if (!formData.mobile) {
      newErrors.mobile = 'Mobile number is required';
      isValid = false;
    } else if (!/^[0-9]{10,15}$/.test(formData.mobile)) {
      newErrors.mobile = 'Please enter a valid mobile number';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      isValid = false;
    }

    if (!formData.cpassword) {
      newErrors.cpassword = 'Please confirm your password';
      isValid = false;
    } else if (formData.password !== formData.cpassword) {
      newErrors.cpassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      
      setFormData({
        ...formData,
        name: decoded.name || '',
        email: decoded.email || '',
        authProvider: 'google'
      });

      setIsGoogleSignUp(true);
      setApiError('');
    } catch (error) {
      setApiError("Failed to connect Google account");
      console.error("Google auth error:", error);
    }
  };

  const handleGoogleError = () => {
    setApiError("Google Sign-In failed");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setApiError('');

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        address: formData.address,
        mobile: formData.mobile,
        password: formData.password,
        authProvider: formData.authProvider
      };

      const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, payload);

      if (response?.message && response.message.includes('verification')) {
        setRegisteredEmail(formData.email);
        setShowVerificationPopup(true);
        setResendCooldown(30); // 30 seconds cooldown
      } else {
        navigate('/login');
      }
    } catch (error) {
      const errorMessage = error.data?.message ||
                         error.message ||
                         'Registration failed. Please try again.';
      setApiError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      setIsSubmitting(true);
      await api.post(API_ENDPOINTS.AUTH.RESEND_VERIFICATION, {
        email: registeredEmail
      });
      setResendCooldown(30); // Reset cooldown
      alert('Verification email resent successfully!');
    } catch (error) {
      alert('Failed to resend verification email. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
    className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
    style={{
      background: `linear-gradient(to right, rgba(255, 255, 255, 0), rgba(232, 232, 232, 0)), url(${bgsignup})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
    }}
    >
      <Animation/>

      <form onSubmit={handleSubmit} className="w-full max-w-6xl mx-auto px-4">
        <div className="w-full mb-6">
          <button 
            type="button"
            onClick={() => navigate('/')}
            className="flex items-center text-white hover:text-gray-200 transition-colors"
          >
            <FiArrowLeft className="mr-2" /> Back to Home
          </button>
        </div>
        
        <div className="relative">
        <div
          className="grid grid-cols-1 lg:grid-cols-3 w-full max-w-6xl rounded-2xl shadow-lg overflow-hidden"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(59, 62, 69, 0.5)',
          }}
        >
          <div className="p-8 flex flex-col justify-center col-span-2">
            <h1 className="text-3xl text-white font-medium mb-6 text-center lg:text-left">
              Sign Up
            </h1>

            {apiError && (
              <div className="mb-4 p-2 text-sm text-red-600 bg-red-100 rounded">
                {apiError}
              </div>
            )}


            {isGoogleSignUp && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-800 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                </svg>
                You're signing up with Google. Please create a password below.
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="mb-4">
                <label className="block text-sm text-gray-800 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300'} bg-white bg-opacity-70`}
                  placeholder="Enter your name"
                  required
                  readOnly={isGoogleSignUp}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-sm text-gray-800 mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} bg-white bg-opacity-70`}
                  placeholder="example@gmail.com"
                  required
                  readOnly={isGoogleSignUp}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-sm text-gray-800 mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg border ${errors.address ? 'border-red-500' : 'border-gray-300'} bg-white bg-opacity-70`}
                  placeholder="Enter your address"
                  required
                />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-sm text-gray-800 mb-1">Mobile Number</label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg border ${errors.mobile ? 'border-red-500' : 'border-gray-300'} bg-white bg-opacity-70`}
                  placeholder="Enter mobile number"
                  required
                />
                {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-sm text-gray-800 mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'} bg-white bg-opacity-70`}
                  placeholder="••••••••"
                  required
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-sm text-gray-800 mb-1">Confirm Password</label>
                <input
                  type="password"
                  name="cpassword"
                  value={formData.cpassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg border ${errors.cpassword ? 'border-red-500' : 'border-gray-300'} bg-white bg-opacity-70`}
                  placeholder="••••••••"
                  required
                />
                {errors.cpassword && <p className="text-red-500 text-xs mt-1">{errors.cpassword}</p>}
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full md:w-1/2 text-white font-medium py-2 rounded-lg bg-amber-500 hover:bg-amber-600 transition ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isGoogleSignUp ? 'Creating Google Account...' : 'Creating Account...'}
                  </>
                ) : isGoogleSignUp ? 'Complete Google Registration' : 'Complete Registration'}
              </button>
            </div>



            <div className="relative flex items-center py-4 mt-6">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-gray-200">
                {isGoogleSignUp ? 'Continue with Google registration' : 'or register manually'}
              </span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>


            {/* <div className="my-4 flex justify-center transition-all duration-300 hover:scale-105 hover:shadow-xs">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap
                theme="filled_white"
                size="large"
                text="signup_with"
                shape="rectangular"
                logo_alignment="left"
                width="200"
              />
            </div> */}
  <div className="w-full flex justify-center">
  <div 
    className="flex items-center justify-center w-full md:w-1/2 px-4 py-3 bg-white rounded-lg border border-gray-200 shadow-sm hover:bg-gray-50 transition-all duration-200 cursor-pointer"
    onClick={() => document.querySelector('div[role="button"]').click()}
  >
    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
    <span className="text-gray-700 font-medium">Continue with Google</span>
  </div>
  <div className="hidden">
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
</div>


            <p className="text-sm font-medium text-gray-800 text-center mt-4">
              Already have an account?{' '}
              <button 
                type="button"
                onClick={() => navigate('/login')}
                className="text-gray-800 font-semibold hover:underline hover:text-white"
              >
                Sign in
              </button>
            </p>
          </div>

          <div className="hidden lg:block">
            <img
              src={SignUpImage}
              alt="Sign Up Illustration"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
      </form>

      {/* Verification Popup */}
      {showVerificationPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Verify Your Email</h3>
              <button 
                onClick={() => setShowVerificationPopup(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-700 mb-2">
                We've sent a verification link to <span className="font-semibold">{registeredEmail}</span>.
              </p>
              <p className="text-gray-700 mb-4">
                Please check your inbox and click the link to verify your email address.
              </p>
              
              <div className="bg-blue-50 p-3 rounded-lg flex items-start">
                <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm text-blue-700">
                    Didn't receive the email? Check your spam folder or 
                    <button 
                      className={`ml-1 ${resendCooldown > 0 ? 'text-blue-400' : 'text-blue-600 font-medium hover:underline'}`}
                      onClick={handleResendVerification}
                      disabled={resendCooldown > 0}
                    >
                      {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'resend verification email'}
                    </button>.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setShowVerificationPopup(false);
                  navigate('/login');
                }}
                className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUp;
