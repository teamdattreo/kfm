import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS, api } from '../api';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const ClientProductsPage = () => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const navigate = useNavigate();

  // Product state
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Check authentication first
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
    } else {
      setIsAuthenticated(true);
      setLoadingAuth(false);
    }
  }, [navigate]);

  // Fetch products only if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const fetchProducts = async () => {
        try {
          const response = await api.get(API_ENDPOINTS.PRODUCTS.GET_ALL);
          setProducts(Array.isArray(response) ? response : []);
        } catch (err) {
          console.error('Error fetching products:', err);
          setError('Failed to load products. Please try again later.');
          setProducts([]);
        } finally {
          setLoading(false);
        }
      };
      fetchProducts();
    }
  }, [isAuthenticated]);

  const handleContact = () => {
    navigate('/ContactUs');
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  const filteredProducts = products.filter(product => 
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    product.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-amber-900/10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header />
      </div>
      <br />
      <br />
      <br />
      <br />
      {/* Background with subtle overlay */}
      <div className="fixed inset-0 bg-cover bg-center z-0 bg-gradient-to-br from-amber-900/20 via-black/70 to-amber-900/20">
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen px-4 pt-16 pb-10">
        <div className="max-w-7xl mx-auto">
          {/* Header with Search */}
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold text-white drop-shadow-lg mb-2">
              <span className="bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
                Studio
              </span>
              <span className="text-white">KFM Products</span>
            </h1>
            <p className="text-sm text-amber-100 mt-1 tracking-wider font-medium">
              Discover our premium collection
            </p>
            
            <div className="max-w-md mx-auto mt-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full px-4 py-3 bg-white/15 border border-white/30 rounded-lg text-white placeholder-amber-100/60 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-transparent transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg 
                  className="absolute right-3 top-3.5 h-5 w-5 text-amber-300" 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-100 text-center">
              {error}
            </div>
          )}

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-amber-200/80 text-lg">
                {searchTerm ? 'No products match your search.' : 'No products available.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div 
                  key={product._id} 
                  className="bg-white/20 backdrop-blur-lg rounded-xl overflow-hidden border border-white/30 hover:border-amber-400/50 transition-all hover:shadow-lg hover:shadow-amber-500/10"
                >
                  {/* Product Image */}
                  <div className="h-56 overflow-hidden">
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={handleContact}
                        className="px-4 py-2 bg-amber-600/90 hover:bg-amber-700 text-white rounded-lg transition-colors"
                      >
                        Contact
                      </button>
                    </div>
                    <img 
                      src={product.imageUrl || 'https://via.placeholder.com/300x300?text=No+Image'} 
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x300?text=Image+not+found';
                      }}
                    />
                  </div>

                  {/* Product Info */}
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-semibold text-amber-300">{product.name}</h3>
                      <span className="bg-amber-500/20 text-amber-300 px-2 py-1 rounded text-xs">
                        {product.code}
                      </span>
                    </div>
                    
                    {/* Colors */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-amber-100/80 mb-2">Available Colors:</h4>
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(product.colors) && product.colors.map((color, index) => (
                          <div 
                            key={index} 
                            className="h-6 w-6 rounded-full border border-white/30 transition-transform hover:scale-125"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                    
                    {/* Sizes */}
                    <div>
                      <h4 className="text-sm font-medium text-amber-100/80 mb-2">Available Sizes:</h4>
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(product.sizes) && product.sizes.map((size, index) => (
                          <span 
                            key={index} 
                            className="px-2 py-1 bg-white/10 text-amber-200 rounded text-xs border border-white/20 hover:bg-amber-500/20 hover:text-amber-100 transition-colors"
                          >
                            {size.size}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientProductsPage;
