import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Events from './Events';
import { API_ENDPOINTS, api } from '../api';
import BannerShowPage from '../Banner/BannerShowPage';
import Packages from '../Packages/ClientPackagesPage';
import logo from '../assets/KFM_Logo.png';
import introVideo from '../assets/KFM Intro.mp4'; // Consider renaming to KFM_Intro.mp4
import { Link } from 'react-router-dom';

const UserHomePage = () => {
  const navigate = useNavigate();
  const eventsRef = useRef(null);

  const [bannerUrl, setBannerUrl] = useState('/default-banner.jpg');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Video modal
  const [showVideo, setShowVideo] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef(null);

  // Lock body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = showVideo ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [showVideo]);

  // Close on ESC
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setShowVideo(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Smooth scroll to Events
  const scrollToEvents = () => {
    const offset = 100;
    const el = eventsRef.current;
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  // Auth + banner
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }
    setAuthChecked(true);

    const fetchBanner = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.get(API_ENDPOINTS.BANNERS_UI.CURRENT);
        setBannerUrl(data.imageUrl || '/default-banner.jpg');
      } catch (err) {
        console.error('Banner fetch error:', err);
        setError(err.message);
        setBannerUrl('/default-banner.jpg');
      } finally {
        setLoading(false);
      }
    };
    
    // const fetchBanner = async () => {
    //   try {
    //     setLoading(true);
    //     setError(null);
        
    //     const response = await fetch('http://localhost:4000/BannersUI/current1', {
    //       headers: {
    //         'Accept': 'application/json'
    //       }
    //     });

    //     if (!response.ok) {
    //       throw new Error(`HTTP error! status: ${response.status}`);
    //     }

    //     const data = await response.json();
    //     setBannerUrl(data.imageUrl || '/default-banner.jpg');
    //   } catch (error) {
    //     console.error('Banner fetch error:', error);
    //     setError(error.message);
    //     setBannerUrl('/default-banner.jpg');
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    
    
    fetchBanner();
  }, [navigate]);

  // Video controls
  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setIsPlaying(true);
    } else {
      v.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setIsMuted(v.muted);
  };

  const onOpenVideo = () => {
    setShowVideo(true);
    setIsMuted(true);     // autoplay-safe
    setIsPlaying(true);
    // will autoPlay via attribute; Safari/iOS requires muted
  };

  if (!authChecked) return null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-black">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header />
      </div>

      {/* Hero Section with Banner */}
      <div
        className="hero min-h-screen pt-16"
        style={{
          backgroundImage: `url(${bannerUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="hero-content text-center text-neutral-content">
          <div className="max-w-md">
            {/* Logo → opens video */}
            <div className="flex justify-center items-center mb-8">
              <button
                type="button"
                aria-label="Play StudioKFM intro video"
                onClick={onOpenVideo}
                className="text-xl font-bold cursor-pointer flex items-center focus:outline-none focus:ring-2 focus:ring-amber-400 rounded-full"
              >
                <div className="bg-white/40 p-[16px] rounded-full shadow-md">
                  <img
                    src={logo}
                    alt="StudioKFM Logo"
                    className="w-[100px] h-[100px] object-cover hover:scale-105 transition-transform duration-300 shrink-0"
                  />
                </div>
              </button>
            </div>

            <button
              onClick={scrollToEvents}
              className="w-[300px] text-white font-medium py-4 rounded-full opacity-1000 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:from-amber-400 hover:via-amber-500 hover:to-amber-600 hover:opacity-90 transition-all duration-300"
            >
              BOOK NOW
            </button>
          </div>
        </div>
      </div>

      {/* Welcome Strip */}
      <div className="relative overflow-hidden bg-black py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,207,64,0.12),transparent_55%)] animate-[glowShift_18s_ease-in-out_infinite]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_80%,rgba(255,255,255,0.08),transparent_60%)] animate-[glowShiftAlt_22s_ease-in-out_infinite]" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(315deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:140px_140px] animate-[gridDrift_30s_linear_infinite]" />
        <style>{`
          @keyframes glowShift {
            0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.7; }
            50% { transform: translate(6%, -4%) scale(1.05); opacity: 0.9; }
          }
          @keyframes glowShiftAlt {
            0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
            50% { transform: translate(-6%, 5%) scale(1.08); opacity: 0.85; }
          }
          @keyframes gridDrift {
            0% { background-position: 0 0, 0 0; }
            100% { background-position: 140px 140px, -140px 140px; }
          }
          @media (prefers-reduced-motion: reduce) {
            .animate-\\[glowShift_18s_ease-in-out_infinite\\],
            .animate-\\[glowShiftAlt_22s_ease-in-out_infinite\\],
            .animate-\\[gridDrift_30s_linear_infinite\\] {
              animation: none !important;
            }
          }
        `}</style>
        <div className="relative mx-auto max-w-5xl px-6 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-amber-300/80">
            Studio KFM
          </p>
          <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-semibold text-white">
            Crafting cinematic stories for your most treasured moments.
          </h1>
          <p className="mt-4 text-sm sm:text-base text-gray-300">
            Capture your special moments with our professional photography services. We
            specialize in creating memories that last a lifetime.
          </p>
          <div className="mt-6 flex justify-center">
            <Link
              to="/Portfolio"
              className="rounded-full border border-amber-300/60 bg-black/40 px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-amber-100 hover:bg-black/60"
            >
              Explore Our Services
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <br />
        <br />
        <BannerShowPage />
        <div className="container mx-auto px-4 py-12">
          <Packages />
          <br />
          <div ref={eventsRef}>
            <Events />
          </div>
        </div>
      </div>

      <Footer />

      {/* FULLSCREEN CINEMATIC VIDEO */}
      {showVideo && (
        <div
          className="fixed inset-0 z-[100] bg-black/90"
          role="dialog"
          aria-modal="true"
          onClick={() => setShowVideo(false)} // click outside controls to close
        >
          {/* Video layer (fills screen) */}
          <video
            ref={videoRef}
            src={introVideo}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted={isMuted}
            playsInline
            loop
            onClick={(e) => e.stopPropagation()} // prevent close when clicking video
          />

          {/* Decorative overlays */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/60" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 to-transparent" />
          {/* subtle brand watermark */}
          <div className="pointer-events-none absolute top-6 left-6 text-white/70 tracking-widest uppercase text-xs">
            Studio KFM
          </div>

          {/* Controls (clickable) */}
          <div
            className="absolute inset-0 flex items-end md:items-center justify-center md:justify-between px-6 pb-10 md:pb-0"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left CTA */}
            <div className="hidden md:block">
              <div className="backdrop-blur-sm bg-black/30 rounded-2xl p-5 shadow-2xl ring-1 ring-white/10">
                <h2 className="text-white text-2xl font-semibold">Studio KFM — Showreel</h2>
                <p className="text-white/80 mt-2 max-w-md">
                  A quick look at how we turn your moments into timeless stories.
                </p>
              </div>
            </div>

            {/* Center controls (for mobile & desktop) */}
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="px-4 py-2 rounded-full bg-white/90 hover:bg-white transition shadow-lg"
                aria-label={isPlaying ? 'Pause video' : 'Play video'}
              >
                {isPlaying ? 'Pause' : 'Play'}
              </button>
              <button
                onClick={toggleMute}
                className="px-4 py-2 rounded-full bg-white/80 hover:bg-white transition shadow-lg"
                aria-label={isMuted ? 'Unmute video' : 'Mute video'}
              >
                {isMuted ? 'Unmute' : 'Mute'}
              </button>
              <button
                onClick={() => setShowVideo(false)}
                className="px-4 py-2 rounded-full bg-amber-400 hover:bg-amber-500 text-black font-medium transition shadow-lg"
                aria-label="Close video"
              >
                Close
              </button>
            </div>
          </div>

          {/* Top-right close icon */}
          <button
            onClick={() => setShowVideo(false)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-black shadow-md grid place-items-center"
            aria-label="Close"
            title="Close"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default UserHomePage;
