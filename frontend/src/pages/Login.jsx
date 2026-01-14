import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS, api } from '../api';
import { jwtDecode } from 'jwt-decode';
import { GoogleLogin } from '@react-oauth/google';
import LoginImage from '../assets/login.jpg';
import bglogin from '../assets/login.jpg';
import { FiArrowLeft } from 'react-icons/fi';

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
  const [showPassword, setShowPassword] = useState(false);

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
      const response = await api.post(
        API_ENDPOINTS.AUTH.LOGIN,
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

      if (response?.token) {
        handleLoginSuccess(response);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      setError(err.data?.message || err.message || 'Invalid login credentials');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      setIsSubmitting(true);
      setError('');

      // const response = await axios.post(
      //   'http://localhost:4000/UserOperations/login',
      //   {
      //     email: decoded.email,
      //     authProvider: 'google'
      //   },
      //   {
      //     headers: { 'Content-Type': 'application/json' }
      //   }
      // );
      const response = await api.post(
        API_ENDPOINTS.AUTH.LOGIN,
        {
          email: decoded.email,
          authProvider: 'google'
        },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );

      if (response?.token) {
        handleLoginSuccess(response);
      } else {
        throw new Error('Google authentication failed');
      }
    } catch (err) {
      setError(err.data?.message || err.message || 'Google login failed. Please try again.');
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
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}>
      <div className="w-full max-w-4xl mx-auto px-4">
        <button 
          type="button"
          onClick={() => navigate('/')}
          className="flex items-center text-white hover:text-gray-200 mb-6 transition-colors"
        >
          <FiArrowLeft className="mr-2" /> Back to Home
        </button>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 w-full rounded-lg shadow-lg overflow-hidden"
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
                className={`w-full mt-2 px-4 py-2 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} bg-white bg-opacity-70 text-gray-900 placeholder-gray-500`}
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
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 pr-14 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'} bg-white bg-opacity-70 text-gray-900 placeholder-gray-500`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
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


            {/* <div className="mb-6 flex justify-center transition-all duration-300 hover:scale-105 hover:shadow-xs">
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
            </div> */}
            <div className="w-full">
  <div 
    className="flex items-center justify-center w-full px-4 py-3 bg-white rounded-lg border border-gray-200 shadow-sm hover:bg-gray-50 transition-all duration-200 cursor-pointer"
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
   
      theme="filled_white"
      size="large"
      text="signin_with"
      shape="rectangular"
      logo_alignment="left"
      width="200"
    />
  </div>
</div>

            <p className="text-base sm:text-sm font-medium text-gray-900 text-center mt-5 transition-colors duration-200 group">
              <span onClick={() => navigate('/signup')} className="transition-colors duration-200 group-hover:text-white">
                Don&apos;t have an account?{' '}
              </span>
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="btn btn-link no-underline text-gray-900 p-0 mb-1 underline underline-offset-4 transition-colors duration-200 sm:no-underline group-hover:underline group-hover:text-white focus-visible:underline focus-visible:text-white"
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
    </div>
  );
};

export default Login;
