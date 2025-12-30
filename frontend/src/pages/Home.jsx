import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import BannerShowPage from '../Banner/BannerShowPage';
import photo2 from '../assets/Sony_FX3.png';
import Portfolio from '../Portfolio/Portfolio';
import HeaderHome from '../components/HeaderHome';
import logo from '../assets/KFM_Logo2.PNG';
import { API_ENDPOINTS, api } from '../api';
import ClientPackagesPage from '../Packages/ClientPackagesPage';

const Home = () => {
  const [bannerUrl, setBannerUrl] = useState('/default-banner.jpg');
  const pricingRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const data = await api.get(API_ENDPOINTS.BANNERS_UI.CURRENT);

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
    <div className="">
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


        <div className="relative bg-black py-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(255,207,64,0.18),transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.08),transparent_60%)]" />
          {/* <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:120px_120px]" /> */}
          <div className="relative mx-auto max-w-4xl px-6 text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-amber-300/80">Studio KFM</p>
            <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-semibold text-white">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                Studio
              </span>{' '}
              KFM
            </h1>
            <p className="mt-4 text-sm sm:text-base text-gray-300">
              Capture your special moments with our professional photography services. We
              specialize in creating memories that last a lifetime.
            </p>
            <Link to="./login" className="mt-6 inline-flex">
              <span className="rounded-full border border-amber-300/60 bg-black/40 px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-amber-100 hover:bg-black/60">
                Book Your Session
              </span>
            </Link>
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

       
       < ClientPackagesPage/>

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
