import React from 'react'
import { Link, useNavigate } from 'react-router-dom';


const Footer = () => {
  return (
    <>
            <footer className="bg-black text-white pt-8 pb-12 px-4 sm:px-8 lg:px-16 relative overflow-hidden">  
      {/* Footer content container */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
    
    {/* Contact Section - Left */}
       <div className="text-center md:text-left">
      <h3 className="text-xl font-bold tracking-wider mb-6">
        <span className="text-amber-400">Interested</span> in working together
      </h3>
      
      <div className="flex justify-center md:justify-start mb-6">
        <div className="relative">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-wider">CONTACT US</h2>
        
        </div>
      </div>
      
      <p className="text-xs text-gray-400 tracking-wide mb-8">Get in touch with us</p>    
      <Link to ='/contact'><button className="px-8 py-3 bg-transparent border-2 border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white rounded-full font-medium transition-colors">
        Send a Message
      </button></Link>
    </div>

    {/* Brand Section - Middle */}
    <div className="flex flex-col items-center justify-between">

    <div className="flex justify-center md:justify-start mb-6">
        <div className="relative">
        <div className="text-center">      
        <div className="text-3xl font-bold mb-4">
          <span className="text-amber-400">Studio</span>
          <span className="text-white">KFM</span>         
        </div>       
      </div>
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent"></div>
        </div>
      </div>

      
      
      <div className="flex space-x-6">
        {/* Instagram */}
        <a href="https://www.instagram.com/studio.kfm?igsh=bGp1Zmhkdmw4ZHh2" className="text-gray-400 hover:text-amber-400 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
          </svg>
        </a>
        
        {/* Facebook */}
        <a href="https://www.facebook.com/KFMKALMUNAI" className="text-gray-400 hover:text-amber-400 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
          </svg>
        </a>
        
        {/* Email */}
        <a href="kishafilmmakers.lmt@gmail.com" className="text-gray-400 hover:text-amber-400 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z"/>
          </svg>
        </a>
      </div>
    </div>

    {/* Contact Info - Right */}
    <div className="text-center md:text-right">
      <div className="space-y-4">
        <div>
          <h4 className="text-amber-400 font-medium mb-1">Email</h4>
          <p className="text-gray-300">kishafilmmakers.lmt@gmail.com</p>
        </div>
        
        <div>
          <h4 className="text-amber-400 font-medium mb-1">Call us</h4>
          <p className="text-gray-300">078 510 1018</p>
        </div>
        
        <div>
          <h4 className="text-amber-400 font-medium mb-1">Follow us</h4>
          <p className="text-gray-300">@StudioKFM</p>
        </div>
      </div>
    </div>
  </div>

  {/* Bottom border and copyright */}
  <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-gray-800 text-center text-xs text-gray-500">
    © {new Date().getFullYear()} Studio KFM. All rights reserved.
  </div>

  {/* Background elements */}
  <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-400 rounded-full opacity-10 blur-xl"></div>
  <div className="absolute top-1/3 right-0 w-24 h-24 bg-red-500 rounded-full opacity-10 blur-xl"></div>
      </footer>
    </>
  )
}

export default Footer