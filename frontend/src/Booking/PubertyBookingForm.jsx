import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_ENDPOINTS, api } from '../api';
import Header from '../components/Header';
import { FiHome } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const PubertyBookingForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    girlName: '',
    parentName: '',
    phone: '',
    email: '',
    eventDate: '',
    bookingDate: '',
    location: '',
    outfitChange: '',
    storageName: '',
    notes: '',
    package: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Retrieve event and package from location state
  const selectedEvent = location.state?.selectedEvent || '';
  const selectedPackage = location.state?.selectedPackage || '';

  useEffect(() => {
    if (selectedEvent) {
      setFormData((prevData) => ({
        ...prevData,
        eventDate: selectedEvent,
        package: selectedPackage,
      }));
    }
  }, [selectedEvent, selectedPackage]);

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

    // Get and validate user ID
    const userId = localStorage.getItem('userId');
    if (!userId || userId === "undefined") {
      alert('Please log in to make a booking');
      setIsSubmitting(false);
      return;
    }

    // Enhanced validation
    const requiredFields = {
      girlName: "Girl's name",
      parentName: "Parent's name",
      phone: "Phone number",
      eventDate: "Event date",
      package: "Package"
    };

    const newErrors = {};
    // Object.entries(requiredFields).forEach(([field, name]) => {
    //   if (!formData[field]?.trim()) {
    //     newErrors[field] = `${name} is required`;
    //   }
    // });

    // Phone validation
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
        userId
      };

      const response = await api.post(API_ENDPOINTS.BOOKINGS.CREATE_PUBERTY, bookingData);
      alert("Puberty booking submitted successfully!");
      navigate('/BookingHistory');
    } catch (error) {
      console.error('Booking error:', {
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
         <div className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-4 py-3 bg-black bg-opacity-50">
  <Link to="/UserHomePage" className="text-white hover:text-[#FFCF40] transition-colors" title="Back to Home">
    <FiHome className="text-2xl sm:text-3xl" />
  </Link>
</div>
      <div className="min-h-screen bg-black text-white flex flex-col items-center pt-32 pb-12 px-4 sm:px-6">
        <div className="text-center mb-10 max-w-2xl">
          <h1 className="bg-gradient-to-r from-white to-[#BF3030] bg-clip-text text-transparent text-4xl sm:text-5xl font-bold mb-3">
            Puberty Booking Form
          </h1>
          <p className="text-xs font-medium bg-gradient-to-r from-white to-[#BF3030] bg-clip-text text-transparent">
            Studio KFM | Professional Photography Services
          </p>
        </div>

        <form className="w-full max-w-4xl bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] opacity-90 border border-gray-700 p-8 rounded-xl shadow-2xl" onSubmit={handleSubmit}>
          <h2 className="text-3xl font-bold mb-8 text-white text-center">
            Complete Your <span className="text-[#FFCF40]">Puberty Booking</span>
          </h2>

          <div className="text-center mb-8">
            {/* <p className="text-lg text-white mb-4">Event: {selectedEvent}</p> */}
            <p className="text-lg text-white mb-4">Package: {selectedPackage.type}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            {[ 
              { label: "Girl's Name", name: "girlName" },
              { label: "Parent's Name", name: "parentName" },
              { label: "Phone Number", name: "phone" },
              { label: "Email", name: "email" },
              { label: "Event Date", name: "eventDate", type: "date" },
              { label: "Booking Date", name: "bookingDate", type: "date" },
              { label: "Location", name: "location" },
              { 
                label: "Outfit Change", 
                name: "outfitChange", 
                type: "select", 
                options: ['Yes', 'No'] 
              },
              { label: "Storage Name", name: "storageName" },
              { label: "Notes", name: "notes", type: "textarea" },
            ].map(({ label, name, type = 'text', options = [] }) => (
              <div key={name} className="w-full">
               <label className="block text-white text-lg">
  {label}
  {["girlName", "parentName", "phone", "eventDate", "location","package"].includes(name) && (
    <span className="text-red-500 text-10px" > Please fill this field (required).</span>
  )}
</label>

                {type === 'textarea' ? (
                  <textarea
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className="border rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-[#FFCF40] bg-gray-800 text-white placeholder-gray-400"
                    rows="4"
                    placeholder={label}
                  />
                ) : type === 'select' ? (
                  <select
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className="border rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-[#FFCF40] bg-gray-800 text-white placeholder-gray-400"
                  >
                    <option value="">Select {label}</option>
                    {options.map(option => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className="border rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-[#FFCF40] bg-gray-800 text-white placeholder-gray-400"
                    placeholder={label}
                  />
                )}
                {errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name]}</p>}
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-8 py-3 rounded-xl font-bold text-white transition-all duration-200 ${
                isSubmitting ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#FFCF40] hover:bg-[#e6b935] shadow-lg'
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PubertyBookingForm;
