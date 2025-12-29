import { useState, useEffect } from 'react';
import { API_ENDPOINTS, api } from '../api';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const PackagesPage = () => {
  const [packages, setPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const navigate = useNavigate();
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  // Get unique types and categories from packages
  const packageTypes = ['all', ...new Set(packages.map(pkg => pkg.type).filter(Boolean))];
  const packageCategories = ['all', ...new Set(packages.map(pkg => pkg.category).filter(Boolean))];

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
        const packagesData = Array.isArray(response) ? response : [];
        setPackages(packagesData);
        setFilteredPackages(packagesData);
      } catch (err) {
        console.error('Error fetching packages:', err);
        setError(err.data?.message || err.message || 'Failed to fetch packages');
        setPackages([]);
        setFilteredPackages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  // Filter packages based on search term and filters
  useEffect(() => {
    let filtered = [...packages];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(pkg => 
        pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (Array.isArray(pkg.descriptionPoints) && 
          pkg.descriptionPoints.some(point => 
            point.toLowerCase().includes(searchTerm.toLowerCase())
          ))
      );
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(pkg => pkg.type === typeFilter);
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(pkg => pkg.category === categoryFilter);
    }

    setFilteredPackages(filtered);
  }, [searchTerm, typeFilter, categoryFilter, packages]);

  const deletePackage = async (id) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      try {
        await api.delete(API_ENDPOINTS.PACKAGES.DELETE(id));
        const updatedPackages = packages.filter(pkg => pkg._id !== id);
        setPackages(updatedPackages);
        setFilteredPackages(updatedPackages);
      } catch (err) {
        console.error('Error deleting package:', err);
        setError(err.response?.data?.message || 'Failed to delete package');
      }
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setTypeFilter('all');
    setCategoryFilter('all');
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

          {/* Search and Filter Bar */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 mb-8 border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Search Input */}
              <div>
                <label className="block text-amber-200/80 text-sm font-medium mb-2">
                  Search Packages
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name or description..."
                    className="w-full px-4 py-3 bg-white/15 border border-white/30 rounded-lg text-white placeholder-amber-100/60 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-transparent transition-all"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-300 hover:text-amber-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Type Filter */}
              <div>
                <label className="block text-amber-200/80 text-sm font-medium mb-2">
                  Filter by Type
                </label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full px-4 py-3 bg-white/15 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-transparent transition-all appearance-none"
                >
                  {packageTypes.map(type => (
                    <option key={type} value={type} className="bg-amber-900 text-white">
                      {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-amber-200/80 text-sm font-medium mb-2">
                  Filter by Category
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-4 py-3 bg-white/15 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-transparent transition-all appearance-none"
                >
                  {packageCategories.map(category => (
                    <option key={category} value={category} className="bg-amber-900 text-white">
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Filter Status and Clear Button */}
            <div className="flex justify-between items-center">
              <div className="text-amber-200/70 text-sm">
                Showing {filteredPackages.length} of {packages.length} packages
                {(searchTerm || typeFilter !== 'all' || categoryFilter !== 'all') && (
                  <span className="ml-2">
                    (Filtered by: 
                    {searchTerm && ` Search: "${searchTerm}"`}
                    {typeFilter !== 'all' && ` Type: ${typeFilter}`}
                    {categoryFilter !== 'all' && ` Category: ${categoryFilter}`})
                  </span>
                )}
              </div>
              {(searchTerm || typeFilter !== 'all' || categoryFilter !== 'all') && (
                <button
                  onClick={clearFilters}
                  className="text-amber-300 hover:text-amber-200 text-sm font-medium flex items-center gap-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-100">
              {error}
            </div>
          )}

          {/* Packages Grid */}
          {!Array.isArray(filteredPackages) || filteredPackages.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-amber-200/80 text-lg">
                {packages.length === 0 
                  ? "No packages found. Add your first package!" 
                  : "No packages match your search criteria."}
              </p>
              {packages.length > 0 && filteredPackages.length === 0 && (
                <button
                  onClick={clearFilters}
                  className="mt-4 text-amber-300 hover:text-amber-200"
                >
                  Clear filters to see all packages
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPackages.map((pkg) => (
                <div key={pkg._id} className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden border border-white/20 hover:border-amber-400/50 transition-all hover:transform hover:scale-[1.02]">
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold text-amber-300">{pkg.name}</h3>
                      <div className="flex flex-col items-end gap-1">
                        <span className={`px-2 py-1 rounded text-xs ${
                          pkg.type === 'diamond' ? 'bg-purple-500/20 text-purple-300' :
                          pkg.type === 'platinum' ? 'bg-gray-500/20 text-gray-300' :
                          pkg.type === 'gold' ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-gray-400/20 text-gray-200'
                        }`}>
                          {pkg.type?.charAt(0).toUpperCase() + pkg.type?.slice(1)}
                        </span>
                        {pkg.category && (
                          <span className="px-2 py-1 rounded text-xs bg-amber-500/20 text-amber-300">
                            {pkg.category}
                          </span>
                        )}
                      </div>
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
                      <div className="flex gap-3">
                        <Link 
                          to={`/EditPackage/${pkg._id}`} 
                          className="text-amber-300 hover:text-amber-200 text-sm font-medium px-3 py-1 bg-amber-500/10 rounded hover:bg-amber-500/20 transition-all"
                        >
                          Edit
                        </Link>
                        <button 
                          onClick={() => deletePackage(pkg._id)}
                          className="text-red-400 hover:text-red-300 text-sm font-medium px-3 py-1 bg-red-500/10 rounded hover:bg-red-500/20 transition-all"
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