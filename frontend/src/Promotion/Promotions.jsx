import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS, api } from '../api';

const Promotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await api.get(API_ENDPOINTS.PROMOTIONS.GET_ALL);
        setPromotions(Array.isArray(response?.data) ? response.data : []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load promotions');
        console.error('Error fetching promotions:', err);
        setPromotions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  const handleContact = () => {
    navigate('/ContactUs');
  };

  if (isLoading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-900/20 via-black/70 to-amber-900/20">
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div className="relative z-10 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-amber-400 mx-auto"></div>
          <p className="mt-4 text-amber-100">Loading promotions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-900/20 via-black/70 to-amber-900/20">
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div className="relative z-10 bg-white/20 backdrop-blur-lg rounded-xl shadow-2xl p-6 border border-white/30 max-w-2xl mx-4 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto text-red-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-xl text-amber-100 font-medium mb-2">Error Loading Promotions</h3>
          <p className="text-red-300 text-lg font-medium mb-4">{error}</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 border border-amber-400 text-amber-300 rounded-lg hover:bg-amber-900/30 transition-colors"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const safePromotions = Array.isArray(promotions) ? promotions : [];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-amber-900/20 via-black/70 to-amber-900/20">
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-start pt-12 pb-20 px-4">
        <div className="w-full max-w-6xl text-center mb-12">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
            Current Promotions
          </h1>
          <p className="text-amber-100/80 font-medium">
            {safePromotions.length} active promotion{safePromotions.length !== 1 ? 's' : ''}
          </p>
        </div>

        {safePromotions.length === 0 ? (
          <div className="bg-white/20 backdrop-blur-lg rounded-xl shadow-lg p-8 border border-white/30 max-w-2xl mx-auto text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-amber-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl text-amber-100 font-medium mb-2">
              No promotions found
            </h3>
          </div>
        ) : (
          <div className="w-full max-w-6xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {safePromotions.map((promotion) => (
                <div
                  key={promotion._id}
                  className="bg-white/10 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-white/20 hover:border-amber-400/30 group mx-auto w-full max-w-md"
                >
                  <div 
                    className="h-64 overflow-hidden relative cursor-pointer"
                    onClick={handleContact}
                  >
                    {promotion.imageUrl ? (
                      <img
                        src={promotion.imageUrl}
                        alt={promotion.description || 'Promotion image'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/placeholder-promotion.jpg';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-amber-900/20 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12 text-amber-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={handleContact}
                        className="px-4 py-2 bg-amber-600/90 hover:bg-amber-700 text-white rounded-lg transition-colors"
                      >
                        Contact
                      </button>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-amber-100 font-medium mb-2 line-clamp-2">
                      {promotion.description || 'No description available'}
                    </h3>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-amber-300/80">
                        {new Date(promotion.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Promotions;