import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import BannerShowPage from '../Banner/BannerShowPage';
import photo2 from '../assets/Sony_FX3.png';
import Portfolio from '../Portfolio/Portfolio';
import HeaderHome from '../components/HeaderHome';
import logo from '../assets/KFM_Logo.png';

const Home = () => {
  const [bannerUrl, setBannerUrl] = useState('/default-banner.jpg');
  const pricingRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await fetch('http://localhost:4000/BannersOperations/current', {
          headers: {
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorData}`);
        }

        const data = await response.json();
        if (data.imageUrl) {
          setBannerUrl(data.imageUrl);
        } else {
          throw new Error('No imageUrl in response');
        }
      } catch (error) {
        console.error('Banner fetch error:', error);
        setBannerUrl('/default-banner.jpg');
      }
    };

    fetchBanner();
  }, []);

  const scrollToPricing = () => {
    pricingRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const navigateTo = (path) => {
    if (path === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate(path);
    }
  };

  return (
    <div className="">
      {/* Navigation Header */}
      {/* <header className="sticky top-0 z-50 bg-gray-700 border border-gray-600 bg-opacity-30 backdrop-blur-md rounded-full mx-[70px] my-[40px]">
        <nav className="flex items-center justify-between px-8 py-3 mx-[40px]">
          <div className="text-2xl font-bold">
            <span style={{ color: '#FFCF40' }}>Studio</span>
            <span className="text-white">KFM</span>
          </div>

          <ul className="flex space-x-8 text-white font-medium">
            <li>
              <button 
                onClick={() => navigateTo('/')} 
                className="text-md hover:text-[#FFCF40] transition-colors duration-300"
              >
                Home
              </button>
            </li>
            <li>
              <button 
                onClick={() => navigateTo('/Portfolio')} 
                className="text-md hover:text-[#FFCF40] transition-colors duration-300"
              >
                About Us
              </button>
            </li>
            <li>
              <button 
                onClick={() => navigateTo('/Production')} 
                className="text-md hover:text-[#FFCF40] transition-colors duration-300"
              >
                Production
              </button>
            </li>
            <li>
              <button 
                onClick={scrollToPricing} 
                className="text-md hover:text-[#FFCF40] transition-colors duration-300"
              >
                Pricing
              </button>
            </li>
          </ul>
        </nav>
      </header> */}
      
      {/* Hero Banner Section */}
     

      <div className="fixed top-0 left-0 right-0 z-50">
        <HeaderHome />
      </div>

 
      
      <div 
        className="hero min-h-screen " 
        style={{ 
          backgroundImage: `url(${bannerUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: 'background-image 0.5s ease-in-out'
        }}
      >
 

        {/* <div className="hero-overlay bg-opacity-60"></div> */}
        <div className="hero-content text-neutral-content text-center relative z-10">
          <div className="max-w-md">
            
 <div className="flex justify-center items-center">
  <div 
    className="text-xl font-bold cursor-pointer flex items-center"
    onClick={() => window.location.href = '/'}
  >
    <div className="bg-white/40 p-[16px] rounded-full shadow-md">
     <img 
  src={logo}
  alt="StudioKFM Logo"
  className="w-[100px] h-[100px] object-cover hover:scale-105 transition-transform duration-300 shrink-0"
/>

    </div>
  </div>
</div>


           

            <br /><br />

           <Link to='/Login'><button className="w-[300px] text-white font-medium py-4 rounded-full opacity-1300 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:opacity-90 transition-all duration-300">
              SIGN IN
            </button></Link>
          </div>
        </div>
      </div>


        <div className="hero bg-black h-[80vh]">
          <div className="hero-content text-center">
            <div className="max-w-3xl">
              <h1 className="text-6xl font-bold text-white">Welcome to <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">Studio</span> KFM</h1>
              <p className="py-6 text-gray-400">
                Capture your special moments with our professional photography services. 
              We specialize in creating memories that last a lifetime.
              </p>
              <Link to='./login'>
              <button className=" btn border border-amber-300 text-xl bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent hover:bg-amber-500 hover:font-medium transition-colors duration-300">Book Your Session</button>
              </Link>
            </div>
          </div>
        </div>


      {/* Banner Showcase Section */}
      <BannerShowPage/>

      {/* Camera Section */}
      <div className="relative py-20 px-4 bg-black w-full">
  <div className="relative max-w-5xl mx-auto flex flex-col items-center justify-center">
          <img
            src={photo2}
            alt="Camera"
            className="relative z-10 w-[800px] h-auto ml-[-500px]"
          />

          

          <div className="relative z-10 mt-6 flex gap-2 items-end mt-[-60px]">
            <span className="text-white text-[80px] font-guerrilla font-extrabold">Sony</span>
            <span className="text-yellow-400 italic text-[50px] font-semibold">FX 3</span>
            <span className="text-white text-5xl font-ranga" style={{ fontFamily: 'Rouge Script' }}>
              Camera
            </span>
          </div>
        </div>
      </div>
      
      {/* <hr className='h-[1px] w-full'/> */}

      {/* Pricing Section (with ref for scrolling) */}
      <div ref={pricingRef} className="bg-black py-16 px-4 sm:px-6 lg:px-8">
        {/* Decorative elements */}
        {/* <div className="fixed opacity-40 rounded-full" style={{
          backgroundColor: '#BF9B30',
          width: '120px',
          height: '120px',
          top: '-40px',
          left: '0px',
          zIndex: 0,
        }}></div>

        <div className="fixed opacity-40 rounded-full" style={{
          backgroundColor: '#BF9B30',
          width: '80px',
          height: '80px',
          top: '60px',
          left: '20px',
          zIndex: 0,
        }}></div>

        <div className="fixed opacity-40 rounded-full blur-2xl" style={{
          backgroundColor: '#BF9B30',
          width: '300px',
          height: '300px',
          top: '-40px',
          left: '-80px',
          zIndex: 0,
        }}></div>

        <div className="fixed opacity-60 rounded-full" style={{
          backgroundColor: '#BF3030',
          width: '160px',
          height: '160px',
          bottom: '-50px',
          right: '-90px',
          zIndex: 0,
        }}></div>

        <div className="fixed opacity-70 rounded-full blur-2xl" style={{
          backgroundColor: '#BF3030',
          width: '260px',
          height: '260px',
          bottom: '-130px',
          right: '-10px',
          zIndex: 0,
        }}></div> */}

        {/* Pricing Content */}
        <div className="text-center mb-12 max-w-3xl mx-auto px-4">
          <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            The Perfect Package for Your <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">Precious</span> Moments
          </h1>
          <p className="text-gray-400 text-sm sm:text-base font-light tracking-wider leading-relaxed max-w-2xl mx-auto">
            Choose from our Silver, Gold, Diamond, and Platinum packages — each carefully crafted to frame your memories in timeless style
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto px-4 sm:px-6">
          {/* Silver Package */}
          <div className="bg-gradient-to-br from-gray-200 to-gray-300 p-8 rounded-xl text-center hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group hover:shadow-amber-500/20">
            <div className="h-14 w-14 mx-auto mb-6 flex items-center justify-center bg-gray-400 rounded-full shadow-md">
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z"/>
              </svg>
            </div>
            <h4 className="text-gray-800 text-2xl font-bold mb-4">Silver</h4>
            <p className="text-gray-600 mb-8 text-sm min-h-[60px]">Basic coverage with essential features for small events</p>
            <Link to='/Login'>
              <button className="w-full py-3 px-6 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-full transition-all duration-300 shadow-md hover:shadow-lg">
                Book Now
              </button>
            </Link> 
          </div>

          {/* Gold Package */}
          <div className="bg-gradient-to-br from-amber-500 to-amber-300 p-8 rounded-xl text-center hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group hover:shadow-amber-500/30">
            <div className="h-14 w-14 mx-auto mb-6 flex items-center justify-center bg-amber-600 rounded-full shadow-md">
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd"/>
              </svg>
            </div>
            <h4 className="text-white text-2xl font-bold mb-4">Gold</h4>
            <p className="text-amber-100 mb-8 text-sm min-h-[60px]">Enhanced coverage with more edits, prints, and time</p>
            <Link to='/Login'>
              <button className="w-full py-3 px-6 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-full transition-all duration-300 shadow-md hover:shadow-lg">
                Book Now
              </button>
            </Link> 
          </div>

          {/* Diamond Package */}
          <div className="bg-gradient-to-br from-cyan-400 to-blue-300 p-8 rounded-xl text-center hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group hover:shadow-cyan-500/20">
            <div className="h-14 w-14 mx-auto mb-6 flex items-center justify-center bg-cyan-500 rounded-full shadow-md">
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd"/>
              </svg>
            </div>
            <h4 className="text-gray-800 text-2xl font-bold mb-4">Diamond</h4>
            <p className="text-gray-600 mb-8 text-sm min-h-[60px]">Premium experience with extra team support and features</p>
            <Link to='/Login'>
              <button className="w-full py-3 px-6 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-full transition-all duration-300 shadow-md hover:shadow-lg">
                Book Now
              </button>
            </Link>
          </div>

          {/* Platinum Package */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-xl text-center hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group hover:shadow-gray-500/20">
            <div className="h-14 w-14 mx-auto mb-6 flex items-center justify-center bg-gray-700 rounded-full shadow-md">
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
              </svg>
            </div>
            <h4 className="text-white text-2xl font-bold mb-4">Platinum</h4>
            <p className="text-gray-300 mb-8 text-sm min-h-[60px]">Ultimate package with everything included for elite moments</p>
            <Link to='/Login'>
              <button className="w-full py-3 px-6 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-full transition-all duration-300 shadow-md hover:shadow-lg">
                Book Now
              </button>
            </Link> 
          </div>
        </div>


        {/* CTA Footer */}
        <div className="text-center mt-16">
          <p className="text-gray-400 mb-4">Not sure which package is right for you?</p>
          <Link to='/contact'><button className="px-8 py-3 bg-transparent border-2 border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white rounded-full font-medium transition-colors duration-300">
            Contact Us for Advice
          </button></Link>
        </div>
      </div>
      
      <Footer/>
    </div>
  );
};

export default Home;