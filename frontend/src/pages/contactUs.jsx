import React, { useState, useEffect } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const ContactUs = () => {
  const location = useLocation();
  const [contactOption, setContactOption] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(location.state?.selectedEvent || '');
  const [selectedPackage, setSelectedPackage] = useState('');
  const [allPackages, setAllPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const whatsappLink = "https://wa.me/94771129911?text=Hi%2C%20I%20want%20to%20contact%20you";

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axios.get('http://localhost:4000/PackageOperation');
        setAllPackages(Array.isArray(response?.data) ? response.data : []);
      } catch (err) {
        console.error('Error fetching packages:', err);
        setAllPackages([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

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
      silver: { bgFrom: 'from-gray-300', bgTo: 'to-gray-400', titleColor: 'text-gray-900', textColor: 'text-gray-700' },
      gold: { bgFrom: 'from-amber-500', bgTo: 'to-amber-400', titleColor: 'text-white', textColor: 'text-amber-100' },
      diamond: { bgFrom: 'from-cyan-300', bgTo: 'to-blue-200', titleColor: 'text-gray-900', textColor: 'text-gray-700' },
      platinum: { bgFrom: 'from-gray-800', bgTo: 'to-gray-900', titleColor: 'text-white', textColor: 'text-gray-300' }
    };
    return packageStyles[type.toLowerCase()] || { bgFrom: 'from-purple-400', bgTo: 'to-purple-300', titleColor: 'text-gray-900', textColor: 'text-gray-700' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex flex-col items-center py-16 px-4">
      <div className="w-full max-w-6xl bg-black/80 backdrop-blur-md rounded-3xl p-6 sm:p-10 shadow-2xl border border-gray-700 relative">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 text-white text-lg hover:text-[#FFCF40] flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <br></br>

        {/* Header */}
        <h1 className="text-4xl sm:text-5xl font-bold text-white text-center mb-3">Let's Create Something Amazing</h1>
        <p className="text-lg text-gray-300 text-center mb-8">Book your session or message us today!</p>

        {/* Selected Event */}
        {selectedEvent && (
          <div className="mb-8 text-center">
            <p className="text-lg text-gray-300">
              Selected Event: <span className="font-semibold text-white">{selectedEvent}</span>
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <button
            onClick={() => setContactOption('booking')}
            className={`w-full sm:w-auto px-6 py-3 rounded-full font-semibold text-white transition duration-300 ${
              contactOption === 'booking' ? 'bg-amber-500 shadow-xl scale-105' : 'bg-amber-600 hover:bg-amber-700'
            }`}
          >
            Make a Booking
          </button>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3 rounded-full font-semibold text-white bg-green-500 hover:bg-green-600 flex items-center justify-center gap-2 transition duration-300 shadow-xl"
          >
            <FaWhatsapp className="text-xl" /> WhatsApp Us
          </a>
        </div>

        {/* Packages */}
        {contactOption === 'booking' && (
          <>
            <h2 className="text-2xl font-semibold text-white mb-6 text-center border-b border-gray-600 pb-3">Available Packages</h2>

            {loading ? (
              <div className="flex justify-center py-8">
                <div className="h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : allPackages.length === 0 ? (
              <p className="text-gray-400 text-center">No packages available at the moment.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {allPackages.map((pkg) => {
                  const styles = getPackageStyles(pkg.type);
                  return (
                    <div
                      key={pkg._id}
                      onClick={() => setSelectedPackage(pkg)}
                      className={`cursor-pointer p-6 rounded-xl bg-gradient-to-br ${styles.bgFrom} ${styles.bgTo} ${styles.titleColor} shadow-lg transition transform hover:scale-[1.03] ${
                        selectedPackage?._id === pkg._id ? 'ring-4 ring-emerald-400 scale-[1.05]' : ''
                      }`}
                    >
                      <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
                      <p className={`text-sm mb-1 ${styles.textColor}`}>{pkg.type}</p>
                      {pkg.eventType && <p className={`text-xs ${styles.textColor}`}>Event: {pkg.eventType}</p>}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Selected Package */}
        {contactOption === 'booking' && selectedPackage && (
          <div className="mt-10 bg-gray-900/70 rounded-xl p-6 shadow-lg border border-gray-700">
            <h3 className="text-2xl font-semibold text-white mb-4">Selected Package: {selectedPackage.name}</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
              {selectedPackage.descriptionPoints?.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
            {selectedPackage.eventType && (
              <p className="text-sm text-gray-400 mb-3">Event Type: {selectedPackage.eventType}</p>
            )}
            <button
              onClick={handleBooking}
              className="mt-4 w-full sm:w-auto px-6 py-3 rounded-lg bg-amber-600 text-white font-semibold hover:bg-amber-700 transition shadow-xl"
            >
              Proceed to Booking
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactUs;
