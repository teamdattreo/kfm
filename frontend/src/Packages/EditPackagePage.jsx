import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditPackagePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [packageTypes, setPackageTypes] = useState(['silver', 'gold', 'platinum', 'diamond']);
  const [showNewTypeInput, setShowNewTypeInput] = useState(false);
  const [newType, setNewType] = useState('');

  const [packageData, setPackageData] = useState({
    name: '',
    descriptionPoints: [''],
    type: 'silver'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get auth token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('authToken');
  };

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/PackageOperation/${id}`, {
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`
          }
        });
        
        console.log('Package fetch response:', response.data);

        const pkg = response.data.gpackages;
        setPackageData({
          name: pkg.name || '',
          descriptionPoints: Array.isArray(pkg.descriptionPoints) ? [...pkg.descriptionPoints] : [''],
          type: pkg.type || 'silver'
        });

      } catch (err) {
        console.error('Error fetching package:', err);
        setError(err.response?.data?.message || 'Failed to fetch package');
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [id]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // If adding a new type
      if (showNewTypeInput && newType) {
        if (!packageTypes.includes(newType)) {
          setPackageTypes(prev => [...prev, newType]);
        }
        packageData.type = newType;
      }

      const response = await axios.put(
        `http://localhost:4000/PackageOperation/${id}`,
        {
          name: packageData.name,
          descriptionPoints: packageData.descriptionPoints,
          type: packageData.type
        },
        {
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`
          }
        }
      );

      console.log('Package updated:', response.data);
      navigate('/PackagesPage');
    } catch (err) {
      console.error('Error updating package:', err);
      setError(err.response?.data?.error || err.message || 'Failed to update package');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-amber-900/10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

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
                EDIT PACKAGE
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
                
                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    onClick={() => navigate('/PackagesPage')}
                    className="px-6 py-2 bg-gray-600/80 hover:bg-gray-700/80 text-white rounded-lg transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-6 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-lg shadow-lg transition-all ${
                      isSubmitting 
                        ? 'opacity-70 cursor-not-allowed' 
                        : 'hover:from-amber-600 hover:to-amber-700'
                    }`}
                  >
                    {isSubmitting ? 'Updating...' : 'Update Package'}
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

export default EditPackagePage;