// ContactPage.jsx
import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const ContactPage = () => {
  const whatsappLink = "https://wa.me/94771129911?text=Hi%2C%20I%20want%20to%20contact%20you";

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex flex-col items-center justify-center px-4 py-16">
      {/* Main Contact Card */}
      <div className="w-full max-w-4xl bg-black/80 backdrop-blur-md rounded-3xl p-8 sm:p-12 shadow-2xl border border-gray-700 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Get in Touch</h1>
        <p className="text-gray-300 text-lg mb-8">
          We'd love to hear from you! Message us on WhatsApp or book a session today.
        </p>

        {/* WhatsApp Button */}
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-3 px-6 py-4 rounded-full bg-green-500 hover:bg-green-600 text-white font-semibold text-lg shadow-xl transition transform hover:scale-105"
        >
          <FaWhatsapp className="text-2xl" />
          Chat on WhatsApp
        </a>

        {/* Optional Booking CTA */}
        {/* <div className="mt-10">
          <a
            href="/contactUs"
            className="inline-block px-6 py-3 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-semibold text-lg shadow-lg transition transform hover:scale-105"
          >
            Make a Booking
          </a>
        </div> */}
      </div>

      {/* Floating WhatsApp Button */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg z-50 hover:bg-green-600 transition transform hover:scale-110"
        title="Chat on WhatsApp"
      >
        <FaWhatsapp className="text-2xl" />
      </a>
    </div>
  );
};

export default ContactPage;
