import React, { useRef, useEffect } from 'react';
import img1 from '../assets/birthday.jpg';
import img from '../assets/wed.jpg';
import img2 from '../assets/puberty.jpg';
import img3 from '../assets/graduation.jpg';
import Gallery from '../pages/Gallery';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import { API_ENDPOINTS, api } from '../api';

const Events = () => {
  const galleryRef = useRef(null);
  const location = useLocation();
  const [contactOption, setContactOption] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(location.state?.selectedEvent || '');
  const [selectedPackage, setSelectedPackage] = useState('');
  const [allPackages, setAllPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const events = [
    {
      name: "Wedding Photography",
      featured: true,
      image: img,
      options: []
    },
    {
      name: "Birthday Celebrations",
      featured: false,
      image: img1,
      options: []
    },
    {
      name: "Puberty Shoot",
      featured: false,
      image: img2,
      options: []
    },
    {
      name: "Corporate Events",
      featured: false,
      image: img3,
      options: []
    },
  ];

  const scrollToGallery = () => {
    galleryRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  const handleBookNow = (eventName) => {
    navigate('/contactUs', { state: { selectedEvent: eventName } });
  };

  const whatsappLink = "https://wa.me/94771129911?text=Hi%2C%20I%20want%20to%20contact%20you";

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await api.get(API_ENDPOINTS.PACKAGES.GET_ALL);
        setAllPackages(Array.isArray(response) ? response : []);
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
      silver: {
        bgFrom: 'from-gray-200',
        bgTo: 'to-gray-300',
        iconBg: 'bg-gray-400',
        titleColor: 'text-gray-800',
        textColor: 'text-gray-600',
      },
      gold: {
        bgFrom: 'from-amber-500',
        bgTo: 'to-amber-300',
        iconBg: 'bg-amber-600',
        titleColor: 'text-white',
        textColor: 'text-amber-100',
      },
      diamond: {
        bgFrom: 'from-cyan-300',
        bgTo: 'to-blue-200',
        iconBg: 'bg-cyan-500',
        titleColor: 'text-gray-800',
        textColor: 'text-gray-600',
      },
      platinum: {
        bgFrom: 'from-gray-700',
        bgTo: 'to-gray-900',
        iconBg: 'bg-gray-600',
        titleColor: 'text-white',
        textColor: 'text-gray-300',
      }
    };

    return packageStyles[type.toLowerCase()] || {
      bgFrom: 'from-purple-400',
      bgTo: 'to-purple-200',
      iconBg: 'bg-purple-500',
      titleColor: 'text-gray-800',
      textColor: 'text-gray-600',
    };
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 py-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-700 bg-clip-text text-transparent">
            Event Photography Services
          </h1>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {events.map((event) => (
            <div
              key={event.name}
              className={`relative flex flex-col justify-between rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] group bg-gray-900
              ${event.featured ? "ring-2 ring-amber-400 shadow-lg shadow-amber-400/30" : "hover:ring-1 hover:ring-amber-300"}`}
            >
              {event.featured && (
                <div className="absolute top-4 right-4 bg-amber-400 text-black text-xs font-bold px-3 py-1 rounded-full z-10">
                  MOST POPULAR
                </div>
              )}

              {/* Event Image */}
              <div className="aspect-[4/3] overflow-hidden relative">
                <img
                  src={event.image}
                  alt={event.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col justify-between grow bg-gray-900/80 backdrop-blur-sm">
                <div>
                  <h3 className="text-xl font-bold mb-2">{event.name}</h3>
                  <p className="text-gray-300 text-sm mb-4">{event.description}</p>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                  <button
                    onClick={scrollToGallery}
                    className="w-full sm:w-1/2 py-2 bg-amber-400 hover:bg-amber-500 text-black rounded-lg font-medium text-sm transition-all text-center"
                  >
                    View Gallery
                  </button>
                  <button
                    onClick={() => handleBookNow(event.name)}
                    className="w-full sm:w-1/2 py-2 bg-transparent border border-amber-400 text-amber-400 hover:bg-amber-400/10 rounded-lg font-medium text-sm transition-all text-center"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Gallery */}
        <div ref={galleryRef} className="mt-[160px]">
          <Gallery />
        </div>

        {/* Get in Touch Section */}
       
      </div>
    </div>
  );
};

export default Events;
