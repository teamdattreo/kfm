// ContactPage.jsx
import React from 'react';
import { FaWhatsapp, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const ContactPage = () => {
  // Updated number: 94 (Sri Lanka code) + 785101018 (Number without leading 0)
  const whatsappLink = "https://wa.me/94785101018?text=Hi%2C%20I%20want%20to%20contact%20you";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center py-12 px-4 sm:py-16">
      {/* Main Contact Card */}
      <div className="w-full max-w-5xl bg-gray-800/80 backdrop-blur-lg rounded-3xl p-8 sm:p-12 shadow-2xl border border-gray-700 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-900/30 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-20 left-20 w-72 h-72 bg-blue-900/30 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        
        <div className="text-center max-w-4xl mx-auto mb-12">
          <span className="inline-block bg-amber-900/30 text-amber-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-4 border border-amber-800/50">
            Contact Us
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Let's <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-600">Connect</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Have questions or ready to book your session? Reach out to us through any of the channels below.
          </p>
        </div>

        {/* Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* WhatsApp */}
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-amber-500/30 transition-colors">
            <div className="bg-green-600/20 w-14 h-14 rounded-full flex items-center justify-center mb-4 mx-auto">
              <FaWhatsapp className="text-2xl text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">WhatsApp</h3>
            <p className="text-gray-400 mb-4">Chat with us instantly</p>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition transform hover:scale-105"
            >
              <FaWhatsapp className="text-lg" />
              Message Now
            </a>
          </div>

          {/* Phone */}
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-amber-500/30 transition-colors">
            <div className="bg-blue-600/20 w-14 h-14 rounded-full flex items-center justify-center mb-4 mx-auto">
              <FaPhone className="text-xl text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Call Us</h3>
            <p className="text-gray-400 mb-4">+94 78 510 1018</p>
            <a
              href="tel:+94771129911"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition transform hover:scale-105"
            >
              <FaPhone className="text-sm" />
              Call Now
            </a>
          </div>

          {/* Location */}
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-amber-500/30 transition-colors">
            <div className="bg-amber-600/20 w-14 h-14 rounded-full flex items-center justify-center mb-4 mx-auto">
              <FaMapMarkerAlt className="text-xl text-amber-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Location</h3>
            <p className="text-gray-400 mb-4">Colombo, Sri Lanka</p>
            <a
              href="https://maps.google.com?q=Colombo+Sri+Lanka"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-medium transition transform hover:scale-105"
            >
              <FaMapMarkerAlt className="text-sm" />
              View on Map
            </a>
          </div>
        </div>

        {/* Additional Contact Info */}
        <div className="text-center pt-8 border-t border-gray-700">
          <div className="inline-flex items-center gap-2 text-gray-400 mb-2">
            <FaEnvelope className="text-amber-500" />
            <a href="mailto:info@kfm.com" className="hover:text-amber-400 transition-colors">
              info@kfm.com
            </a>
          </div>
          <p className="text-sm text-gray-500">We typically respond within 24 hours</p>
        </div>
      </div>

      {/* Floating WhatsApp Button */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-gradient-to-r from-green-600 to-green-700 text-white p-4 rounded-full shadow-xl z-50 hover:scale-110 transition-transform group"
        title="Chat on WhatsApp"
      >
        <div className="absolute -inset-0.5 bg-green-400/50 rounded-full blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
        <FaWhatsapp className="text-2xl relative z-10" />
      </a>
    </div>
  );
};

export default ContactPage;