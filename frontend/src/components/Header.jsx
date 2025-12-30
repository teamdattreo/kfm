import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({ name: '', profilePic: '' });
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const dropdownRef = useRef(null);

  const location = useLocation();

  const syncAuthState = () => {
    const token = localStorage.getItem('authToken');
    const user = JSON.parse(localStorage.getItem('userData'));
    if (token) {
      setIsLoggedIn(true);
      setUserData({
        name: user?.name || 'User',
        profilePic: user?.profilePic || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
      });
    } else {
      setIsLoggedIn(false);
      setUserData({ name: '', profilePic: '' });
    }
  };

  useEffect(() => {
    syncAuthState();
  }, [location.pathname]);

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'authToken' || e.key === 'userData') {
        syncAuthState();
      }
    };
    const handleFocus = () => syncAuthState();
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') syncAuthState();
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  // close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogin = () => navigate('/login');

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setIsLoggedIn(false);
    setUserData({ name: '', profilePic: '' });
    setShowDropdown(false);
    setMobileOpen(false);
    navigate('/');
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-50">
      <div className="mx-3 my-3 sm:mx-6 sm:my-4 lg:mx-[70px] lg:my-[40px]">
        <nav className="flex items-center justify-between rounded-full border border-gray-600 bg-gray-700/40 backdrop-blur-md px-4 py-2 sm:px-6 sm:py-3">
          {/* Brand */}
          <Link to="/" className="text-2xl font-bold" onClick={closeMobile}>
            <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">
              Studio
            </span>
            <span className="text-white">KFM</span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center space-x-6 lg:space-x-8 text-white font-medium">
            <li>
              <Link to="/UserHomePage" className="hover:text-[#FFCF40]">Home</Link>
            </li>
            <li>
              <Link to="/Portfolio" className="hover:text-[#FFCF40]">About Us</Link>
            </li>
            <li>
              <Link to="/Products" className="hover:text-[#FFCF40]">Sales</Link>
            </li>
          </ul>

          {/* Right side: profile or login (desktop) */}
          <div className="hidden md:flex items-center">
            {isLoggedIn ? (
              <div className="flex items-center gap-3" ref={dropdownRef}>
                <span className="text-white/90 font-medium max-w-[140px] truncate">{userData.name}</span>
                <button
                  className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#FFCF40] focus:outline-none focus:ring-2 focus:ring-amber-400"
                  onClick={() => setShowDropdown((v) => !v)}
                  aria-haspopup="menu"
                  aria-expanded={showDropdown}
                >
                  <img src={userData.profilePic} alt="User" className="w-full h-full object-cover" />
                </button>

                {showDropdown && (
                  <div className="absolute right-6 mt-14 w-48 rounded-md border border-gray-600 bg-gray-700 shadow-lg">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-white hover:bg-gray-600"
                      onClick={() => setShowDropdown(false)}
                    >
                      Profile
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-white hover:bg-gray-600"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="flex items-center gap-2 text-white hover:text-[#FFCF40] font-medium"
              >
                Login
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </button>
            )}
          </div>

          {/* Hamburger (mobile) */}
          <button
            className="md:hidden inline-flex items-center justify-center rounded-full p-2 text-white hover:text-[#FFCF40] focus:outline-none focus:ring-2 focus:ring-amber-400"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              // X icon
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              // Hamburger icon
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </nav>

        {/* Mobile panel */}
        {mobileOpen && (
          <div className="md:hidden mt-2 rounded-2xl border border-gray-600 bg-gray-700/40 backdrop-blur-md px-4 py-3">
            <ul className="space-y-2 text-white font-medium">
              <li>
                <Link to="/UserHomePage" className="block rounded-lg px-3 py-2 hover:bg-gray-600/60" onClick={closeMobile}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/Portfolio" className="block rounded-lg px-3 py-2 hover:bg-gray-600/60" onClick={closeMobile}>
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/Products" className="block rounded-lg px-3 py-2 hover:bg-gray-600/60" onClick={closeMobile}>
                  Sales
                </Link>
              </li>
            </ul>

            <div className="mt-3 border-t border-gray-600 pt-3">
              {isLoggedIn ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#FFCF40]">
                    <img src={userData.profilePic} alt="User" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-semibold">{userData.name}</p>
                    <div className="mt-2 flex gap-2">
                      <Link
                        to="/profile"
                        onClick={closeMobile}
                        className="rounded-full bg-white/10 px-3 py-1 text-sm text-white hover:bg-white/20"
                      >
                        Profile
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="rounded-full bg-amber-400 px-3 py-1 text-sm text-black hover:bg-amber-500"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => { closeMobile(); handleLogin(); }}
                  className="mt-1 w-full rounded-full border border-white/20 px-4 py-2 text-white hover:bg-white/10"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
