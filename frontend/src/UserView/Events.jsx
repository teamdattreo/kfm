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
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="relative isolate overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#1c1c1c,transparent_55%)]"></div>
        <div className="absolute -top-40 right-0 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl"></div>
        <div className="absolute -bottom-40 left-0 h-80 w-80 rounded-full bg-amber-300/10 blur-3xl"></div>
        <div className="relative max-w-7xl mx-auto px-4 pt-20 pb-10">
          <div className="text-center mb-14">
            <p className="text-xs uppercase tracking-[0.3em] text-amber-300/70 mb-3">
              Studio KFM
            </p>
            <h1 className="text-4xl md:text-6xl font-semibold mb-4 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent">
              Event Photography Services
            </h1>
            <p className="text-sm md:text-base text-gray-300 max-w-2xl mx-auto">
              Curated coverage for timeless celebrations. Choose your event, browse the gallery, and book your session in minutes.
            </p>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div
              key={event.name}
              className={`relative flex flex-col justify-between rounded-3xl overflow-hidden transition-all duration-500 group bg-gradient-to-b from-white/5 to-white/0 border border-white/10 hover:border-amber-400/50 hover:-translate-y-1
              ${event.featured ? "shadow-[0_20px_60px_-30px_rgba(245,158,11,0.7)] ring-1 ring-amber-400/60" : "shadow-[0_12px_40px_-30px_rgba(0,0,0,0.8)]"}`}
            >
              {event.featured && (
                <div className="absolute top-4 right-4 bg-amber-400 text-black text-xs font-bold px-3 py-1 rounded-full z-10 shadow-lg shadow-amber-400/40">
                  MOST POPULAR
                </div>
              )}

              {/* Event Image */}
              <div className="aspect-[4/3] overflow-hidden relative">
                <img
                  src={event.image}
                  alt={event.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col justify-between grow bg-black/70 backdrop-blur-md">
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-amber-100">{event.name}</h3>
                  <p className="text-gray-300 text-sm mb-4">
                    Tailored coverage, refined edits, and a seamless studio experience from booking to delivery.
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                  <button
                    onClick={scrollToGallery}
                    className="w-full sm:w-1/2 py-2.5 bg-amber-400 hover:bg-amber-500 text-black rounded-lg font-semibold text-sm tracking-wide transition-all text-center shadow-md shadow-amber-400/30"
                  >
                    View Gallery
                  </button>
                  <button
                    onClick={() => handleBookNow(event.name)}
                    className="w-full sm:w-1/2 py-2.5 bg-transparent border border-amber-400/70 text-amber-300 hover:border-amber-300 hover:text-amber-200 hover:bg-amber-400/10 rounded-lg font-semibold text-sm tracking-wide transition-all text-center"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Gallery */}
        <div ref={galleryRef} className="mt-24 md:mt-32">
          <div className="mb-10 flex items-center justify-between">
            <h2 className="text-2xl md:text-3xl font-semibold text-white">
              Featured Gallery
            </h2>
            <button
              onClick={scrollToGallery}
              className="hidden sm:inline-flex items-center text-sm font-semibold text-amber-300 hover:text-amber-200"
            >
              Scroll to Gallery
            </button>
          </div>
          <Gallery />
        </div>

        {/* Get in Touch Section */}
       
      </div>
    </div>
  );
};

export default Events;
