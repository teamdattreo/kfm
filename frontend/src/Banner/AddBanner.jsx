

import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS, api } from '../api';

const AddBannerPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    publishDate: new Date().toISOString().split('T')[0],
    isActive: true
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
     const [authChecked, setAuthChecked] = useState(false);
     
  
  // useEffect(() => {
  //   const token = localStorage.getItem('authToken');
    
  //   if (!token) {
  //     navigate('/login');
  //     return;
  //   }

  //   // If we get here, we have a token
  //   setAuthChecked(true);

  //   // Now fetch user data
  //   fetchUserData(token).then(data => setUserData(data));
  // }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPEG, PNG, etc.)');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setError('');
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!fileInputRef.current?.files[0]) {
      setError('Please select an image file');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('image', fileInputRef.current.files[0]);
    formDataToSend.append('publishDate', formData.publishDate);
    formDataToSend.append('isActive', formData.isActive);

    try {
      setIsSubmitting(true);
      
      const response = await api.post(API_ENDPOINTS.BANNERS.ALL, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.success) {
        navigate('/admin/banners');
      } else {
        setError(response.message || 'Failed to add banner');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Failed to add banner. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Background with subtle overlay */}
      <div className="fixed inset-0 bg-cover bg-center z-0 bg-gradient-to-br from-amber-900/20 via-black/70 to-amber-900/20">
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      </div>

      {/* Form Card - Centered with proper spacing */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 pt-16 pb-10">
        <div className="w-full max-w-2xl mx-4">
          <div className="bg-white/20 backdrop-blur-lg rounded-xl shadow-2xl overflow-hidden border border-white/30">
            
            {/* Card Header with Gradient */}
            <div className="bg-gradient-to-r from-amber-400/40 via-amber-500/50 to-amber-600/40 py-5 px-6">
              <h2 className="text-3xl font-bold text-center text-white drop-shadow-lg">
                <span className="bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
                  Studio
                </span>
                <span className="text-white">KFM</span>
              </h2>
              <p className="text-sm text-center text-amber-100 mt-1 tracking-wider font-medium">
                ADD NEW BANNER
              </p>
            </div>
            
            <div className="p-6">
              {/* Error message */}
              {error && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-100">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Banner Image Upload */}
                <div>
                  <label className="block text-amber-100/90 text-sm font-medium mb-2">
                    Banner Image *
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col w-full h-32 border-2 border-dashed border-white/30 hover:border-amber-400/50 group rounded-lg cursor-pointer transition-all">
                      <div className="flex flex-col items-center justify-center pt-7">
                        {previewImage ? (
                          <img 
                            src={previewImage} 
                            alt="Preview" 
                            className="h-24 object-contain rounded-md"
                          />
                        ) : (
                          <>
                            <svg
                              className="w-10 h-10 text-amber-300 group-hover:text-amber-400 transition-all"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              ></path>
                            </svg>
                            <p className="text-sm text-amber-100/80 group-hover:text-amber-200 pt-1">
                              Click to upload or drag and drop
                            </p>
                            <p className="text-xs text-amber-100/60">
                              PNG, JPG up to 5MB
                            </p>
                          </>
                        )}
                      </div>
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                      />
                    </label>
                  </div>
                </div>

                {/* Publish Date */}
                <div>
                  <label className="block text-amber-100/90 text-sm font-medium mb-2">
                    Publish Date *
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      id="publishDate"
                      name="publishDate"
                      value={formData.publishDate}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/15 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-transparent transition-all appearance-none"
                      required
                    />
                    <svg
                      className="absolute right-3 top-3.5 h-5 w-5 text-amber-300 pointer-events-none"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      ></path>
                    </svg>
                  </div>
                </div>

                {/* Active Status */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      isActive: e.target.checked
                    }))}
                    className="h-4 w-4 text-amber-500 focus:ring-amber-400 border-white/30 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-amber-100/90">
                    Active Banner
                  </label>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => navigate('/AdminBannerPage')}
                    className="px-5 py-2.5 border border-amber-300/50 text-amber-100 rounded-lg hover:bg-amber-900/30 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium rounded-lg shadow-md transition-all duration-300 ${
                      isSubmitting
                        ? 'opacity-70 cursor-not-allowed'
                        : 'hover:from-amber-600 hover:to-amber-700 hover:shadow-lg'
                    } focus:outline-none focus:ring-2 focus:ring-amber-400/50`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Uploading...
                      </span>
                    ) : (
                      'Add Banner'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBannerPage;