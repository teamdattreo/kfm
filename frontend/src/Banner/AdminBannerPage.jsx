import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Banners from '../admin/Banners';
import UserHomeBannerUpload from '../admin/UserHomeBannerUpload';

const AdminBannerPage = () => {
  const navigate = useNavigate();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [authChecked, setAuthChecked] = useState(false);

  const colorTheme = {
    bg: 'bg-[#1a1a1a]',
    card: 'bg-gray-800 border border-gray-700',
    accent: 'bg-amber-500 hover:bg-amber-600 text-white',
    text: 'text-white',
    muted: 'text-gray-400',
    border: 'border-amber-400',
  };

  useEffect(() => {

    const token = localStorage.getItem('authToken');
    
    if (!token) {
      navigate('/login');
      return;
    }

    // If we get here, we have a token
    setAuthChecked(true);
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await axios.get('http://localhost:4000/Banner');
      setBanners(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load banners');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this banner? This will also remove the image from Cloudinary.')) {
      try {
        await axios.delete(`http://localhost:4000/Banner/${id}`);
        fetchBanners();
      } catch (err) {
        setError(err.response?.data?.message || 'Delete failed');
      }
    }
  };

  const toggleBannerStatus = async (id, currentStatus) => {
    try {
      await axios.put(`http://localhost:4000/Banner/${id}`, {
        isActive: !currentStatus
      });
      fetchBanners();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update banner status');
    }
  };

  const filteredBanners = banners.filter(banner => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'active') return banner.isActive;
    if (activeFilter === 'inactive') return !banner.isActive;
    return true;
  });

  if (loading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className={`${colorTheme.bg} min-h-screen p-4`}>
      <Banners />

      <br />

      <UserHomeBannerUpload />

      <div className="max-w-6xl mx-auto mt-8">
        <div className={`${colorTheme.card} rounded-xl shadow-lg overflow-hidden`}>
          {/* Card Header */}
          <div className={`${colorTheme.accent} py-4 px-6`}>
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">
                  Banner Management
                </h2>
              </div>
              <Link 
                to="/AddBannerPage" 
                className={`${colorTheme.card} px-6 py-2 rounded-full font-semibold hover:bg-gray-700 transition-colors`}
              >
                Add New Banner
              </Link>
            </div>
          </div>

          <div className="p-6">
            {error && (
              <div className={`mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg ${colorTheme.text}`}>
                {error}
              </div>
            )}

            {/* Filter Controls */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-4 py-2 rounded-full ${activeFilter === 'all' ? colorTheme.accent : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                >
                  All
                </button>
                <button
                  onClick={() => setActiveFilter('active')}
                  className={`px-4 py-2 rounded-full ${activeFilter === 'active' ? colorTheme.accent : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                >
                  Active
                </button>
                <button
                  onClick={() => setActiveFilter('inactive')}
                  className={`px-4 py-2 rounded-full ${activeFilter === 'inactive' ? colorTheme.accent : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                >
                  Inactive
                </button>
              </div>
              <div className={colorTheme.muted}>
                Showing {filteredBanners.length} of {banners.length} banners
              </div>
            </div>

            {/* Banners List */}
            <div>
              {filteredBanners.length === 0 ? (
                <div className="text-center py-10">
                  <p className={colorTheme.muted}>
                    {activeFilter === 'all' 
                      ? 'No banners found. Add your first banner!' 
                      : `No ${activeFilter} banners found.`}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredBanners.map((banner) => (
                    <div key={banner._id} className={`${colorTheme.card} rounded-lg overflow-hidden hover:border-amber-400 transition-all`}>
                      <div className="relative">
                        <img
                          src={banner.imageUrl}
                          alt="Banner preview"
                          className="w-full h-48 object-cover"
                          onError={(e) => {
                            e.target.src = '';
                            e.target.className = 'w-full h-48 flex items-center justify-center bg-gray-700';
                            e.target.innerHTML = '<span class="text-gray-400">Image not available</span>';
                          }}
                        />
                        <div className="absolute top-2 right-2">
                          <button
                            onClick={() => toggleBannerStatus(banner._id, banner.isActive)}
                            className={`px-2 py-1 rounded text-xs font-medium ${banner.isActive ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-white`}
                          >
                            {banner.isActive ? 'Active' : 'Inactive'}
                          </button>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className={colorTheme.muted + " text-sm mb-2"}>
                          Published: {new Date(banner.publishDate).toLocaleDateString()}
                        </div>
                        <div className={colorTheme.muted + " text-sm mb-2"}>
                          Created: {new Date(banner.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex justify-end space-x-2 mt-3">
                          <Link
                            to={`/EditBanner/${banner._id}`}
                            className={`${colorTheme.accent} px-3 py-1 rounded-full text-sm`}
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(banner._id)}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm"
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
      </div>
    </div>
  );
};

export default AdminBannerPage;