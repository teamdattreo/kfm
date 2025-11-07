// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { motion, AnimatePresence } from "framer-motion";


// const ClientPackagesPage = () => {
//   const [allPackages, setAllPackages] = useState([]);
//   const [showAllDetails, setShowAllDetails] = useState(false);
//   const [expandedPackageId, setExpandedPackageId] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   // Base color mappings for known package types
//   const baseTypeColors = {
//     silver: {
//       bgFrom: 'from-gray-200',
//       bgTo: 'to-gray-300',
//       iconBg: 'bg-gray-400',
//       titleColor: 'text-gray-800',
//       textColor: 'text-gray-600',
//       icon: (
//         <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
//           <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z"/>
//         </svg>
//       )
//     },
//     gold: {
//       bgFrom: 'from-amber-500',
//       bgTo: 'to-amber-300',
//       iconBg: 'bg-amber-600',
//       titleColor: 'text-white',
//       textColor: 'text-amber-100',
//       icon: (
//         <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
//           <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd"/>
//         </svg>
//       )
//     },
//     diamond: {
//       bgFrom: 'from-cyan-300',
//       bgTo: 'to-blue-200',
//       iconBg: 'bg-cyan-500',
//       titleColor: 'text-gray-800',
//       textColor: 'text-gray-600',
//       icon: (
//         <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
//           <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd"/>
//         </svg>
//       )
//     },
//     platinum: {
//       bgFrom: 'from-gray-700',
//       bgTo: 'to-gray-900',
//       iconBg: 'bg-gray-600',
//       titleColor: 'text-white',
//       textColor: 'text-gray-300',
//       icon: (
//         <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
//           <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
//         </svg>
//       )
//     }
//   };

//   // Generate random color for unknown package types
//   const getRandomPackageColors = (type) => {
//     const colors = [
//       { bgFrom: 'from-purple-400', bgTo: 'to-purple-200', iconBg: 'bg-purple-500' },
//       { bgFrom: 'from-green-400', bgTo: 'to-green-200', iconBg: 'bg-green-500' },
//       { bgFrom: 'from-pink-400', bgTo: 'to-pink-200', iconBg: 'bg-pink-500' },
//       { bgFrom: 'from-indigo-400', bgTo: 'to-indigo-200', iconBg: 'bg-indigo-500' },
//       { bgFrom: 'from-red-400', bgTo: 'to-red-200', iconBg: 'bg-red-500' },
//       { bgFrom: 'from-yellow-400', bgTo: 'to-yellow-200', iconBg: 'bg-yellow-500' }
//     ];
    
//     // Create a consistent color for each type by hashing the type name
//     const hash = type.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
//     const colorIndex = hash % colors.length;
    
//     return {
//       ...colors[colorIndex],
//       titleColor: 'text-white',
//       textColor: 'text-gray-100',
//       icon: (
//         <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
//           <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z"/>
//         </svg>
//       )
//     };
//   };

//   const getPackageColors = (type) => {
//     return baseTypeColors[type.toLowerCase()] || getRandomPackageColors(type);
//   };

//   useEffect(() => {
//     const fetchPackages = async () => {
//       try {
//         const response = await axios.get('http://localhost:4000/PackageOperation');
//         const packagesData = Array.isArray(response?.data) ? response.data : [];
//         setAllPackages(packagesData);
//       } catch (err) {
//         console.error('Error fetching packages:', err);
//         setError('Failed to load packages. Please try again later.');
//         setAllPackages([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPackages();
//   }, []);

//   const toggleAllDetails = () => {
//     const newShowAll = !showAllDetails;
//     setShowAllDetails(newShowAll);
//     // Clear individual expansion when toggling all
//     if (newShowAll) setExpandedPackageId(null);
//   };

//   const togglePackageDetails = (packageId) => {
//     // If clicking the already expanded package, collapse it
//     if (expandedPackageId === packageId) {
//       setExpandedPackageId(null);
//     } else {
//       setExpandedPackageId(packageId);
//     }
//     // Turn off "show all" mode when clicking individual packages
//     setShowAllDetails(false);
//   };

//   // Determine if a package should show details
//   const shouldShowDetails = (packageId) => {
//     return showAllDetails || expandedPackageId === packageId;
//   };



//   const handleContactClick = () => {
//     navigate('/ContactUs');
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-amber-900/10">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="relative min-h-screen bg-gradient-to-br from-amber-900/20 via-black/70 to-amber-900/20">
//       <div className="container mx-auto px-4 py-16">
//         {/* Header */}
//         <div className="text-center mb-12 max-w-3xl mx-auto">
//           <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
//             The Perfect Package for Your <span className="text-amber-400">Precious</span> Moments
//           </h1>
//           <p className="text-gray-400 text-sm sm:text-base font-light tracking-wider leading-relaxed">
//             Choose from our carefully crafted packages to frame your memories in timeless style
//           </p>
//           <button
//             onClick={toggleAllDetails}
//             className="mt-6 px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
//           >
//             {showAllDetails ? 'Hide All Details' : 'Show All Details'}
//           </button>
//         </div>

//         {/* Error message */}
//         {error && (
//           <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-100 text-center max-w-3xl mx-auto">
//             {error}
//           </div>
//         )}

//         {/* Packages Grid */}
//         {allPackages.length === 0 ? (
//           <div className="text-center py-16">
//             <p className="text-amber-200/80 text-lg">No packages available at the moment.</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
//             {allPackages.map((pkg) => {
//               const colors = getPackageColors(pkg.type);
//               const packageType = pkg.type?.charAt(0).toUpperCase() + pkg.type?.slice(1);
//               const isExpanded = shouldShowDetails(pkg._id);
              
//               return (
//                 <div 
//                   key={pkg._id} 
//                   className={`bg-gradient-to-br ${colors.bgFrom} ${colors.bgTo} rounded-xl overflow-hidden transition-all duration-300 shadow-[0_0_30px_15px_rgba(191,48,48,0.1)] 
//                     ${expandedPackageId === pkg._id ? 'scale-[1.02] shadow-xl' : 'hover:scale-[1.02] hover:shadow-xl'}`}
//                 >

//                   <div 
//                     className="p-6 cursor-pointer"
//                     onClick={() => togglePackageDetails(pkg._id)}
//                   >
//                     <div className={`h-12 w-12 mx-auto mb-4 flex items-center justify-center ${colors.iconBg} rounded-full`}>
//                       {colors.icon}
//                     </div>
//                     <h4 className={`${colors.titleColor} text-2xl font-bold mb-3 text-center`}>{packageType}</h4>
//                     <p className={`${colors.textColor} mb-6 text-sm text-center`}>{pkg.name}</p>
//                   </div>

//                   {/* Package Details (Dropdown) */}
//                   <div 
//                   className={`transition-all duration-300 overflow-hidden ${
//                     isExpanded ? 'max-h-[500px] opacity-100 py-4' : 'max-h-0 opacity-0 py-0'
//                   }`}
//                   >
//                   <div className="px-6 pb-6">
//                     {/* Description */}
//                     <div className="mb-4">
//                       <h5 className={`${colors.titleColor} font-semibold mb-2`}>What's Included:</h5>
//                       <ul className="space-y-2">
//                         {Array.isArray(pkg.descriptionPoints) && pkg.descriptionPoints.map((point, index) => (
//                           <li key={index} className="flex items-start">
//                             <span className={`${colors.textColor} mr-2`}>•</span>
//                             <span className={`${colors.textColor} text-sm`}>{point}</span>
//                           </li>
//                         ))}
//                       </ul>
//                     </div>

//                     {/* Contact Button */}
//                     <button
//                       onClick={handleContactClick}
//                       className={`w-full mt-4 py-2 px-4 ${colors.iconBg} text-white font-medium rounded-lg hover:bg-opacity-90 transition-colors`}
//                     >
//                       Contact Us About This Package
//                     </button>
//                   </div>
//                 </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ClientPackagesPage;




import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";

const ClientPackagesPage = () => {
  const [allPackages, setAllPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const baseTypeColors = {
    silver: {
      bgFrom: 'from-gray-200',
      bgTo: 'to-gray-300',
      iconBg: 'bg-gray-400',
      titleColor: 'text-gray-800',
      textColor: 'text-gray-600',
      icon: (
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z"/>
        </svg>
      )
    },
    gold: {
      bgFrom: 'from-amber-500',
      bgTo: 'to-amber-300',
      iconBg: 'bg-amber-600',
      titleColor: 'text-white',
      textColor: 'text-amber-100',
      icon: (
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd"/>
        </svg>
      )
    },
    diamond: {
      bgFrom: 'from-cyan-300',
      bgTo: 'to-blue-200',
      iconBg: 'bg-cyan-500',
      titleColor: 'text-gray-800',
      textColor: 'text-gray-600',
      icon: (
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd"/>
        </svg>
      )
    },
    platinum: {
      bgFrom: 'from-gray-700',
      bgTo: 'to-gray-900',
      iconBg: 'bg-gray-600',
      titleColor: 'text-white',
      textColor: 'text-gray-300',
      icon: (
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
        </svg>
      )
    }
  };

  const getRandomPackageColors = (type) => {
    const colors = [
      { bgFrom: 'from-purple-400', bgTo: 'to-purple-200', iconBg: 'bg-purple-500' },
      { bgFrom: 'from-green-400', bgTo: 'to-green-200', iconBg: 'bg-green-500' },
      { bgFrom: 'from-pink-400', bgTo: 'to-pink-200', iconBg: 'bg-pink-500' },
      { bgFrom: 'from-indigo-400', bgTo: 'to-indigo-200', iconBg: 'bg-indigo-500' },
      { bgFrom: 'from-red-400', bgTo: 'to-red-200', iconBg: 'bg-red-500' },
      { bgFrom: 'from-yellow-400', bgTo: 'to-yellow-200', iconBg: 'bg-yellow-500' }
    ];
    const hash = type.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    const colorIndex = hash % colors.length;
    return {
      ...colors[colorIndex],
      titleColor: 'text-white',
      textColor: 'text-gray-100',
      icon: (
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z"/>
        </svg>
      )
    };
  };

  const getPackageColors = (type) => {
    return baseTypeColors[type.toLowerCase()] || getRandomPackageColors(type);
  };

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axios.get('http://localhost:4000/PackageOperation');
        const packagesData = Array.isArray(response?.data) ? response.data : [];
        setAllPackages(packagesData);
      } catch (err) {
        console.error('Error fetching packages:', err);
        setError('Failed to load packages. Please try again later.');
        setAllPackages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const handleContactClick = () => {
    navigate('/ContactUs');
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
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h1 className="text-white text-5xl font-bold mb-4">
            The Perfect Package for Your <span className="text-amber-400">Precious</span> Moments
          </h1>
          <p className="text-gray-400 font-light tracking-wider leading-relaxed">
            Choose from our carefully crafted packages to frame your memories in timeless style
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-100 text-center max-w-3xl mx-auto">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {allPackages.map((pkg) => {
            const colors = getPackageColors(pkg.type);
            const packageType = pkg.type?.charAt(0).toUpperCase() + pkg.type?.slice(1);
            return (
              <div
                key={pkg._id}
                className={`bg-gradient-to-br ${colors.bgFrom} ${colors.bgTo} rounded-xl overflow-hidden shadow-lg transition-transform transform hover:scale-[1.03] cursor-pointer`}
                onClick={() => setSelectedPackage({ ...pkg, colors })}
              >
                <div className="p-6 text-center">
                  <div className={`h-12 w-12 mx-auto mb-4 flex items-center justify-center ${colors.iconBg} rounded-full`}>
                    {colors.icon}
                  </div>
                  <h4 className={`${colors.titleColor} text-2xl font-bold mb-2`}>{packageType}</h4>
                  <p className={`${colors.textColor} text-sm`}>{pkg.name}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedPackage && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={`bg-white rounded-2xl max-w-md w-full p-6 relative`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <button
                className="absolute top-3 right-3 text-gray-600 hover:text-red-500 text-xl"
                onClick={() => setSelectedPackage(null)}
              >
                ×
              </button>

              <div className="text-center">
                <div className={`h-12 w-12 mx-auto mb-4 flex items-center justify-center ${selectedPackage.colors.iconBg} rounded-full`}>
                  {selectedPackage.colors.icon}
                </div>
                <h2 className="text-2xl font-bold mb-2 text-black">{selectedPackage.name}</h2>
                <h4 className="text-gray-500 text-sm mb-4">{selectedPackage.type}</h4>
              </div>

              <div className="mb-4">
                <h5 className="font-semibold mb-2 text-black">What's Included:</h5>
                <ul className="list-disc list-inside space-y-1 text-gray-00 text-sm text-black">
                  {selectedPackage.descriptionPoints?.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>

              <button
                onClick={handleContactClick}
                className={`w-full py-2 px-4 ${selectedPackage.colors.iconBg} text-white rounded-lg mt-4 hover:bg-opacity-90`}
              >
                Contact Us About This Package
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClientPackagesPage;
