

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS, api } from '../api';

const BannerShowPage = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [failedImages, setFailedImages] = useState({});
   const [authChecked, setAuthChecked] = useState(false);


   const navigate = useNavigate();
  useEffect(() => {

    // const token = localStorage.getItem('authToken');
    // if (!token) {
    //   navigate('/login');
    //   return;
    // }
    setAuthChecked(true);
    const fetchBanners = async () => {
      try {
        console.log('Fetching banners from:', API_ENDPOINTS.BANNERS.ACTIVE);
        const response = await api.get(API_ENDPOINTS.BANNERS.ACTIVE);
        console.log('Full API Response:', response);
        
        let bannersData = [];
        
        // Handle array response directly since we know the API returns an array
        if (Array.isArray(response)) {
          console.log('Processing array response. First item:', response[0]);
          bannersData = response.map((banner, index) => ({
            _id: banner._id || `banner-${index}`,
            imageUrl: banner.imageUrl || banner.bannerUrl || banner.url || banner.image || banner.image_url
          })).filter(banner => banner.imageUrl); // Only keep banners with valid image URLs
          
          console.log('Mapped banners data:', bannersData);
        } 
        // Fallback for other response formats if needed
        else if (response?.data && Array.isArray(response.data)) {
          console.log('Processing response.data array. First item:', response.data[0]);
          bannersData = response.data.map((banner, index) => ({
            _id: banner._id || `banner-${index}`,
            imageUrl: banner.imageUrl || banner.bannerUrl || banner.url || banner.image || banner.image_url
          })).filter(banner => banner.imageUrl);
        }
        
        console.log('Final banners data:', bannersData);
        setBanners(bannersData);
      } catch (err) {
        console.error('Error fetching banners:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
          statusText: err.response?.statusText
        });
        setError(err.message || 'Failed to load banners');
        setBanners([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // Auto-rotate banners
  useEffect(() => {
    if (Array.isArray(banners) && banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % banners.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [banners]);

  const handleImageError = (id) => {
    setFailedImages(prev => ({ ...prev, [id]: true }));
  };

  if (loading) {
    return (
      <div className="relative min-h-[400px] flex items-center justify-center">
        <div className="text-amber-300 animate-pulse">
          <svg className="w-12 h-12 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-xl font-medium text-amber-100">Loading banners...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative min-h-[400px] flex items-center justify-center">
        <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-6 max-w-md mx-auto">
          <svg className="w-12 h-12 mx-auto mb-3 text-red-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-center text-red-100">{error}</p>
        </div>
      </div>
    );
  }

  if (!Array.isArray(banners)) {
    return (
      <div className="relative min-h-[400px] flex items-center justify-center">
        <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-6 max-w-md mx-auto">
          <p className="text-center text-red-100">Invalid banners data format</p>
        </div>
      </div>
    );
  }

  if (banners.length === 0) {
    return (
      <div className="relative min-h-[400px] flex items-center justify-center">
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-6 max-w-md mx-auto">
          <svg className="w-12 h-12 mx-auto mb-3 text-amber-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-center text-amber-100">No active banners to display</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* <div className="absolute inset-0 bg-gradient-to-b from-amber-900/10 via-black/30 to-amber-900/10 z-10 pointer-events-none"></div> */}
      
      <div className="relative w-full h-64 md:h-[32rem] overflow-hidden rounded-xl shadow-2xl border border-white/20 backdrop-blur-sm">
        {banners.map((banner, index) => (
          <div
            key={banner._id || index}  // Using _id or index as fallback
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
          >
            {failedImages[banner._id] ? (
              <div className="w-full h-full flex items-center justify-center bg-black/50">
                <div className="text-center p-6">
                  <svg className="w-16 h-16 mx-auto text-amber-300 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-amber-100 text-lg">Banner image unavailable</p>
                </div>
              </div>
            ) : (
              <img
                src={banner.imageUrl}
                alt={`Banner ${index + 1}`}
                className="w-full h-full object-cover"
                onError={() => handleImageError(banner._id)}
              />
            )}
          </div>
        ))}

        {/* Navigation arrows */}
        {banners.length > 1 && (
          <>
            <button
              key="prev-button"
              onClick={() => setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 hover:bg-amber-500/50 transition-all duration-300"
              aria-label="Previous banner"
            >
              <svg className="w-6 h-6 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <button
              key="next-button"
              onClick={() => setCurrentSlide((prev) => (prev + 1) % banners.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 hover:bg-amber-500/50 transition-all duration-300"
              aria-label="Next banner"
            >
              <svg className="w-6 h-6 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </>
        )}

        {/* Navigation dots */}
        {banners.length > 1 && (
          <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-2 z-20">
            {banners.map((_, index) => (
              <button
                key={`dot-${index}`}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-amber-400 shadow-[0_0_8px_1px_rgba(251,191,36,0.7)]' : 'bg-white/50 hover:bg-white/70'}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Banner info overlay */}
        {/* <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 z-10">
          <div className="text-sm text-amber-100/90">
            {banners[currentSlide]?.expireDate ? (
              <p>Showing until: {new Date(banners[currentSlide].expireDate).toLocaleDateString()}</p>
            ) : (
              <p>No expiration date</p>
            )}
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default BannerShowPage;
