import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [productData, setProductData] = useState({
    name: '',
    code: '',
    colors: [''],
    sizes: [{ size: '', price: '' }]
  });
  const [productImageFile, setProductImageFile] = useState(null);
  const [productImagePreview, setProductImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Get auth token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('authToken');
  };

  useEffect(() => {
  const fetchProduct = async () => {
  try {
    const response = await axios.get(`http://localhost:4000/ProductOperation/${id}`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      }
    });

    console.log('Product fetch response:', response.data);

    const product = response.data.product; // <-- Corrected here ✅

    setProductData({
      name: product.name || '',
      code: product.code || '',
      colors: Array.isArray(product.colors) && product.colors.length > 0 ? product.colors : [''],
      sizes: Array.isArray(product.sizes) && product.sizes.length > 0 ? product.sizes : [{ size: '', price: '' }]
    });

    if (product.imageUrl) {
      setProductImagePreview(product.imageUrl);
    }

  } catch (err) {
    console.error('Error fetching product:', err.response || err.message);
    setError(err.response?.data?.message || 'Failed to fetch product');
  }
};


  if (id) fetchProduct();
}, [id]);


  const handleProductImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProductImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setProductImagePreview(previewUrl);
    }
  };

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProductData(prev => ({ ...prev, [name]: value }));
  };

  const handleColorChange = (index, value) => {
    const newColors = [...productData.colors];
    newColors[index] = value;
    setProductData(prev => ({ ...prev, colors: newColors }));
  };

  const addColor = () => {
    setProductData(prev => ({
      ...prev,
      colors: [...prev.colors, '']
    }));
  };

  const removeColor = (index) => {
    const newColors = productData.colors.filter((_, i) => i !== index);
    setProductData(prev => ({ ...prev, colors: newColors }));
  };

  const handleSizeChange = (index, field, value) => {
    const newSizes = [...productData.sizes];
    newSizes[index][field] = value;
    setProductData(prev => ({ ...prev, sizes: newSizes }));
  };

  const addSize = () => {
    setProductData(prev => ({
      ...prev,
      sizes: [...prev.sizes, { size: '', price: '' }]
    }));
  };

  const removeSize = (index) => {
    const newSizes = productData.sizes.filter((_, i) => i !== index);
    setProductData(prev => ({ ...prev, sizes: newSizes }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      
      // Append the new image if it was changed
      if (productImageFile) {
  const formData = new FormData();
  formData.append('image', productImageFile);
  formData.append('name', productData.name);
  formData.append('code', productData.code);
  formData.append('colors', JSON.stringify(productData.colors));
  formData.append('sizes', JSON.stringify(productData.sizes));

  await axios.put(`http://localhost:4000/ProductOperation/${id}`, formData, {
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`
    }
  });
} else {
  await axios.put(`http://localhost:4000/ProductOperation/${id}`, {
    name: productData.name,
    code: productData.code,
    colors: productData.colors,
    sizes: productData.sizes
  }, {
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`
    }
  });
}

      setSuccess('Product updated successfully!');
      setTimeout(() => {
        navigate('/ProductsPage');
      }, 1500);
    } catch (err) {
      console.error('Error updating product:', err);
      if (err.response?.data?.error === 'Product code must be unique') {
        setError('A product with this code already exists');
      } else {
        setError(err.response?.data?.error || err.message || 'Failed to update product');
      }
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
        <div className="w-full max-w-4xl mx-4">
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
                EDIT PRODUCT
              </p>
            </div>
            
            <div className="p-6">
              {/* Error message */}
              {error && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-100">
                  {error}
                </div>
              )}

              {/* Success message */}
              {success && (
                <div className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-100">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-amber-100/90 text-sm font-medium mb-2">
                      Product Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={productData.name}
                      onChange={handleProductChange}
                      className="w-full px-4 py-3 bg-white/15 border border-white/30 rounded-lg text-white placeholder-amber-100/60 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-transparent transition-all"
                      placeholder="Enter product name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-amber-100/90 text-sm font-medium mb-2">
                      Product Code
                    </label>
                    <input
                      type="text"
                      name="code"
                      value={productData.code}
                      onChange={handleProductChange}
                      className="w-full px-4 py-3 bg-white/15 border border-white/30 rounded-lg text-white placeholder-amber-100/60 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-transparent transition-all"
                      placeholder="Enter product code"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-amber-100/90 text-sm font-medium mb-2">
                    Product Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProductImageChange}
                    className="w-full px-4 py-3 bg-white/15 border border-white/30 rounded-lg text-white placeholder-amber-100/60 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-transparent transition-all"
                  />
                  {productImagePreview && (
                    <div className="mt-2">
                      <img 
                        src={productImagePreview} 
                        alt="Preview" 
                        className="h-32 object-cover rounded-lg border border-white/30"
                      />
                      <p className="text-xs text-amber-100/70 mt-1">Leave empty to keep current image</p>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-amber-100/90 text-sm font-medium mb-2">
                    Available Colors
                  </label>
                  <div className="space-y-3">
                    {productData.colors.map((color, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <input
                          type="color"
                          value={color || '#ffffff'}
                          onChange={(e) => handleColorChange(index, e.target.value)}
                          className="h-10 w-10 cursor-pointer rounded border border-white/30"
                        />
                        <input
                          type="text"
                          value={color}
                          onChange={(e) => handleColorChange(index, e.target.value)}
                          placeholder="Color name"
                          className="flex-1 px-4 py-2 bg-white/15 border border-white/30 rounded-lg text-white placeholder-amber-100/60 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-transparent transition-all"
                          required
                        />
                        {productData.colors.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeColor(index)}
                            className="text-amber-300 hover:text-amber-200"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addColor}
                      className="flex items-center gap-1 text-sm text-amber-300 hover:text-amber-200 mt-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                      </svg>
                      Add Another Color
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-amber-100/90 text-sm font-medium mb-2">
                    Available Sizes
                  </label>
                  <div className="space-y-4">
                    {productData.sizes.map((sizeData, index) => (
                      <div key={index} className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block text-xs text-amber-100/70 mb-1">Size</label>
                          <input
                            type="text"
                            value={sizeData.size}
                            onChange={(e) => handleSizeChange(index, 'size', e.target.value)}
                            className="w-full px-4 py-2 bg-white/15 border border-white/30 rounded-lg text-white placeholder-amber-100/60 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-transparent transition-all"
                            placeholder="e.g., Small"
                            required
                          />
                        </div>
                        {/* <div>
                          <label className="block text-xs text-amber-100/70 mb-1">Price</label>
                          <input
                            type="number"
                            value={sizeData.price}
                            onChange={(e) => handleSizeChange(index, 'price', e.target.value)}
                            className="w-full px-4 py-2 bg-white/15 border border-white/30 rounded-lg text-white placeholder-amber-100/60 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-transparent transition-all"
                            placeholder="Price"
                            min="0"
                            step="0.01"
                            required
                          />
                        </div> */}
                        {productData.sizes.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeSize(index)}
                            className="text-sm text-amber-300 hover:text-amber-200 text-right flex items-center justify-end gap-1 col-span-2"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            Remove Size
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addSize}
                      className="flex items-center gap-1 text-sm text-amber-300 hover:text-amber-200 mt-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                      </svg>
                      Add Another Size
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-between mt-8">
                  <button
                    type="button"
                    onClick={() => navigate('/ProductsPage')}
                    className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-6 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 ${
                      isSubmitting 
                        ? 'opacity-70 cursor-not-allowed' 
                        : 'hover:from-amber-600 hover:to-amber-700 hover:shadow-xl'
                    }`}
                  >
                    {isSubmitting ? 'Updating...' : 'Update Product'}
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

export default EditProductPage;