
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS, api } from '../api';

const Addform = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('package');
  const [packageTypes, setPackageTypes] = useState(['silver', 'gold', 'platinum', 'diamond']);
  const [showNewTypeInput, setShowNewTypeInput] = useState(false);
  const [newType, setNewType] = useState('');
  const [productImageFile, setProductImageFile] = useState(null);
  const [productImagePreview, setProductImagePreview] = useState('');
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      navigate('/login');
      return;
    }

    // If we get here, we have a token
    setAuthChecked(true);
  }, []);

  const [packageData, setPackageData] = useState({
    name: '',
    descriptionPoints: [''],
    type: 'silver'
  });

  const [productData, setProductData] = useState({
    name: '',
    code: '',
    photo: '',
    colors: [''],
    sizes: [{ size: '' }]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleProductImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProductImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setProductImagePreview(previewUrl);
    }
  };

  // Package handlers
  const handlePackageChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'type' && value === 'Add option') {
      setShowNewTypeInput(true);
      setPackageData(prev => ({ ...prev, [name]: '' }));
    } else if (name === 'type') {
      setShowNewTypeInput(false);
      setPackageData(prev => ({ ...prev, [name]: value }));
    } else {
      setPackageData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleDescriptionPointChange = (index, value) => {
    const newPoints = [...packageData.descriptionPoints];
    newPoints[index] = value;
    setPackageData(prev => ({ ...prev, descriptionPoints: newPoints }));
  };

  const addDescriptionPoint = () => {
    setPackageData(prev => ({
      ...prev,
      descriptionPoints: [...prev.descriptionPoints, '']
    }));
  };

  const removeDescriptionPoint = (index) => {
    const newPoints = packageData.descriptionPoints.filter((_, i) => i !== index);
    setPackageData(prev => ({ ...prev, descriptionPoints: newPoints }));
  };

  // Product handlers
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
      sizes: [...prev.sizes, { size: '' }]
    }));
  };

  const removeSize = (index) => {
    const newSizes = productData.sizes.filter((_, i) => i !== index);
    setProductData(prev => ({ ...prev, sizes: newSizes }));
  };

  const handleProductPhotoChange = (e) => {
    setProductData(prev => ({ ...prev, photo: e.target.value }));
  };

  // Form submission
  const handlePackageSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (showNewTypeInput && newType) {
        if (!packageTypes.includes(newType)) {
          setPackageTypes(prev => [...prev, newType]);
        }
        packageData.type = newType;
      }

      const response = await api.post(API_ENDPOINTS.PACKAGES.CREATE, {
        name: packageData.name,
        descriptionPoints: packageData.descriptionPoints,
        type: packageData.type
      });

      console.log('Package created:', response.data);
      alert('Package created successfully!');
      setPackageData({
        name: '',
        descriptionPoints: [''],
        type: 'silver'
      });
      setNewType('');
      setShowNewTypeInput(false);
      navigate('/PackagesPage');
    } catch (err) {
      console.error('Error creating package:', err);
      setError(err.response?.data?.error || err.message || 'Failed to create package');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!productImageFile) {
        throw new Error('Product image is required');
      }

      const formData = new FormData();
      formData.append('image', productImageFile);
      formData.append('name', productData.name);
      formData.append('code', productData.code);
      formData.append('colors', JSON.stringify(productData.colors));
      formData.append('sizes', JSON.stringify(productData.sizes));

      const response = await api.post(API_ENDPOINTS.PRODUCTS.CREATE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      console.log('Product created:', response.data);
      alert('Product created successfully!');
      setProductData({
        name: '',
        code: '',
        colors: [''],
        sizes: [{ size: '' }]
      });
      setProductImageFile(null);
      setProductImagePreview('');
      navigate('/ProductsPage');
    } catch (err) {
      console.error('Error creating product:', err);
      if (err.response?.data?.error === 'Product code must be unique') {
        setError('A product with this code already exists');
      } else {
        setError(err.response?.data?.error || err.message || 'Failed to create product');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 bg-cover bg-center z-0 bg-gradient-to-br from-amber-900/20 via-black/70 to-amber-900/20">
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 pt-16 pb-10">
        <div className="w-full max-w-4xl mx-4">
          <div className="bg-white/20 backdrop-blur-lg rounded-xl shadow-2xl overflow-hidden border border-white/30">
            
            <div className="bg-gradient-to-r from-amber-400/40 via-amber-500/50 to-amber-600/40 py-5 px-6">
              <h2 className="text-3xl font-bold text-center text-white drop-shadow-lg">
                <span className="bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
                  Studio
                </span>
                <span className="text-white">KFM</span>
              </h2>
              <p className="text-sm text-center text-amber-100 mt-1 tracking-wider font-medium">
                MANAGEMENT PORTAL
              </p>
            </div>
            
            <div className="p-6">
              {error && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-100">
                  {error}
                </div>
              )}

              <div className="flex border-b border-amber-200/30 mb-6">
                <button
                  className={`py-3 px-6 font-medium text-sm tracking-wider transition-all duration-300 ${activeTab === 'package' ? 'text-amber-300 border-b-2 border-amber-300' : 'text-amber-100/70 hover:text-amber-200'}`}
                  onClick={() => setActiveTab('package')}
                >
                  ADD PACKAGE
                </button>
                <button
                  className={`py-3 px-6 font-medium text-sm tracking-wider transition-all duration-300 ${activeTab === 'product' ? 'text-amber-300 border-b-2 border-amber-300' : 'text-amber-100/70 hover:text-amber-200'}`}
                  onClick={() => setActiveTab('product')}
                >
                  ADD PRODUCT
                </button>
              </div>
              
              <div className={`transition-all duration-500 ease-in-out ${activeTab === 'package' ? 'block opacity-100' : 'hidden opacity-0'}`}>
                <form onSubmit={handlePackageSubmit} className="space-y-5">
                  <div>
                    <label className="block text-amber-100/90 text-sm font-medium mb-2">
                      Package Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={packageData.name}
                      onChange={handlePackageChange}
                      className="w-full px-4 py-3 bg-white/15 border border-white/30 rounded-lg text-white placeholder-amber-100/60 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-transparent transition-all"
                      placeholder="Enter package name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-amber-100/90 text-sm font-medium mb-2">
                      Package Description
                    </label>
                    <div className="space-y-3">
                      {packageData.descriptionPoints.map((point, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <span className="text-amber-300">•</span>
                          <input
                            type="text"
                            value={point}
                            onChange={(e) => handleDescriptionPointChange(index, e.target.value)}
                            className="flex-1 px-4 py-2 bg-white/15 border border-white/30 rounded-lg text-white placeholder-amber-100/60 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-transparent transition-all"
                            placeholder="Description point"
                            required
                          />
                          {packageData.descriptionPoints.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeDescriptionPoint(index)}
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
                        onClick={addDescriptionPoint}
                        className="flex items-center gap-1 text-sm text-amber-300 hover:text-amber-200 mt-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                        </svg>
                        Add Another Point
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-amber-100/90 text-sm font-medium mb-2">
                      Package Type
                    </label>
                    {showNewTypeInput ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newType}
                          onChange={(e) => setNewType(e.target.value)}
                          className="flex-1 px-4 py-3 bg-white/15 border border-white/30 rounded-lg text-white placeholder-amber-100/60 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-transparent transition-all"
                          placeholder="Enter new type"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setShowNewTypeInput(false);
                            setPackageData(prev => ({ ...prev, type: 'silver' }));
                          }}
                          className="px-3 text-amber-300 hover:text-amber-200"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <select
                        name="type"
                        value={packageData.type}
                        onChange={handlePackageChange}
                        className="w-full px-4 py-3 bg-white/15 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-transparent transition-all appearance-none"
                        required
                      >
                        {packageTypes.map(type => (
                          <option key={type} value={type} className="bg-amber-900 text-white">
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </option>
                        ))}
                        <option value="Add option" className="bg-amber-900 text-white">
                          + Add New Type
                        </option>
                      </select>
                    )}
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3 px-6 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 mt-6 ${
                      isSubmitting 
                        ? 'opacity-70 cursor-not-allowed' 
                        : 'hover:from-amber-600 hover:to-amber-700 hover:shadow-xl'
                    }`}
                  >
                    {isSubmitting ? 'Creating...' : 'Add Package'}
                  </button>
                </form>
              </div>
              
              <div className={`transition-all duration-500 ease-in-out ${activeTab === 'product' ? 'block opacity-100' : 'hidden opacity-0'}`}>
                <form onSubmit={handleProductSubmit} className="space-y-5">
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
                      required
                    />
                    {productImagePreview && (
                      <div className="mt-2">
                        <img 
                          src={productImagePreview} 
                          alt="Preview" 
                          className="h-32 object-cover rounded-lg border border-white/30"
                        />
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
                          {productData.sizes.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeSize(index)}
                              className="text-sm text-amber-300 hover:text-amber-200 text-right flex items-center justify-end gap-1"
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
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3 px-6 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 mt-6 ${
                      isSubmitting 
                        ? 'opacity-70 cursor-not-allowed' 
                        : 'hover:from-amber-600 hover:to-amber-700 hover:shadow-xl'
                    }`}
                  >
                    {isSubmitting ? 'Creating...' : 'Add Product'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Addform;