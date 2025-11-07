import { useState, useRef,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdvancedImage } from '@cloudinary/react';
import axios from 'axios';

const AddPromotion = () => {
  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        navigate('/login');
        return;
      }
  
      try {
        setLoading(true);
        const userData = await fetchUserData(token);
        setUserData(userData);
        setAuthChecked(true);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        // Handle specific error cases
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          navigate('/login', { state: { from: 'session_expired' } });
        } else {
          setError(error.message || 'Failed to load user data');
        }
      } finally {
        setLoading(false);
      }
    };
  
    checkAuthAndFetchData();
  }, [navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file (JPEG, PNG, etc.)');
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }

      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!image) {
      setError('Please select an image');
      return;
    }
    
    if (!description || description.trim().length < 10) {
      setError('Please enter a description (minimum 10 characters)');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', image);
      formData.append('description', description);

      // Upload to backend API
      const response = await axios.post('http://localhost:4000/promotions', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Show success message
      alert('Promotion added successfully!');
      
      // Redirect to promotions list
      navigate('/AdminPromo');

    } catch (error) {
      console.error('Error adding promotion:', error);
      
      let errorMessage = 'Failed to add promotion';
      if (error.response) {
        if (error.response.status === 413) {
          errorMessage = 'File size is too large (max 5MB)';
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsUploading(false);
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
                ADD NEW PROMOTION
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
                <div>
                  <label className="block text-amber-100/90 text-sm font-medium mb-2">
                    Promotion Description *
                  </label>
                  <textarea
                    className="w-full px-4 py-3 bg-white/15 border border-white/30 rounded-lg text-white placeholder-amber-100/60 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-transparent transition-all"
                    rows="4"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter promotion description (minimum 10 characters)"
                    required
                    minLength="10"
                  />
                </div>

                <div>
                  <label className="block text-amber-100/90 text-sm font-medium mb-2">
                    Promotion Image * (max 5MB)
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="flex-1">
                      <div className="w-full px-4 py-3 bg-white/15 border border-white/30 rounded-lg text-white cursor-pointer hover:bg-white/20 transition-all">
                        <span className="text-amber-200">
                          {image ? 'Change Image' : 'Choose Image'}
                        </span>
                        <input
                          type="file"
                          ref={fileInputRef}
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          required
                        />
                      </div>
                    </label>
                    {imagePreview && (
                      <div className="flex-shrink-0 relative group">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="h-16 w-16 object-cover rounded-lg border border-white/30"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImage(null);
                            setImagePreview(null);
                            if (fileInputRef.current) fileInputRef.current.value = '';
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => navigate('/AdminPromo')}
                    className="px-6 py-2 border border-amber-400 text-amber-300 rounded-lg hover:bg-amber-900/30 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading}
                    className={`px-6 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 ${
                      isUploading 
                        ? 'opacity-70 cursor-not-allowed' 
                        : 'hover:from-amber-600 hover:to-amber-700 hover:shadow-xl'
                    }`}
                  >
                    {isUploading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Uploading...
                      </span>
                    ) : (
                      'Add Promotion'
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

export default AddPromotion;