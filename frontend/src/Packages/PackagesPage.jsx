import { useState, useEffect } from 'react';
import { API_ENDPOINTS, api } from '../api';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const PackagesPage = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
   const navigate = useNavigate();
   
  // Auth token is automatically handled by the api utility

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }
    setAuthChecked(true);
    const fetchPackages = async () => {
      try {
        const response = await api.get(API_ENDPOINTS.PACKAGES.GET_ALL);
        
        // Ensure we always set an array, even if response.data is null/undefined
        setPackages(Array.isArray(response?.data) ? response.data : []);
      } catch (err) {
        console.error('Error fetching packages:', err);
        setError(err.response?.data?.message || 'Failed to fetch packages');
        // Set empty array on error to prevent map errors
        setPackages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const deletePackage = async (id) => {
    try {
      await api.delete(API_ENDPOINTS.PACKAGES.DELETE(id));
      setPackages(packages.filter(pkg => pkg._id !== id));
    } catch (err) {
      console.error('Error deleting package:', err);
      setError(err.response?.data?.message || 'Failed to delete package');
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
    <div className="relative min-h-screen bg-gradient-to-br from-amber-900/20 via-black/70 to-amber-900/20">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-3xl font-bold text-amber-300">Packages</h1>
            <Link 
              to="/AddForm" 
              className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-2 rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all"
            >
              Add New Package
            </Link>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-100">
              {error}
            </div>
          )}

          {/* Packages Grid */}
          {!Array.isArray(packages) || packages.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-amber-200/80 text-lg">No packages found. Add your first package!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <div key={pkg._id} className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden border border-white/20 hover:border-amber-400/50 transition-all">
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold text-amber-300">{pkg.name}</h3>
                      <span className={`px-2 py-1 rounded text-xs ${
                        pkg.type === 'diamond' ? 'bg-purple-500/20 text-purple-300' :
                        pkg.type === 'platinum' ? 'bg-gray-500/20 text-gray-300' :
                        pkg.type === 'gold' ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-gray-400/20 text-gray-200'
                      }`}>
                        {pkg.type?.charAt(0).toUpperCase() + pkg.type?.slice(1)}
                      </span>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-amber-200/80 mb-2">Description:</h4>
                      <ul className="space-y-1">
                        {Array.isArray(pkg.descriptionPoints) && pkg.descriptionPoints.map((point, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-amber-400 mr-2">•</span>
                            <span className="text-amber-200/80 text-sm">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex justify-between items-center mt-4">
                      <div className="text-sm text-amber-200/70">
                        Created: {new Date(pkg.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex gap-2">
                        <Link 
                          to={`/EditPackage/${pkg._id}`} 
                          className="text-amber-300 hover:text-amber-200 text-sm font-medium"
                        >
                          Edit
                        </Link>
                        <button 
                          onClick={() => deletePackage(pkg._id)}
                          className="text-red-400 hover:text-red-300 text-sm font-medium"
                        >
                          Delete
                        </button>
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

export default PackagesPage;