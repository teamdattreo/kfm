import { useState, useEffect } from 'react';
import { API_ENDPOINTS, api } from '../api';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const ProductsPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]); // Initialize as empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Auth token is automatically handled by the api utility

  useEffect(() => {

    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }
    setAuthChecked(true);
    const fetchProducts = async () => {
      try {
        const response = await api.get(API_ENDPOINTS.PRODUCTS.GET_ALL);
        
        // Ensure we always set an array, even if response.data is null/undefined
        const productsData = Array.isArray(response?.data) ? response.data : [];
        setProducts(productsData);
        
        // For debugging - check the API response structure
        console.log('API Response:', response.data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.response?.data?.message || 'Failed to fetch products');
        setProducts([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const deleteProduct = async (id) => {
    try {
      await api.delete(API_ENDPOINTS.PRODUCTS.DELETE(id));
      setProducts(prevProducts => prevProducts.filter(product => product._id !== id));
    } catch (err) {
      console.error('Error deleting product:', err);
      setError(err.response?.data?.message || 'Failed to delete product');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-amber-900/10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  // Safely check if products is an array before rendering
  const productsToRender = Array.isArray(products) ? products : [];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-amber-900/20 via-black/70 to-amber-900/20">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-3xl font-bold text-amber-300">Products</h1>
            <Link 
              to="/AddForm" 
              className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-2 rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all"
            >
              Add New Product
            </Link>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-100">
              {error}
            </div>
          )}

          {/* Products Grid */}
          {productsToRender.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-amber-200/80 text-lg">
                {Array.isArray(products) ? 'No products found.' : 'Failed to load products.'}
                Add your first product!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {productsToRender.map((product) => (
                <div key={product._id} className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden border border-white/20 hover:border-amber-400/50 transition-all">
                  {/* Product card content remains the same */}
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={product.imageUrl || 'https://via.placeholder.com/300?text=No+Image'} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300?text=Image+not+found';
                      }}
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold text-amber-300">{product.name}</h3>
                      <span className="bg-amber-500/20 text-amber-300 px-2 py-1 rounded text-xs">
                        {product.code}
                      </span>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-amber-200/80 mb-2">Available Colors:</h4>
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(product.colors) && product.colors.map((color, index) => (
                          <div 
                            key={index} 
                            className="h-6 w-6 rounded-full border border-white/30"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-amber-200/80 mb-2">Sizes & Prices:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {Array.isArray(product.sizes) && product.sizes.map((size, index) => (
                          <div key={index} className="bg-white/5 rounded p-2">
                            <p className="text-xs text-amber-200/60"><span className="text-amber-300">{size.size}</span></p>
                            {/* <p className="text-xs text-amber-200/60">Size: <span className="text-amber-300">{size.size}</span></p> */}
                            {/* <p className="text-xs text-amber-200/60">Price: <span className="text-amber-300">${size.price}</span></p> */}
                            
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-between mt-4">
                      <Link 
                        to={`/EditProduct/${product._id}`} 
                        className="text-amber-300 hover:text-amber-200 text-sm font-medium"
                      >
                        Edit
                      </Link>
                      <button 
                        onClick={() => deleteProduct(product._id)}
                        className="text-red-400 hover:text-red-300 text-sm font-medium"
                      >
                        Delete
                      </button>
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

export default ProductsPage;