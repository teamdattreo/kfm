import React, { useState, useEffect } from 'react';
import { FaWhatsapp, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_ENDPOINTS, api } from '../api';

const ContactUs = () => {
  const location = useLocation();
  const [contactOption, setContactOption] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(location.state?.selectedEvent || '');
  const [selectedPackage, setSelectedPackage] = useState('');
  const [allPackages, setAllPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const whatsappLink = "https://wa.me/94785101018?text=Hi%2C%20I%20want%20to%20contact%20you";

  // Event to category mapping
  const eventToCategory = {
    'Wedding Photography': 'wedding',
    'Birthday Celebrations': 'birthday',
    'Puberty Shoot': 'puberty'
  };

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await api.get(API_ENDPOINTS.PACKAGES.GET_ALL);
        const packagesData = Array.isArray(response) ? response : [];
        setAllPackages(packagesData);
      } catch (err) {
        console.error('Error fetching packages:', err);
        setAllPackages([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  // Filter packages based on selected event category
  useEffect(() => {
    if (selectedEvent && allPackages.length > 0) {
      const category = eventToCategory[selectedEvent];
      if (category) {
        const filtered = allPackages.filter(pkg => 
          pkg.category === category
        );
        setFilteredPackages(filtered);
      } else {
        // If no category mapping found, show all packages
        setFilteredPackages(allPackages);
      }
    } else {
      // If no event selected, show all packages
      setFilteredPackages(allPackages);
    }
  }, [selectedEvent, allPackages]);

  const handleBooking = () => {
    if (selectedEvent && selectedPackage) {
      const routes = {
        'Wedding Photography': '/weddingBookingForm',
        'Birthday Celebrations': '/birthdayBookingForm',
        'Puberty Shoot': '/pubertyBookingForm',
      };
      navigate(routes[selectedEvent] || '/', { state: { selectedEvent, selectedPackage } });
    }
  };

  const getPackageStyles = (type) => {
    const packageStyles = {
      silver: { 
        bgFrom: 'from-gray-800', 
        bgTo: 'to-gray-700', 
        borderColor: 'border-gray-600',
        titleColor: 'text-white', 
        textColor: 'text-gray-300',
        buttonBg: 'bg-gray-700 hover:bg-gray-600',
        priceColor: 'text-white',
        cardBg: 'bg-gradient-to-br from-gray-800 to-gray-700',
        hoverCard: 'hover:from-gray-700 hover:to-gray-600',
        selectedBorder: 'border-amber-400',
        selectedBg: 'from-gray-700 to-gray-600'
      },
      gold: { 
        bgFrom: 'from-amber-900', 
        bgTo: 'to-amber-800', 
        borderColor: 'border-amber-700',
        titleColor: 'text-amber-100', 
        textColor: 'text-amber-200',
        buttonBg: 'bg-amber-700 hover:bg-amber-600',
        priceColor: 'text-amber-300',
        cardBg: 'bg-gradient-to-br from-amber-900 to-amber-800',
        hoverCard: 'hover:from-amber-800 hover:to-amber-700',
        selectedBorder: 'border-amber-400',
        selectedBg: 'from-amber-800 to-amber-700'
      },
      diamond: { 
        bgFrom: 'from-blue-900', 
        bgTo: 'to-blue-800', 
        borderColor: 'border-blue-700',
        titleColor: 'text-blue-100', 
        textColor: 'text-blue-200',
        buttonBg: 'bg-blue-700 hover:bg-blue-600',
        priceColor: 'text-blue-300',
        cardBg: 'bg-gradient-to-br from-blue-900 to-blue-800',
        hoverCard: 'hover:from-blue-800 hover:to-blue-700',
        selectedBorder: 'border-cyan-400',
        selectedBg: 'from-blue-800 to-blue-700'
      },
      platinum: { 
        bgFrom: 'from-gray-900', 
        bgTo: 'to-gray-800', 
        borderColor: 'border-gray-600',
        titleColor: 'text-white', 
        textColor: 'text-gray-200',
        buttonBg: 'bg-gray-700 hover:bg-gray-600',
        priceColor: 'text-white',
        cardBg: 'bg-gradient-to-br from-gray-900 to-gray-800',
        hoverCard: 'hover:from-gray-800 hover:to-gray-700',
        selectedBorder: 'border-gray-400',
        selectedBg: 'from-gray-800 to-gray-700'
      }
    };
    return packageStyles[type.toLowerCase()] || { 
      bgFrom: 'from-purple-900', 
      bgTo: 'to-purple-800', 
      borderColor: 'border-purple-700',
      titleColor: 'text-purple-100', 
      textColor: 'text-purple-200',
      buttonBg: 'bg-purple-700 hover:bg-purple-600',
      priceColor: 'text-purple-300',
      cardBg: 'bg-gradient-to-br from-purple-900 to-purple-800',
      hoverCard: 'hover:from-purple-800 hover:to-purple-700',
      selectedBorder: 'border-purple-400',
      selectedBg: 'from-purple-800 to-purple-700'
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center py-12 px-4 sm:py-16">
      <div className="w-full max-w-6xl bg-gray-800/80 backdrop-blur-lg rounded-3xl p-6 sm:p-10 shadow-2xl border border-gray-700 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-900/30 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-20 left-20 w-72 h-72 bg-blue-900/30 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-900/20 rounded-full mix-blend-multiply filter blur-xl opacity-10"></div>
        
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 text-gray-300 hover:text-white transition-colors flex items-center gap-2 group"
        >
          <FaArrowLeft className="transition-transform group-hover:-translate-x-1" />
          <span className="font-medium">Back</span>
        </button>

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block bg-amber-900/30 text-amber-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-4 border border-amber-800/50">
            Get in Touch
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Let's Create Something <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-600">Amazing</span>
          </h1>
          <p className="text-lg text-gray-300">
            Ready to capture your special moments? Book your session or reach out to us today!
          </p>
        </div>

        {/* Selected Event */}
        {selectedEvent && (
          <div className="mb-8 text-center">
            <div className="inline-block bg-amber-900/20 border border-amber-800/50 rounded-full px-6 py-2">
              <p className="text-lg text-gray-300">
                Selected Event: <span className="font-semibold text-amber-300">{selectedEvent}</span>
              </p>
            </div>
            <p className="mt-2 text-sm text-amber-200/70">
              Showing {filteredPackages.length} packages for {eventToCategory[selectedEvent] || 'this event'}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            onClick={() => setContactOption('booking')}
            className={`w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 ${
              contactOption === 'booking' 
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 shadow-lg ring-2 ring-amber-400/50' 
                : 'bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 shadow-lg border border-gray-700 hover:border-amber-500/30'
            }`}
          >
            {contactOption === 'booking' ? (
              <span className="flex items-center gap-2">
                <FaCheckCircle className="text-amber-200" /> Selecting Package...
              </span>
            ) : (
              'Make a Booking'
            )}
          </button>
          
          <div className="relative group w-full sm:w-auto">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-green-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="relative w-full px-8 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-green-600 to-green-700 flex items-center justify-center gap-3 transition-all duration-300 group-hover:scale-105"
            >
              <FaWhatsapp className="text-xl" /> Chat on WhatsApp
            </a>
          </div>
        </div>

        {/* Packages Section */}
        {contactOption === 'booking' && (
          <div className="mb-16">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-white mb-3">
                {selectedEvent ? 
                  `${eventToCategory[selectedEvent] || 'Event'} Packages` : 
                  'Our Photography Packages'
                }
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto rounded-full"></div>
              <p className="mt-4 text-gray-300 max-w-2xl mx-auto">
                {selectedEvent ? 
                  `Choose the perfect ${eventToCategory[selectedEvent]?.toLowerCase() || 'event'} package for your special day.` :
                  'Choose the perfect package that fits your needs. All packages include high-quality photos and professional editing.'
                }
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center py-16">
                <div className="h-12 w-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filteredPackages.length === 0 ? (
              <div className="text-center py-12 bg-gray-700/30 rounded-xl border-2 border-dashed border-gray-600">
                <p className="text-gray-300 text-lg">
                  {selectedEvent ? 
                    `No ${eventToCategory[selectedEvent]?.toLowerCase() || 'event'} packages available yet.` :
                    'No packages available at the moment.'
                  }
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Please contact us directly to discuss custom packages for your event.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPackages.map((pkg) => {
                  const styles = getPackageStyles(pkg.type);
                  const isSelected = selectedPackage?._id === pkg._id;
                  
                  return (
                    <div
                      key={pkg._id}
                      onClick={() => setSelectedPackage(pkg)}
                      className={`relative overflow-hidden rounded-2xl border-2 transition-all duration-300 transform hover:-translate-y-2 ${styles.cardBg} ${
                        isSelected 
                          ? `${styles.selectedBorder} shadow-2xl scale-[1.02] ring-2 ring-amber-500/30` 
                          : `border-gray-700 hover:border-amber-500/50 hover:shadow-xl ${styles.hoverCard}`
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-4 right-4 bg-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                          SELECTED
                        </div>
                      )}
                      
                      
                      <div className={`p-8 ${styles.borderColor} border-b border-gray-700`}>
                        <h3 className={`text-2xl font-bold mb-2 ${styles.titleColor}`}>
                          {pkg.name}
                        </h3>
                        {/* <div className="flex items-baseline mb-2">
                          <span className={`text-4xl font-extrabold ${styles.priceColor}`}>
                            ${pkg.price || '--'}
                          </span>
                          {pkg.duration && (
                            <span className={`ml-2 text-sm ${styles.textColor}`}>
                              / {pkg.duration}
                            </span>
                          )}
                        </div> */}
                        {pkg.type && (
                          <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${styles.buttonBg} text-white`}>
                            {pkg.type}
                          </span>
                        )}
                      </div>
                      
                      <div className="bg-gray-800/50 p-6">
                        {pkg.descriptionPoints && pkg.descriptionPoints.length > 0 ? (
                          <ul className="space-y-3">
                            {pkg.descriptionPoints.map((point, i) => (
                              <li key={i} className="flex items-start">
                                <svg className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-gray-200">{point}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-400 text-sm">No description available.</p>
                        )}
                        
                        <button 
                          className={`mt-6 w-full py-3 px-4 rounded-lg font-semibold text-white ${
                            isSelected 
                              ? 'bg-amber-600 hover:bg-amber-500' 
                              : styles.buttonBg
                          } transition-colors`}
                        >
                          {isSelected ? 'Selected' : 'Select Package'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Selected Package Summary */}
        {contactOption === 'booking' && selectedPackage && (
          <div className="mt-12 bg-gradient-to-r from-amber-900/30 to-amber-800/20 rounded-2xl p-8 shadow-xl border border-amber-800/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-bl-full opacity-30"></div>
            <div className="relative z-10">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-amber-300 mb-2">Your Selection</h3>
                <div className="w-16 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto rounded-full"></div>
              </div>
              
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-sm mb-6 border border-gray-700">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h4 className="text-xl font-bold text-white">{selectedPackage.name}</h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedPackage.category && (
                        <span className="inline-block px-3 py-1 text-sm font-medium bg-amber-900/50 text-amber-200 rounded-full border border-amber-800/50">
                          {selectedPackage.category}
                        </span>
                      )}
                      {selectedPackage.type && (
                        <span className="inline-block px-3 py-1 text-sm font-medium bg-gray-700/80 text-gray-200 rounded-full">
                          {selectedPackage.type}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 md:mt-0 text-right">
                    {selectedPackage.price && (
                      <p className="text-2xl font-bold text-white">${selectedPackage.price}</p>
                    )}
                    {selectedPackage.duration && (
                      <p className="text-sm text-amber-200/80">{selectedPackage.duration} session</p>
                    )}
                  </div>
                </div>
                
                {selectedPackage.descriptionPoints && selectedPackage.descriptionPoints.length > 0 && (
                  <div className="border-t border-gray-700 pt-4 mt-4">
                    <h5 className="font-semibold text-amber-200 mb-3">What's included:</h5>
                    <ul className="space-y-2">
                      {selectedPackage.descriptionPoints.map((point, i) => (
                        <li key={i} className="flex items-start">
                          <svg className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-200">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={() => setSelectedPackage(null)}
                  className="px-6 py-3 rounded-lg font-medium text-white bg-gray-700/80 border border-gray-600 hover:bg-gray-600/80 transition-colors"
                >
                  Change Package
                </button>
                <button
                  onClick={handleBooking}
                  disabled={!selectedEvent}
                  className={`px-8 py-3 rounded-lg font-semibold text-white transition-all transform hover:scale-105 shadow-lg ${
                    selectedEvent 
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700' 
                      : 'bg-gradient-to-r from-gray-600 to-gray-700 cursor-not-allowed opacity-70'
                  }`}
                >
                  {selectedEvent ? 'Proceed to Booking' : 'Please select an event'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactUs;