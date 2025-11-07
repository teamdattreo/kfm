import { useState } from 'react';
import AddPromotion from './AddPromotion';
import Promotions from './Promotions';

const App = () => {
  const [refreshPromotions, setRefreshPromotions] = useState(false);

  const handlePromotionAdded = () => {
    setRefreshPromotions(prev => !prev);
  };

  return (
    <div className="relative min-h-screen">
      {/* Background with subtle overlay */}
      <div className="fixed inset-0 bg-cover bg-center z-0 bg-gradient-to-br from-amber-900/20 via-black/70 to-amber-900/20">
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 bg-white/10 backdrop-blur-md shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-2xl font-bold">
                  <span className="bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
                    Studio
                  </span>
                  <span className="text-white">KFM</span>
                </h1>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-12">
          {/* Add Promotion Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl overflow-hidden border border-white/20 p-6">
            <div className="border-b border-amber-400/30 pb-4 mb-6">
              <h2 className="text-2xl font-bold text-amber-100">
                Add New Promotion
              </h2>
              <p className="text-amber-100/70 text-sm">
                Create a new promotional offer
              </p>
            </div>
            <AddPromotion onPromotionAdded={handlePromotionAdded} />
          </div>
          
          {/* Current Promotions Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl overflow-hidden border border-white/20 p-6">
            <div className="border-b border-amber-400/30 pb-4 mb-6">
              <h2 className="text-2xl font-bold text-amber-100">
                Current Promotions
              </h2>
              <p className="text-amber-100/70 text-sm">
                View and manage active promotions
              </p>
            </div>
            <Promotions key={refreshPromotions} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;