import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import fallbackHero from "../assets/bghome.jpg";
import fallbackContact from "../assets/portfolio.jpg";
import kfm5 from "./Images/kfm5.jpg";
import kfm8 from "./Images/kfm8.jpg";
import kfm12 from "./Images/kfm12.jpg";
import kfm9 from "./Images/kfm9.jpg";
import kfm7 from "./Images/kfm7.jpg";
import kfm4 from "./Images/kfm4.jpg";
import kfmlogo from "./Images/kfmlogo.jpg";
import kfm from "./Images/kfm.webp"
import kfm14 from "./Images/founder.JPG";
import kfm6 from "./Images/kfm6.jpg";
import kfm2 from "./Images/kfm2.jpg";
import kfm16 from "./Images/kfm16.jpg";
import kfm18 from "./Images/kfm18.jpg";
import kfm19 from "./Images/kfm19.jpg";
import kfm15 from "./Images/kfm15.jpg";
import kfm11 from "./Images/kfm11.jpg";
import mem7437 from "../assets/memories/IMG_7437.JPG";
import mem7438 from "../assets/memories/IMG_7438.JPG";
import mem7439 from "../assets/memories/IMG_7439.JPG";
import mem7440 from "../assets/memories/IMG_7440.JPG";
import mem7441 from "../assets/memories/IMG_7441.JPG";
import mem7442 from "../assets/memories/IMG_7442.JPG";
import mem7443 from "../assets/memories/IMG_7443.JPG";
import mem7444 from "../assets/memories/IMG_7444.JPG";
import mem7445 from "../assets/memories/IMG_7445.JPG";
import mem7446 from "../assets/memories/IMG_7446.JPG";
import mem7447 from "../assets/memories/IMG_7447.JPG";
import mem7448 from "../assets/memories/IMG_7448.JPG";
import mem7449 from "../assets/memories/IMG_7449.JPG";
import mem7450 from "../assets/memories/IMG_7450.JPG";
import mem7451 from "../assets/memories/IMG_7451.JPG";
import mem7452 from "../assets/memories/IMG_7452.JPG";
import mem7453 from "../assets/memories/IMG_7453.JPG";
import mem7454 from "../assets/memories/IMG_7454.JPG";
import mem7455 from "../assets/memories/IMG_7455.JPG";
import mem7456 from "../assets/memories/IMG_7456.JPG";
import mem7458 from "../assets/memories/IMG_7458.JPG";
import editorTwo from "../assets/team/editor.jpg";
import editorOne from "../assets/team/editor (2).JPG";
import photographerOne from "../assets/team/Photographer (1).jpg";
import photographerThree from "../assets/team/Photographer (3).jpg";
import photographerFour from "../assets/team/Photographer (4).jpg";
import ceo from "../assets/team/ceo.jpg";
import camera from "../assets/team/lithuraj.jpg";
import camera2 from "../assets/team/Thiruvarangan.jpg";  
import camera3 from "../assets/team/ki.jpg"; 
import thishanth from "../assets/team/thishant.jpg";
import administrator1 from "../assets/team/kumar.jpg"; 
import Header from "../components/Header";





/**
 * Studio Photography Portfolio (Hero + cinematic scrolling)
 * - TailwindCSS expected
 * - Replace image URLs with your own work
 */

const work = [
  {
    title: "Noir Portraits",
    // meta: "35mm • Studio • 2025",
    src: kfm5,
  },
  {
    title: "Chrome & Silk",
    // meta: "Editorial • 2025",
    src: kfm8,
  },
  {
    title: "Quiet Light",
    // meta: "Still Life • 2024",
    src: kfm12,
  },
  {
    title: "Afterglow",
    // meta: "Fashion • 2025",
    src: kfm9,
  },
];

const memories = [
  { src: mem7437, label: "Memory 01", rotate: "-4deg", shiftX: "-6px", shiftY: "-6px" },
  { src: mem7438, label: "Memory 02", rotate: "3deg", shiftX: "10px", shiftY: "-4px" },
  { src: mem7439, label: "Memory 03", rotate: "-2deg", shiftX: "-12px", shiftY: "6px" },
  { src: mem7440, label: "Memory 04", rotate: "5deg", shiftX: "6px", shiftY: "10px" },
  { src: mem7441, label: "Memory 05", rotate: "-6deg", shiftX: "-8px", shiftY: "4px" },
  { src: mem7442, label: "Memory 06", rotate: "4deg", shiftX: "12px", shiftY: "-6px" },
  { src: mem7443, label: "Memory 07", rotate: "-3deg", shiftX: "-10px", shiftY: "8px" },
  { src: mem7444, label: "Memory 08", rotate: "2deg", shiftX: "6px", shiftY: "-4px" },
  { src: mem7445, label: "Memory 09", rotate: "-5deg", shiftX: "-6px", shiftY: "10px" },
  { src: mem7446, label: "Memory 10", rotate: "3deg", shiftX: "10px", shiftY: "6px" },
  { src: mem7447, label: "Memory 11", rotate: "-2deg", shiftX: "-12px", shiftY: "-2px" },
  { src: mem7448, label: "Memory 12", rotate: "6deg", shiftX: "8px", shiftY: "8px" },
  { src: mem7449, label: "Memory 13", rotate: "-4deg", shiftX: "-8px", shiftY: "10px" },
  { src: mem7450, label: "Memory 14", rotate: "2deg", shiftX: "6px", shiftY: "-6px" },
  { src: mem7451, label: "Memory 15", rotate: "-6deg", shiftX: "-10px", shiftY: "6px" },
  { src: mem7452, label: "Memory 16", rotate: "4deg", shiftX: "12px", shiftY: "10px" },
  { src: mem7453, label: "Memory 17", rotate: "-3deg", shiftX: "-6px", shiftY: "-6px" },
  { src: mem7454, label: "Memory 18", rotate: "5deg", shiftX: "10px", shiftY: "8px" },
  { src: mem7455, label: "Memory 19", rotate: "-2deg", shiftX: "-12px", shiftY: "4px" },
  { src: mem7456, label: "Memory 20", rotate: "3deg", shiftX: "6px", shiftY: "10px" },
  { src: mem7458, label: "Memory 21", rotate: "-5deg", shiftX: "-8px", shiftY: "-4px" },
 
];

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(!!mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);
  return reduced;
}

function useScrollProgress(ref) {
  const [p, setP] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onScroll = () => {
      const max = el.scrollHeight - el.clientHeight;
      const v = max <= 0 ? 0 : el.scrollTop / max;
      setP(Math.max(0, Math.min(1, v)));
    };

    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [ref]);
  return p;
}

function cn(...xs) {
  return xs.filter(Boolean).join(" ");
}

export default function Portfolio() {
  const prefersReduced = usePrefersReducedMotion();
  const scrollerRef = useRef(null);
  const progress = useScrollProgress(scrollerRef);
  const [bgIndex, setBgIndex] = useState(0);
  const [bgNext, setBgNext] = useState(null);
  const [isFading, setIsFading] = useState(false);

  const year = useMemo(() => new Date().getFullYear(), []);
  const bgImages = useMemo(() => [kfm7, kfm,kfm4], []);

  // A tiny cinematic “lens breathing” feel (disabled for reduced motion)
  useEffect(() => {
    if (prefersReduced) return;
    const root = scrollerRef.current;
    if (!root) return;

    let raf = 0;
    const tick = () => {
      const t = performance.now() * 0.001;
      root.style.setProperty("--breath", String(1 + Math.sin(t * 0.6) * 0.006));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [prefersReduced]);

  useEffect(() => {
    if (prefersReduced || bgImages.length === 0) return undefined;

    let timeoutId = 0;
    const intervalId = setInterval(() => {
      const next = (bgIndex + 1) % bgImages.length;
      setBgNext(next);
      setIsFading(true);
      timeoutId = window.setTimeout(() => {
        setBgIndex(next);
        setIsFading(false);
      }, 1200);
    }, 7000);

    return () => {
      clearInterval(intervalId);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [bgImages.length, bgIndex, prefersReduced]);

  return (
    <div
      className="portfolio-theme relative min-h-screen bg-black text-white"
    >
      <div className="absolute inset-0 z-0">
        <div
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[1200ms] ${
            isFading ? "opacity-0" : "opacity-100"
          }`}
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url(${bgImages[bgIndex]})`,
          }}
        />
        {bgNext !== null && (
          <div
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[1200ms] ${
              isFading ? "opacity-100" : "opacity-0"
            }`}
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url(${bgImages[bgNext]})`,
            }}
          />
        )}
      </div>

      <div className="relative z-10">
        <div className="fixed top-0 left-0 right-0 z-50">
          <Header />
        </div>
        {/* Top progress rail */}
        <div className="fixed left-0 mt-10 top-0 z-50 h-1 w-full bg-white/10">
          <div
            className="h-full bg-[#d4af37]"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>

      {/* Sticky micro-nav */}
      {/* <header className="fixed left-0 top-1 z-40 w-full">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">

            <span className="font-serif text-lg tracking-wide">STUDIO KFM</span>
          </div>

          <nav className="hidden items-center gap-5 text-sm text-white/70 md:flex">
            <a className="hover:text-[#d4af37]" href="#work">Work</a>
            <a className="hover:text-[#d4af37]" href="#services">Services</a>
            <a className="hover:text-[#d4af37]" href="#testimonials">Testimonials</a>
            <a className="hover:text-[#d4af37]" href="#contact">Contact</a>
          </nav>

          <a
            href="#contact"
            className="rounded-full border border-[#d4af37]/40 bg-black/40 px-4 py-2 text-sm text-[#f5f2ea] backdrop-blur-md hover:bg-black/60"
          >
            Book a Session
          </a>
        </div>
      </header> */}

      {/* Scroll container (cinematic journey) */}
      <main
        ref={scrollerRef}
        className={cn(
          "h-screen overflow-y-auto overscroll-contain",
          "[scrollbar-width:none] [-ms-overflow-style:none]",
          "scroll-smooth"
        )}
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <style>{`
          .blink-gold{
            animation: blinkGold 1.6s ease-in-out infinite;
          }
          @keyframes blinkGold{
            0%, 100% { box-shadow: 0 0 0 rgba(212,175,55,0); color: #f5f2ea; }
            50% { box-shadow: 0 0 18px rgba(212,175,55,0.6); color: #d4af37; }
          }
          .work-slideshow{
            position: relative;
            overflow: hidden;
          }
          .work-slideshow img{
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            opacity: 0;
            animation: slideFade 12s infinite;
          }
          .work-slideshow img:nth-child(1){ animation-delay: 0s; }
          .work-slideshow img:nth-child(2){ animation-delay: 4s; }
          .work-slideshow img:nth-child(3){ animation-delay: 8s; }
          @keyframes slideFade{
            0% { opacity: 0; }
            8% { opacity: 1; }
            30% { opacity: 1; }
            38% { opacity: 0; }
            100% { opacity: 0; }
          }
          .memory-album{
            background:
              linear-gradient(90deg, rgba(0,0,0,0.35), rgba(0,0,0,0) 20%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0) 80%, rgba(0,0,0,0.35)),
              linear-gradient(180deg, #8a5d3b 0%, #7b5132 100%);
            border-radius: 2rem;
            box-shadow: 0 30px 70px rgba(0,0,0,0.45);
          }
          .album-spread{
            display: grid;
            gap: 1.5rem;
          }
          @media (min-width: 900px){
            .album-spread{ grid-template-columns: repeat(2, minmax(0, 1fr)); }
          }
          .album-page{
            position: relative;
            border-radius: 1.5rem;
            padding: 1.5rem;
            background:
              linear-gradient(140deg, rgba(255,255,255,0.08), rgba(255,255,255,0) 35%),
              #d0a56a;
            box-shadow: inset 0 0 0 8px #7a512f, inset 0 0 0 12px #5a3a22;
          }
          .album-cork{
            position: relative;
            border-radius: 1rem;
            padding: 1.5rem;
            min-height: 320px;
            background-image:
              radial-gradient(circle at 20% 20%, rgba(255,255,255,0.18), transparent 28%),
              radial-gradient(circle at 80% 10%, rgba(0,0,0,0.14), transparent 30%),
              repeating-linear-gradient(0deg, rgba(0,0,0,0.08), rgba(0,0,0,0.08) 1px, transparent 1px, transparent 6px),
              repeating-linear-gradient(90deg, rgba(255,255,255,0.08), rgba(255,255,255,0.08) 1px, transparent 1px, transparent 8px);
            background-color: #a4784d;
          }
          .album-grid{
            display: grid;
            gap: 0.9rem;
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .album-photo{
            position: relative;
            background: #f7f2ea;
            padding: 0.5rem;
            border-radius: 0.9rem;
            box-shadow: 0 12px 26px rgba(0,0,0,0.3);
            cursor: pointer;
          }
          .album-photo img{
            display: block;
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 0.7rem;
            filter: saturate(0.92) contrast(1.05);
          }
          .album-pin{
            position: absolute;
            top: -6px;
            left: 50%;
            transform: translateX(-50%);
            height: 12px;
            width: 12px;
            border-radius: 999px;
            background: #d4af37;
            box-shadow: 0 4px 10px rgba(0,0,0,0.35);
          }
          .album-controls{
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
            margin-bottom: 1rem;
            font-size: 10px;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            color: rgba(255,255,255,0.8);
          }
          @media (min-width: 640px){
            .memory-board{ grid-template-columns: repeat(3, minmax(0, 1fr)); }
          }
          @media (min-width: 1024px){
            .memory-board{ grid-template-columns: repeat(4, minmax(0, 1fr)); }
          }
          @media (prefers-reduced-motion: reduce){
            .blink-gold{ animation: none; }
            .work-slideshow img{ animation: none; opacity: 1; position: static; }
          }
        `}</style>
        {/* <style>{`
          main::-webkit-scrollbar{display:none;}
          :root{ --breath: 1; }
          .gridlines{
            background-image:
              linear-gradient(to right, rgba(212,175,55,.18) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(212,175,55,.18) 1px, transparent 1px);
            background-size: 88px 88px;
          }
          .hairline{
            box-shadow: none;
            border: 1px solid rgba(255,255,255,.08);
          }
          .filmgrain{
            background-image: url('data:image/svg+xml;utf8,\
              <svg xmlns="http://www.w3.org/2000/svg" width="180" height="180">\
                <filter id="n">\
                  <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>\
                  <feColorMatrix type="saturate" values="0"/>\
                </filter>\
                <rect width="100%" height="100%" filter="url(%23n)" opacity="0.12"/>\
              </svg>');
            mix-blend-mode: soft-light;
            pointer-events: none;
          }
          .snapY{ scroll-snap-type: y mandatory; }
          .snapStart{ scroll-snap-align: start; }
          .breath{ transform: scale(var(--breath)); }
          .portfolio-theme .text-zinc-900{ color: #f5f2ea; }
          .portfolio-theme .text-zinc-700{ color: rgba(229,231,235,.82); }
          .portfolio-theme .text-zinc-600{ color: rgba(209,213,219,.72); }
          .portfolio-theme .bg-zinc-900{ background-color: #0b0b0b; }
          .portfolio-theme .bg-zinc-900\/5{ background-color: transparent; }
          .portfolio-theme .bg-zinc-900\/10{ background-color: transparent; }
          .portfolio-theme .bg-zinc-900\/40{ background-color: rgba(0,0,0,.6); }
          .portfolio-theme .bg-white\/70{ background-color: rgba(212,175,55,.18); }
          .portfolio-theme .bg-white\/55{ background-color: transparent; }
          .portfolio-theme .bg-white\/40{ background-color: transparent; }
          .portfolio-theme .bg-white{ background-color: #121212; }
          .portfolio-theme .border-zinc-900\/20{ border-color: rgba(255,255,255,.12); }
          .portfolio-theme .border-zinc-900\/15{ border-color: rgba(255,255,255,.1); }
          .portfolio-theme .border-zinc-900\/10{ border-color: rgba(255,255,255,.08); }
          .portfolio-theme .backdrop-blur-md,
          .portfolio-theme .backdrop-blur-sm{ backdrop-filter: none; }
          @media (prefers-reduced-motion: reduce){
            .snapY{ scroll-snap-type: none; }
          }
        `}</style> */}

        {/* HERO */}
        

        <div className="space-y-0">
        {/* WORK / FILMSTRIP */}
        {/* <section id="work" className="snapStart relative min-h-[100svh] pt-20">
          <div className="absolute inset-0 gridlines" />
          <div className="relative mx-auto max-w-6xl px-4 pb-16">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-4">
                <div className="rounded-3xl bg-white/40 p-5 backdrop-blur-md hairline">
                  <p className="text-xs uppercase tracking-[0.18em] text-black">Gallery</p>
                  <h2 className="mt-3 font-serif text-4xl leading-[1.05]">A cinematic journey</h2>
                  <p className="mt-4 text-sm leading-relaxed text-zinc-700">
                    Scroll sideways like a contact sheet. Each frame is a chapter—light, texture,
                    restraint.
                  </p>
                  <div className="mt-6 flex items-center gap-2 text-xs text-white/80">
                    <span className="rounded-full bg-black/70 px-3 py-2 border border-white/10">
                      Portrait
                    </span>
                    <span className="rounded-full bg-black/70 px-3 py-2 border border-white/10">
                      Editorial
                    </span>
                    <span className="rounded-full bg-black/70 px-3 py-2 border border-white/10">
                      Product
                    </span>
                  </div>
                  <Link
                    to="/login"
                    className="mt-6 inline-flex w-fit items-center justify-center rounded-full border border-[#d4af37]/60 bg-black px-5 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#f5f2ea] hover:bg-black/60 blink-gold"
                  >
                    Explore More
                  </Link>
                </div>
              </div>

              {/* <div className="col-span-12 md:col-span-8">
                <div
                  className={cn(
                    "relative overflow-hidden rounded-[2rem] bg-white/40 backdrop-blur-md hairline",
                    "p-4"
                  )}
                >
                  {/* <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.18em] text-black">Gallery sheet</p>
                    <p className="text-xs text-black">Drag • Swipe • Scroll</p>
                  </div> */}
{/* 
                  <Filmstrip items={work} />
                </div>

              </div> */} 
            {/* </div>
          </div>
        </section>  */}

        {/* MEMORIES */}
        <section id="memories" className="snapStart relative min-h-[100svh] pt-20">
          <div className="absolute inset-0 gridlines" />
          <div className="absolute inset-0 filmgrain" />

          <div className="relative mx-auto max-w-6xl px-4 pb-16">
            <div className="mt-6 rounded-3xl bg-white/40 p-5 backdrop-blur-md hairline">
              {/* <p className="text-xs uppercase tracking-[0.18em] text-black">Testimonial</p> */}
              <p className="mt-3 font-serif text-2xl leading-tight text-zinc-900">
                Founded with a passion for authentic storytelling, Studio KFM began as a vision to
                capture life's unscripted beauty. What started with a single camera has grown into
                a celebrated studio specializing in weddings, portraits, and editorial work.
              </p>
              <p className="mt-4 text-xs uppercase tracking-[0.18em] text-black">Our Studio Story</p>
              <div className="mt-6 h-px w-full bg-black/10" />
              <p className="text-xs uppercase tracking-[0.18em] text-black">Old Memories</p>
              <h2 className="mt-3 font-serif text-4xl leading-[1.05]">A scrapbook of our earliest frames.</h2>
              <p className="mt-4 text-sm leading-relaxed text-zinc-700">
                Every photo is pinned like a keepsake. Scroll through a layered collage that feels
                like a studio wall of prints.
              </p>
            </div>

            <MemoryWall items={memories} />
          </div>
        </section>

        {/* SERVICES */}
        {/* <section id="services" className="snapStart relative min-h-[100svh] pt-20">
          <div className="absolute inset-0 gridlines" />
          <div className="relative mx-auto max-w-6xl px-4 pb-16">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12   md:col-span-5">
             
                {/* <div className="mt-5 rounded-3xl bg-white/40 p-5 backdrop-blur-md hairline">
                  <p className="text-xs uppercase tracking-[0.18em] text-zinc-600">Our Works</p>
                  <h2 className="mt-3 font-serif text-4xl leading-[1.05]">Signature Shoots</h2>
                </div> */}
                {/* <div className="mt-0 rounded-3xl bg-white/40 p-5 backdrop-blur-md hairline">
                  <h2 className="mt-3 font-serif text-3xl leading-[1.05]">Wedding Shoot</h2>
                  <div className="mt-4 aspect-[4/3] overflow-hidden rounded-2xl">
                    <div className="work-slideshow h-full w-full">
                      <img src={kfm2} alt="Wedding shoot 1" loading="lazy" />
                      <img src={kfm7} alt="Wedding shoot 2" loading="lazy" />
                      <img src={kfm19} alt="Wedding shoot 3" loading="lazy" />
                    </div>
                  </div>
                </div> */}
                {/* <div className="mt-5  rounded-3xl bg-white/40 p-5 backdrop-blur-md hairline">
                  <h2 className="mt-3 font-serif text-3xl leading-[1.05]">Birthday Shoot</h2>
                  <div className="mt-4 aspect-[4/3] overflow-hidden rounded-2xl">
                    <div className="work-slideshow h-full w-full">
                      <img src={kfm15} alt="Birthday shoot 1" loading="lazy" />
                      <img src={kfm9} alt="Birthday shoot 2" loading="lazy" />
                      <img src={kfm4} alt="Birthday shoot 3" loading="lazy" />
                    </div>
                  </div>
                </div> */}
              </div>

              {/* <div className="col-span-12 md:col-span-7">
                <div className="grid gap-4 md:grid-cols-2 auto-rows-fr">
                  <ServiceCard
                    index="01"
                    title="Wedding"
                    image={kfm2}
                    chips={["Photography", "Videography", "Album", "Highlights"]}
                  />
                  <ServiceCard
                    index="02"
                    title="Birthday"
                    image={kfm6}
                    chips={["Candid", "Family", "Decor", "Story Reel"]}
                  />
                  <ServiceCard
                    index="03"
                    title="Puberty"
                    image={kfm18}
                    chips={["Traditional", "Outdoor", "Portraits", "Album"]}
                  />
                                    <ServiceCard
                    index="03"
                    title="shots"
                    image={kfm8}
                    chips={["Traditional", "Outdoor", "Portraits", "Album"]}
                  />
                </div>
              </div> */}
            {/* </div>
          </div>
        </section> */} 
        {/* </div> */}

        {/* TESTIMONIALS */}
        <section id="testimonials" className="snapStart relative min-h-[100svh] pt-20">
          <div className="absolute inset-0 gridlines" />
          <div className="relative mx-auto max-w-6xl px-4 pb-16">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-4">
                <div className="rounded-3xl bg-white/40 p-5 backdrop-blur-md hairline">
                  <h2 className="mt-3 font-serif text-4xl leading-[1.05]">Everything is perfect.</h2>
                  <p className="mt-4 text-sm leading-relaxed text-zinc-700">
                    From low‑light shots to high‑speed action, this gear never lets me down.
                  </p>
                </div>
                <div className="mt-4 overflow-hidden rounded-3xl hairline">
                  <div className="relative aspect-[4/5] w-full">
                    <img
                      src={kfm14}
                      alt="Founder"
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-white/70">Founder – KFM Studio</p>
                      <p className="mt-1 font-serif text-xl text-white">Dilojan</p>
                      <p className="mt-2 text-xs text-white/70">
                        “Visionary founder of KFM Studio, responsible for establishing the brand and laying the creative and operational foundation of the studio.”
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-12 md:col-span-8">
                {/* <TestimonialCard
                  quote="Founded with a passion for authentic storytelling, Studio KFM began as a vision to capture life's unscripted beauty. What started with a single camera has grown into a celebrated studio specializing in weddings, portraits, and editorial work."
                  title="Our Studio Story"
                /> */}

                <div className="mt-6 rounded-3xl bg-white/40 p-5 backdrop-blur-md hairline">
                  <p className="text-xs uppercase tracking-[0.18em] text-black">Our Team</p>
                  <h3 className="mt-3 font-serif text-3xl">Meet the crew</h3>
                  <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {[
                      { role: "CEO", name: "Niluxshana Dilojan", image: ceo },
                      { role: "Managing Director & Cameraman & Editor", name: "Yathushan Vijayaretnam", image: editorOne },
                      { role: "Cameraman", name: "Kirush Raj", image: camera3 },
                      { role: "Cameraman", name: "Lithuraj", image: camera },
                      { role: "Cameraman", name: "Thiruvarangan", image: camera2 },
                      { role: "Cameraman, Editor & Technician", name: "Visvalingam Kapileshan", image: photographerThree },
                      { role: "Editor & Technician", name: "Thanusheegan", image: editorTwo },
                      { role: "Cameraman & Editor", name: "Thishanth", image: thishanth },
                      { role: "Administrative Assistant", name: "Sanojan", image: photographerFour },
                       { role: "Administrative Assistant", name: "Kumaran", image: administrator1 },
                      { role: "Administrative Assistant", name: "Rakesh", image: photographerOne },
                    ].map((member) => (
                      <div
                        key={`${member.role}-${member.name}`}
                        className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/60 p-4"
                      >
                        <div className="shrink-0 overflow-hidden rounded-xl">
                          <img
                            src={member.image}
                            alt={`${member.role} ${member.name}`}
                            className="h-20 w-20 object-cover object-top"
                            loading="lazy"
                          />
                        </div>
                      <div className="min-w-0">
                        <p className="text-[10px] leading-tight uppercase tracking-[0.12em] text-white/70 break-words sm:text-xs">
                          {member.role}
                        </p>
                          <p className="mt-1 text-sm text-white/90">{member.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 rounded-3xl bg-white/40 p-5 backdrop-blur-md hairline">
                  <p className="text-xs uppercase tracking-[0.18em text-black">Why Choose Us</p>
                  <h3 className="mt-3 font-serif text-3xl">Our cinematic journey</h3>
                  <div className="mt-8 grid gap-4 md:grid-cols-2">
                    {[
                      { title: "Cinematic Reel 01", id: "owTq_baw_mM" },
                      { title: "Cinematic Reel 02", id: "_jZ9Sh6sNPk" },
                      { title: "Cinematic Reel 03", id: "VTIxB5XKToQ" },
                      { title: "Cinematic Reel 04", id: "QV9JVFfQHSY" },
                      { title: "Cinematic Reel 05", id: "Oty-PgDc7Fo" },
                    ].map((item) => (
                      <div
                        key={item.id}
                        className="overflow-hidden rounded-2xl border border-white/10 bg-black/60"
                      >
                        <div className="aspect-video w-full">
                          <iframe
                            className="h-full w-full"
                            src={`https://www.youtube-nocookie.com/embed/${item.id}?rel=0`}
                            title={item.title}
                            loading="lazy"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                          />
                        </div>
                        <p className="px-4 py-3 text-xs uppercase tracking-[0.18em] text-white/70">
                          {item.title}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="snapStart relative min-h-[100svh] pt-20">
          <div className="absolute inset-0 gridlines" />
          <div className="absolute inset-0 filmgrain" />

          <div className="relative mx-auto max-w-6xl px-4 pb-20">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-6">
                <div className="overflow-hidden rounded-[2rem] hairline">
                  <div className="relative aspect-[16/11]">
                    <img
                      className="h-full w-full object-cover"
                      alt="Contact hero"
                      src={kfm}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = fallbackContact;
                      }}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-white/70">Make a booking</p>
                      <h3 className="mt-2 font-serif text-3xl text-white">Start your journey</h3>
                      <p className="mt-2 text-sm text-white/80">
                        Reach us directly and we will curate your cinematic story.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-12 md:col-span-6">
                <div className="rounded-3xl bg-white/40 p-6 backdrop-blur-md hairline">
                  <p className="text-xs uppercase tracking-[0.18em] text-black">Contact Options</p>
                  <h2 className="mt-3 font-serif text-4xl leading-[1.05]">Let’s begin.</h2>
                  <p className="mt-3 text-sm text-zinc-700">
                    Choose a direct channel and our team will respond with the next steps.
                  </p>

                  <div className="mt-6 grid gap-3">
                    <a
                      href="mailto:hello@nagans.studio"
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/60 px-4 py-4 text-sm text-white/80 hover:bg-black/70"
                    >
                      <span>Email</span>
                      <span className="text-[#d4af37]">kishafilmmakers.lmt@gmail.com</span>
                    </a>
                    <a
                      href="https://wa.me/94770000000"
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/60 px-4 py-4 text-sm text-white/80 hover:bg-black/70"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span>WhatsApp</span>
                      <span className="text-[#d4af37]">078 510 1018</span>
                    </a>
                    <a
                      href="mailto:bookings@nagans.studio"
                      className="flex items-center justify-between rounded-2xl border border-[#d4af37]/40 bg-black/70 px-4 py-4 text-sm text-white/80 hover:bg-black/80"
                    >
                      <span>Hotline</span>
                      <span className="text-[#d4af37]">078 510 1018</span>
                    </a>
                  </div>

                  <div className="mt-6 flex items-center justify-between text-xs text-black">
                    <span>Response in 24h</span>
                    <span>© {year} Studio KFM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <section className="snapStart relative py-16">
          <div className="absolute inset-0 gridlines" />
          <div className="relative mx-auto max-w-6xl px-4">
            <div className="grid items-center gap-6 rounded-[2.5rem] border border-white/10 bg-black/70 p-8 md:grid-cols-[1.4fr,0.6fr]">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-white/70">Book</p>
                <h3 className="mt-3 font-serif text-3xl text-white">
                  Capture your special moments with our professional photography services.
                </h3>
                <p className="mt-3 text-sm text-white/80">
                  We specialize in creating memories that last a lifetime.
                </p>
                <Link
                  to="/login"
                  className="mt-6 inline-flex items-center justify-center rounded-full border border-[#d4af37]/60 bg-black/40 px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#f5f2ea] hover:bg-black/60 blink-gold"
                >
Make Booking                </Link>
              </div>
              <div className="relative overflow-hidden rounded-3xl border border-white/10">
                <img
                  src={kfmlogo}
                  alt="Book a session"
                  className="h-48 w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="rounded-full border border-[#d4af37]/60 bg-black/70 px-3 py-2 text-[11px] uppercase tracking-[0.3em] text-[#d4af37]">
                    Studio KFM
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
        </section>

        {/* CTA */}
    

        {/* Bottom spacer */}
        <div className="h-10" />
      </main>
      </div>
    </div>
  );
}

function MemoryWall({ items }) {
  const [active, setActive] = useState(null);
  const [page, setPage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 899px)");
    const onChange = () => setIsMobile(!!mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  const pageSize = isMobile ? 6 : 8;
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const pagedItems = items.slice(page * pageSize, page * pageSize + pageSize);
  const leftItems = isMobile ? pagedItems : pagedItems.slice(0, 4);
  const rightItems = isMobile ? [] : pagedItems.slice(4, 8);

  useEffect(() => {
    if (page >= totalPages) {
      setPage(0);
    }
  }, [page, totalPages]);

  return (
    <div className="memory-album mt-8 border border-white/10 p-5 md:p-8">
      <div className="album-controls">
        <span>Album Page {page + 1} of {totalPages}</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-full border border-white/20 bg-black/60 px-3 py-2 text-[10px] text-white/80 hover:bg-black/80"
            onClick={() => setPage((p) => (p - 1 + totalPages) % totalPages)}
          >
            Prev Page
          </button>
          <button
            type="button"
            className="rounded-full border border-white/20 bg-black/60 px-3 py-2 text-[10px] text-white/80 hover:bg-black/80"
            onClick={() => setPage((p) => (p + 1) % totalPages)}
          >
            Next Page
          </button>
        </div>
      </div>
      <div className="album-spread">
        <div className="album-page">
          <div className="album-cork">
            <div className="album-grid">
              {leftItems.map((item, idx) => (
                <button
                  type="button"
                  key={`${item.label}-left-${idx}`}
                  className="album-photo"
                  style={{
                    transform: `rotate(${item.rotate}) translate(${item.shiftX}, ${item.shiftY})`,
                  }}
                  onClick={() => setActive((prev) => (prev?.src === item.src ? null : item))}
                  aria-label={`Toggle ${item.label}`}
                >
                  <span className="album-pin" />
                  <img src={item.src} alt={item.label} loading="lazy" />
                </button>
              ))}
            </div>
          </div>
        </div>
        {!isMobile && (
          <div className="album-page">
            <div className="album-cork">
              <div className="album-grid">
                {rightItems.map((item, idx) => (
                  <button
                    type="button"
                    key={`${item.label}-right-${idx}`}
                    className="album-photo"
                    style={{
                      transform: `rotate(${item.rotate}) translate(${item.shiftX}, ${item.shiftY})`,
                    }}
                    onClick={() => setActive((prev) => (prev?.src === item.src ? null : item))}
                    aria-label={`Toggle ${item.label}`}
                  >
                    <span className="album-pin" />
                    <img src={item.src} alt={item.label} loading="lazy" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-6"
          onClick={() => setActive(null)}
          role="button"
          tabIndex={0}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={active.src}
              alt={active.label}
              className="h-full w-full object-contain"
            />
            <button
              type="button"
              className="absolute right-4 top-4 rounded-full border border-white/20 bg-black/70 px-3 py-2 text-xs uppercase tracking-[0.2em] text-white"
              onClick={() => setActive(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Filmstrip({ items }) {
  const ref = useRef(null);
  const prefersReduced = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReduced) return undefined;
    const el = ref.current;
    if (!el) return undefined;

    const tick = () => {
      const card = el.querySelector("figure");
      if (!card) return;
      const step = card.getBoundingClientRect().width + 16;
      const next = el.scrollLeft + step;
      const max = el.scrollWidth - el.clientWidth;
      el.scrollTo({ left: next >= max ? 0 : next, behavior: "smooth" });
    };

    const id = setInterval(tick, 3500);
    return () => clearInterval(id);
  }, [prefersReduced]);

  // Drag-to-scroll (mouse)
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let isDown = false;
    let startX = 0;
    let startLeft = 0;

    const down = (e) => {
      isDown = true;
      startX = e.pageX;
      startLeft = el.scrollLeft;
      el.classList.add("cursor-grabbing");
    };
    const up = () => {
      isDown = false;
      el.classList.remove("cursor-grabbing");
    };
    const move = (e) => {
      if (!isDown) return;
      const dx = e.pageX - startX;
      el.scrollLeft = startLeft - dx;
    };

    el.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    window.addEventListener("mousemove", move);
    return () => {
      el.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("mousemove", move);
    };
  }, []);

  return (
    <div className="mt-4">
      <div
        ref={ref}
        className={cn(
          "relative flex gap-4 overflow-x-auto pb-2",
          "cursor-grab select-none",
          "[scrollbar-width:none] [-ms-overflow-style:none]",
          prefersReduced ? "" : "scroll-smooth"
        )}
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <style>{`div::-webkit-scrollbar{display:none;}`}</style>

        {items.map((it, idx) => (
          <figure
            key={it.title}
            className={cn(
              "group relative shrink-0 overflow-hidden rounded-[1.6rem] bg-zinc-900/5 hairline",
              "w-[78vw] sm:w-[52vw] md:w-[34vw]"
            )}
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <img
                alt={it.title}
                src={it.src}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = fallbackHero;
                }}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-900/45 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
                <div>
                  <p className="font-serif text-2xl text-white">{it.title}</p>
                  <p className="mt-1 text-xs text-white/80">{it.meta}</p>
                </div>
                <div className="rounded-full bg-white/70 px-3 py-2 text-xs backdrop-blur hairline">
                  {String(idx + 1).padStart(2, "0")}
                </div>
              </div>
            </div>
          </figure>
        ))}
      </div>

      <p className="mt-2 text-xs text-black">
        Tip: On mobile, swipe the filmstrip. On desktop, drag to scrub like a reel.
      </p>
    </div>
  );
}

function ServiceCard({ index, title, image, chips }) {
  return (
    <div className="flex h-full flex-col rounded-3xl bg-white/40 p-5 backdrop-blur-md hairline">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-black">{index}</p>
          <p className="mt-2 font-serif text-3xl leading-tight">{title}</p>
        </div>
      </div>
      <div className="mt-4 aspect-[4/3] overflow-hidden rounded-2xl">
        <img
          src={image}
          alt={`${title} service`}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {chips.map((c) => (
          <span
            key={c}
            className="rounded-full border border-zinc-900/10 bg-white/70 px-3 py-2 text-xs text-zinc-700"
          >
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}

function TestimonialCard({ quote, name, title }) {
  return (
    <div className="rounded-3xl bg-white/40 p-5 backdrop-blur-md hairline">
      <div className="flex items-start justify-between">
        <p className="text-xs uppercase tracking-[0.18em] text-black">“</p>
        <span className="rounded-full bg-white/70 px-3 py-2 text-xs backdrop-blur hairline">Testimonial</span>
      </div>
      <p className="mt-3 font-serif text-2xl leading-tight text-zinc-900">{quote}</p>
      <div className="mt-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-900">{name}</p>
          <p className="text-xs text-black">{title}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-zinc-900/35" />
          <span className="h-2 w-2 rounded-full bg-zinc-900/20" />
          <span className="h-2 w-2 rounded-full bg-zinc-900/10" />
        </div>
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-[0.18em] text-black">{label}</label>
      <input
        {...props}
        className="mt-2 w-full rounded-2xl border border-zinc-900/15 bg-white/70 px-4 py-3 text-sm outline-none placeholder:text-zinc-500 focus:border-zinc-900/30"
      />
    </div>
  );
}
