import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_ENDPOINTS, api } from '../api';
import Header from '../components/Header';
import { FiHome } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const WeddingBookingForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customerName: '',
    brideName: '',
    groomName: '',
    brideFather: '',
    brideMother: '',
    groomFather: '',
    groomMother: '',
    phone: '',
    email: '',
    eventDate: '',
    bookingDate: '',
    receptionDate: '',
    location: '',
    storageName: '',
    notes: '',
    package: '',  // Add a package field to the form data
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Retrieve the event and package from location state
  const selectedEvent = location.state?.selectedEvent || '';
  const selectedPackage = location.state?.selectedPackage || '';
  const selectedPackageLabel = typeof selectedPackage === 'string'
    ? selectedPackage
    : (selectedPackage?.name || selectedPackage?.type || selectedPackage?.category || selectedPackage?.title || '');

  useEffect(() => {
    if (selectedPackageLabel) {
      setFormData((prevData) => ({
        ...prevData,
        package: selectedPackageLabel
      }));
    }
  }, [selectedPackageLabel]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  const userId = localStorage.getItem('userId');
  if (!userId || userId === "undefined") {
    alert('Please log in to make a booking');
    setIsSubmitting(false);
    return;
  }

  // Enhanced validation
  const requiredFields = {
    customerName: 'Customer name',
    brideName: 'Bride name', 
    groomName: 'Groom name',
    phone: 'Phone number',
    eventDate: 'Event date',
    package: 'Package'
  };

  const newErrors = {};
  // Object.entries(requiredFields).forEach(([field, name]) => {
  //   if (!formData[field]?.trim()) {
  //     newErrors[field] = `${name} is required`;
  //   }
  // });

  // Additional phone validation
  if (formData.phone && !/^\d{10,15}$/.test(formData.phone)) {
    newErrors.phone = 'Enter a valid 10-15 digit phone number';
  }

  setErrors(newErrors);

  if (Object.keys(newErrors).length > 0) {
    setIsSubmitting(false);
    return;
  }

  try {
    const bookingData = {
      ...formData,
      userId // This should now be a valid ID
    };

    const response = await api.post(API_ENDPOINTS.BOOKINGS.CREATE_WEDDING, bookingData);
      alert("Wedding booking submitted successfully!");
        navigate('/BookingHistory');  } catch (error) {
    console.error('Full error:', {
      message: error.message,
      response: error.response?.data,
      request: error.config?.data
    });
    alert(error.response?.data?.message || 'Booking failed. Please try again.');
  }
  setIsSubmitting(false);
};
  return (
    <div className='relative'>
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-4 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800">
        <Link to="/UserHomePage" className="text-white hover:text-amber-400 transition-colors flex items-center gap-2 group" title="Back to Home">
          <FiHome className="text-xl group-hover:-translate-x-1 transition-transform" />
          <span className="hidden sm:inline font-medium">Back to Home</span>
        </Link>
      </div>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col items-center pt-28 pb-12 px-4 sm:px-6">
        {/* Decorative elements */}
        <div className="fixed -top-20 -right-20 w-64 h-64 bg-amber-900/30 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="fixed -bottom-20 left-20 w-72 h-72 bg-blue-900/30 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        
        <div className="text-center mb-12 max-w-3xl relative z-10">
          <span className="inline-block bg-amber-900/30 text-amber-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-4 border border-amber-800/50">
            Wedding Photography
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Book Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-600">Wedding</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Let us capture the most precious moments of your special day with our professional photography services.
          </p>
        </div>

        <form className="w-full max-w-4xl bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-xl p-8 relative z-10" onSubmit={handleSubmit}>
          {/* Package Info Badge */}
          <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-700">
            <div>
              <h2 className="text-2xl font-bold text-white">
                {selectedPackage?.name || 'Wedding Package'}
              </h2>
              {selectedPackage?.type && (
                <span className="inline-block mt-2 px-3 py-1 text-sm font-medium bg-amber-900/50 text-amber-200 rounded-full border border-amber-800/50">
                  {selectedPackage.type}
                </span>
              )}
            </div>
            {selectedPackage?.price && (
              <div className="text-right">
                <p className="text-2xl font-bold text-white">${selectedPackage.price}</p>
                {selectedPackage.duration && (
                  <p className="text-sm text-amber-200/80">{selectedPackage.duration} session</p>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {[ 
              { 
                label: "Customer Name", 
                name: "customerName",
                icon: "👤",
                required: true
              },
              { 
                label: "Bride's Name", 
                name: "brideName",
                icon: "👰",
                required: true
              },
              { 
                label: "Groom's Name", 
                name: "groomName",
                icon: "🤵",
                required: true
              },
              { 
                label: "Bride's Father", 
                name: "brideFather",
                icon: "👨",
                required: false
              },
              { 
                label: "Bride's Mother", 
                name: "brideMother",
                icon: "👩",
                required: false
              },
              { 
                label: "Groom's Father", 
                name: "groomFather",
                icon: "👨",
                required: false
              },
              { 
                label: "Groom's Mother", 
                name: "groomMother",
                icon: "👩",
                required: false
              },
              { 
                label: "Phone Number", 
                name: "phone",
                icon: "📱",
                required: true
              },
              { 
                label: "Email", 
                name: "email",
                icon: "✉️",
                required: false
              },
              { 
                label: "Event Date", 
                name: "eventDate", 
                type: "date",
                icon: "📅",
                required: true
              },
              { 
                label: "Booking Date", 
                name: "bookingDate", 
                type: "date",
                icon: "📅",
                required: false
              },
              { 
                label: "Reception Date", 
                name: "receptionDate", 
                type: "date",
                icon: "📅",
                required: false
              },
              { 
                label: "Location", 
                name: "location",
                icon: "📍",
                required: true
              },
              { 
                label: "Storage Name", 
                name: "storageName",
                icon: "💾",
                required: false,
                description: "For organizing your photos"
              },
              { 
                label: "Special Requests", 
                name: "notes", 
                type: "textarea",
                icon: "📝",
                required: false,
                placeholder: "Any special requests or additional information..."
              },
            ].map(({ label, name, type = 'text', options = [], icon = '✏️', required = false, description, placeholder }) => (
              <div key={name} className={`w-full ${name === 'notes' ? 'md:col-span-2' : ''}`}>
                <label className="block text-gray-300 text-sm font-medium mb-2 flex items-start">
                  <span className="mr-2 mt-0.5">{icon}</span>
                  <span>
                    {label}
                    {required && <span className="text-amber-500 ml-1">*</span>}
                    {description && <div className="text-xs text-gray-400 font-normal mt-1">{description}</div>}
                  </span>
                </label>
                {type === 'textarea' ? (
                  <div className="relative mt-1">
                    <textarea
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      className="block w-full rounded-lg border-0 bg-gray-700/50 text-white shadow-sm ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-500 sm:text-sm sm:leading-6 p-3 min-h-[120px] focus:outline-none transition-colors hover:ring-gray-500"
                      rows="4"
                      placeholder={placeholder || label}
                      required={required}
                    />
                  </div>
                ) : type === 'select' ? (
                  <div className="relative mt-1">
                    <select
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      className="block w-full rounded-lg border-0 bg-gray-700/50 text-white shadow-sm ring-1 ring-inset ring-gray-600 focus:ring-2 focus:ring-inset focus:ring-amber-500 sm:text-sm sm:leading-6 py-3 px-4 focus:outline-none transition-colors hover:ring-gray-500 appearance-none"
                      required={required}
                    >
                      <option value="">Select {label}</option>
                      {options.map(option => (
                        <option key={option} value={option} className="bg-gray-800 text-white">
                          {option}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                ) : (
                  <div className="relative mt-1">
                    <input
                      type={type}
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      className={`block w-full rounded-lg border-0 bg-gray-700/50 text-white shadow-sm ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-500 sm:text-sm sm:leading-6 py-3 px-4 focus:outline-none transition-colors hover:ring-gray-500 ${errors[name] ? 'ring-red-500' : ''}`}
                      placeholder={placeholder || label}
                      min={type === 'number' ? 1 : undefined}
                      max={type === 'number' ? 1000 : undefined}
                      minLength={type === 'tel' ? 10 : undefined}
                      maxLength={type === 'tel' ? 15 : undefined}
                      required={required}
                    />
                  </div>
                )}
                {errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name]}</p>}
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-center">
            <label className="flex items-center gap-3 text-sm text-gray-300">
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 rounded border-gray-500 bg-gray-700 text-amber-500 focus:ring-amber-500"
              />
              Notify studio owner by email about this booking
            </label>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6 pt-6 border-t border-gray-700">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-6 py-3.5 bg-gray-700/50 hover:bg-gray-600/50 text-white font-medium rounded-lg text-base border border-gray-600 transition-all hover:border-gray-500 flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Packages
            </button>
            <button
              type="submit"
              className={`px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold rounded-lg text-base shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-80 cursor-not-allowed' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Confirm Booking
                </>
              )}
            </button>
          </div>
          
          <p className="text-center text-sm text-gray-400 mt-6">
            By submitting this form, you agree to our{' '}
            <a href="/terms" className="text-amber-400 hover:text-amber-300 underline">Terms of Service</a> and{' '}
            <a href="/privacy" className="text-amber-400 hover:text-amber-300 underline">Privacy Policy</a>.
          </p>
        </form>
      </div>
    </div>
  );
};

export default WeddingBookingForm;
