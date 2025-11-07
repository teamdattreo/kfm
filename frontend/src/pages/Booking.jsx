import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header'; // Import the Header component

const BookingSelect = () => {
  const [selectedType, setSelectedType] = useState('');
  const navigate = useNavigate();

  const handleNext = () => {
    if (selectedType) {
      navigate(`/${selectedType}BookingForm`);
    }
  };

  return (
    <div className="relative">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header />
      </div>
      <div className="min-h-screen bg-black text-white flex flex-col items-center pt-32 pb-12 px-4 sm:px-6">

        <div className="text-center mb-10 max-w-2xl">
          <h1 className="bg-gradient-to-r from-white to-[#BF3030] bg-clip-text text-transparent text-4xl sm:text-5xl font-bold mb-3">
            Select Your Event Type
          </h1>
          <p className="text-xs font-medium bg-gradient-to-r from-white to-[#BF3030] bg-clip-text text-transparent">
            Studio KFM | Professional Photography Services
          </p>
        </div>

        {/* Event Type Selection with Larger Buttons and Different Colors */}
        <div className="mb-8 flex flex-col gap-8 justify-center items-center">
          {/* Wedding Card */}
          <button
            onClick={() => setSelectedType('Wedding')}
            className={`w-full max-w-lg py-6 px-12 rounded-xl text-center text-white font-semibold transition-all duration-200
              ${selectedType === 'Wedding' ? 'bg-[#E63946]' : 'bg-[#F1FAEE] text-[#1D3557]'} hover:bg-[#F1FAEE] hover:text-[#E63946]`}
          >
            Wedding
          </button>

          {/* Puberty Card */}
          <button
            onClick={() => setSelectedType('Puberty')}
            className={`w-full max-w-lg py-6 px-12 rounded-xl text-center text-white font-semibold transition-all duration-200
              ${selectedType === 'Puberty' ? 'bg-[#457B9D]' : 'bg-[#F1FAEE] text-[#1D3557]'} hover:bg-[#F1FAEE] hover:text-[#457B9D]`}
          >
            Puberty Shoot
          </button>

          {/* Birthday Card */}
          <button
            onClick={() => setSelectedType('Birthday')}
            className={`w-full max-w-lg py-6 px-12 rounded-xl text-center text-white font-semibold transition-all duration-200
              ${selectedType === 'Birthday' ? 'bg-[#F1FAEE]' : 'bg-[#E63946] text-[#1D3557]'} hover:bg-[#F1FAEE] hover:text-[#E63946]`}
          >
            Birthday
          </button>
        </div>

        {/* Simple Selection Confirmation Button */}
        <div className="mt-12">
          <button
            onClick={handleNext}
            disabled={!selectedType}
            className={`w-full max-w-lg py-6 px-12 rounded-xl text-center font-bold text-white transition-all duration-200
              ${selectedType ? 'bg-[#1D3557] hover:bg-[#457B9D]' : 'bg-gray-600 cursor-not-allowed'}`}
          >
            Proceed
          </button>
        </div>

      </div>
    </div>
  );
};

export default BookingSelect;
