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
import kfm14 from "./Images/kfm14.jpg";
import kfm6 from "./Images/kfm6.jpg";
import kfm2 from "./Images/kfm2.jpg";
import kfm16 from "./Images/kfm16.jpg";
import kfm18 from "./Images/kfm18.jpg";
import kfm19 from "./Images/kfm19.jpg";
import kfm15 from "./Images/kfm15.jpg";
import kfm11 from "./Images/kfm11.jpg";
import Header from "../Components/Header";





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

  const year = useMemo(() => new Date().getFullYear(), []);

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

  return (
    <div
      className="portfolio-theme min-h-screen bg-black text-white"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url(${kfm7})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
       <div className="fixed top-0 left-0 right-0 z-50">
        <Header />
      </div>
      {/* Top progress rail */}
      <div className="fixed left-0 top-0 z-50 h-1 w-full bg-white/10">
        <div
          className="h-full bg-[#d4af37]"
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </div>

      {/* Sticky micro-nav */}
      {/* <header className="fixed left-0 top-1 z-40 w-full">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">

            <span className="font-sans text-lg tracking-wide">STUDIO KFM</span>
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
        <section className="snapStart relative min-h-[100svh] pt-20">
          <div className="absolute inset-0 gridlines" />
          <div className="absolute inset-0 filmgrain" />

          {/* Iridescence layer removed (missing component) */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.14]" />

          <div className="relative mx-auto grid max-w-6xl grid-cols-12 gap-4 px-4 pb-10">
            {/* Left column */}
            <div className="col-span-12 md:col-span-5">
              <div className="mt-6 rounded-3xl bg-white/40 p-5 backdrop-blur-md hairline">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-black">
                      Kalmunai, Srilanka
                    </p>
                    <h1 className="mt-3 font-sans text-4xl leading-[1.05] md:text-5xl">
                      Capture your moment
                      <span className="block">through our scope.</span>
                    </h1>
                  </div>
                  <div className="hidden md:block">

                  </div>
                </div>

                <p className="mt-4 max-w-prose text-sm leading-relaxed text-zinc-700">
                  A studio portfolio built like a cinematic sequence—quiet grids, large typography,
                  and deliberate motion. Portrait, editorial, and product work with clarity and
                  texture.
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <a
                    href="#work"
                    className="rounded-full border border-[#d4af37]/60 bg-black px-5 py-3 text-sm text-[#f5f2ea] hover:bg-black/60 blink-gold"
                  >
                    View Gallery
                  </a>
                  <a
                    href="#services"
                    className="rounded-full border border-[#d4af37]/60 bg-black px-5 py-3 text-sm text-[#f5f2ea] hover:bg-black/60 blink-gold"
                  >
                    Services
                  </a>

                </div>
              </div>

              {/* Micro-cards */}
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-3xl bg-white/40 p-5 backdrop-blur-md hairline md:col-span-2">
                  <p className="text-xs uppercase tracking-[0.18em] text-black">Services</p>
                  <h2 className="mt-3 font-sans text-4xl leading-[1.05]">Studio packages</h2>
                  <p className="mt-4 text-sm leading-relaxed text-zinc-700">
                    Designed for pace and intention. We’ll build a shot list, set design, and light
                    plan—then shoot like a sequence.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    {["Silver", "Gold", "Platinum"].map((tier) => (
                      <span
                        key={tier}
                        className={`rounded-full px-5 py-2 text-xs uppercase tracking-[0.3em] ${
                          tier === "Gold"
                            ? "border border-[#d4af37]/60 bg-black/70 text-[#d4af37]"
                            : "border border-white/10 bg-black/60 text-white/70"
                        }`}
                      >
                        {tier}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="rounded-3xl bg-white/40 p-4 backdrop-blur-md hairline">
                  <p className="text-xs uppercase tracking-[0.18em] text-black">Process</p>
                  <p className="mt-2 text-sm text-zinc-700">
                    Moodboard → Light plan → Shoot → Grade.
                  </p>
                </div>
                <div className="rounded-3xl bg-white/40 p-4 backdrop-blur-md hairline">
                  <p className="text-xs uppercase tracking-[0.18em] text-black">Delivery</p>
                  <p className="mt-2 text-sm text-zinc-700">
                    48–72h preview. Full set in 7–10 days.
                  </p>
                </div>
              </div>
            </div>

            {/* Center / Hero visual */}
            <div className="col-span-12 md:col-span-7">
              <div className="relative mt-6 overflow-hidden rounded-[2rem] bg-zinc-900/5 hairline">
                {/* Giant typographic layer */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="breath select-none font-sans text-[22vw] leading-none text-zinc-900/10 md:text-[14vw]">
                    SCOPE
                  </div>
                </div>

                {/* Main image */}
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <img
                    className="h-full w-full object-cover opacity-[0.96]"
                    alt="Hero work"
                    src={kfm4}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = fallbackHero;
                    }}
                  />

                  {/* Floating badges */}
                  <div className="absolute left-4 top-4 flex items-center gap-2">
                    <span className="rounded-full border border-[#d4af37]/60 bg-black px-3 py-2 text-xs text-[#f5f2ea] hover:bg-black/60 blink-gold ">
                      Advanced video capabilities
                    </span>
                    <span className="rounded-full border border-[#d4af37]/60 bg-black px-3 py-2 text-xs text-[#f5f2ea] hover:bg-black/60 blink-gold" >
                      Ultra‑HD clarity
                    </span>
                  </div>

                  <div className="absolute bottom-4 right-4 flex items-center gap-2">

                  </div>                 
                </div>

                {/* Footer strip */}
                <div className="grid grid-cols-12 gap-3 border-t border-zinc-900/10 bg-white/70 px-4 py-3 backdrop-blur">

                  <div className="col-span-12 flex items-center justify-between md:col-span-5">
                   
                    <div className="flex items-center gap-2">
                      <a
                        className="rounded-full bg-white/70 px-3 py-2 text-xs text-black hairline hover:bg-white"
                        href="@StudioKFM"
                        aria-label="Instagram"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <svg
                          xmlns="https://www.instagram.com/studio.kfm?igsh=bGp1Zmhkdmw4ZHh2"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                        >
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                          <path d="M16 11.37a4 4 0 1 1-7.999 1.26A4 4 0 0 1 16 11.37z" />
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                        </svg>
                      </a>
                      <a
                        className="rounded-full bg-white/70 px-3 py-2 text-xs text-black hairline hover:bg-white"
                        href="https://www.facebook.com/KFMKALMUNAI"
                        aria-label="Facebook"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                        >
                          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                        </svg>
                      </a>
                      <a
                        className="rounded-full bg-white/70 px-3 py-2 text-xs text-black hairline hover:bg-white"
                        href="tel:+94770000000"
                        aria-label="Call"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                        >
                          <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.8.3 1.6.6 2.4a2 2 0 0 1-.5 2.1L8 9a16 16 0 0 0 7 7l.8-1.2a2 2 0 0 1 2.1-.5c.8.3 1.6.5 2.4.6a2 2 0 0 1 1.7 2.1z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tiny “index” / stats row */}
              <div className="mt-4 grid grid-cols-12 gap-4">
                <div className="col-span-12 overflow-hidden rounded-3xl hairline md:col-span-6">
                  <div className="relative aspect-[4/3] w-full">
                    <img
                      src={kfm12}
                      alt="Core editorial"
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="mt-2 font-sans text-2xl leading-tight text-white">
                        High‑performance portraits, editorial, and product—
                        <span className="text-white/70">for every level.</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-span-12 overflow-hidden rounded-3xl hairline md:col-span-6">
                  <div className="relative aspect-[4/3] w-full">
                    <img
                      src={kfm11}
                      alt="Community moments"
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-baseline justify-between text-white">
                        <p className="text-xs uppercase tracking-[0.18em] text-white/70">Community</p>
                      </div>
                      <p className="mt-2 text-sm text-white/80">
                        Clients, collaborators, and creatives who trust the process.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Down hint */}
              <div className="mt-8 flex items-center gap-3 text-xs text-black">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/60 backdrop-blur hairline">
                  ↓
                </span>
                <span>Scroll for the filmstrip.</span>
              </div>
            </div>
          </div>
        </section>

        <div className="space-y-0">
        {/* WORK / FILMSTRIP */}
        <section id="work" className="snapStart relative min-h-[100svh] pt-20">
          <div className="absolute inset-0 gridlines" />
          <div className="relative mx-auto max-w-6xl px-4 pb-16">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-4">
                <div className="rounded-3xl bg-white/40 p-5 backdrop-blur-md hairline">
                  <p className="text-xs uppercase tracking-[0.18em] text-black">Gallery</p>
                  <h2 className="mt-3 font-sans text-4xl leading-[1.05]">A cinematic journey</h2>
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

              <div className="col-span-12 md:col-span-8">
                <div
                  className={cn(
                    "relative overflow-hidden rounded-[2rem] bg-white/40 backdrop-blur-md hairline",
                    "p-4"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.18em] text-black">Gallery sheet</p>
                    <p className="text-xs text-black">Drag • Swipe • Scroll</p>
                  </div>

                  <Filmstrip items={work} />
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section id="services" className="snapStart relative min-h-[100svh] pt-20">
          <div className="absolute inset-0 gridlines" />
          <div className="relative mx-auto max-w-6xl px-4 pb-16">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12   md:col-span-5">
             
                {/* <div className="mt-5 rounded-3xl bg-white/40 p-5 backdrop-blur-md hairline">
                  <p className="text-xs uppercase tracking-[0.18em] text-zinc-600">Our Works</p>
                  <h2 className="mt-3 font-sans text-4xl leading-[1.05]">Signature Shoots</h2>
                </div> */}
                <div className="mt-0 rounded-3xl bg-white/40 p-5 backdrop-blur-md hairline">
                  <h2 className="mt-3 font-sans text-3xl leading-[1.05]">Wedding Shoot</h2>
                  <div className="mt-4 aspect-[4/3] overflow-hidden rounded-2xl">
                    <div className="work-slideshow h-full w-full">
                      <img src={kfm2} alt="Wedding shoot 1" loading="lazy" />
                      <img src={kfm7} alt="Wedding shoot 2" loading="lazy" />
                      <img src={kfm19} alt="Wedding shoot 3" loading="lazy" />
                    </div>
                  </div>
                </div>
                <div className="mt-5  rounded-3xl bg-white/40 p-5 backdrop-blur-md hairline">
                  <h2 className="mt-3 font-sans text-3xl leading-[1.05]">Birthday Shoot</h2>
                  <div className="mt-4 aspect-[4/3] overflow-hidden rounded-2xl">
                    <div className="work-slideshow h-full w-full">
                      <img src={kfm15} alt="Birthday shoot 1" loading="lazy" />
                      <img src={kfm9} alt="Birthday shoot 2" loading="lazy" />
                      <img src={kfm4} alt="Birthday shoot 3" loading="lazy" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-12 md:col-span-7">
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
              </div>
            </div>
          </div>
        </section>
        </div>

        {/* TESTIMONIALS */}
        <section id="testimonials" className="snapStart relative min-h-[100svh] pt-20">
          <div className="absolute inset-0 gridlines" />
          <div className="relative mx-auto max-w-6xl px-4 pb-16">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-4">
                <div className="rounded-3xl bg-white/40 p-5 backdrop-blur-md hairline">
                  <h2 className="mt-3 font-sans text-4xl leading-[1.05]">Everything is perfect.</h2>
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
                      <p className="text-xs uppercase tracking-[0.18em] text-white/70">Founder</p>
                      <p className="mt-1 font-sans text-xl text-white">Dilojan</p>
                      <p className="mt-2 text-xs text-white/70">
                        “We craft cinematic stories with calm direction and premium finish.”
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-12 md:col-span-8">
                <TestimonialCard
                  quote="Founded with a passion for authentic storytelling, Studio KFM began as a vision to capture life's unscripted beauty. What started with a single camera has grown into a celebrated studio specializing in weddings, portraits, and editorial work."
                  title="Our Studio Story"
                />

                <div className="mt-6 rounded-3xl bg-white/40 p-5 backdrop-blur-md hairline">
                  <p className="text-xs uppercase tracking-[0.18em text-black">Why Choose Us</p>
                  <h3 className="mt-3 font-sans text-3xl">Our cinematic journey</h3>
                  <div className="mt-8 grid gap-3 md:grid-cols-3">
                    {[
                      {
                        title: "Story-first",
                        text: "We design every frame like a film still.",
                      },
                      {
                        title: "Premium finish",
                        text: "Color science tuned for skin and texture.",
                      },
                      {
                        title: "Calm direction",
                        text: "Guided poses that feel natural on camera.",
                      },
                      {
                        title: "Story-first",
                        text: "We design every frame like a film still.",
                      },
                      {
                        title: "Premium finish",
                        text: "Color science tuned for skin and texture.",
                      },
                      {
                        title: "Calm direction",
                        text: "Guided poses that feel natural on camera.",
                      },
                    ].map((item) => (
                      <div key={item.title} className="rounded-2xl border border-white/10 bg-black/60 p-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-white/70">
                          {item.title}
                        </p>
                        <p className="mt-2 text-sm text-white/80">{item.text}</p>
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
                      <h3 className="mt-2 font-sans text-3xl text-white">Start your journey</h3>
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
                  <h2 className="mt-3 font-sans text-4xl leading-[1.05]">Let’s begin.</h2>
                  <p className="mt-3 text-sm text-zinc-700">
                    Choose a direct channel and our team will respond with the next steps.
                  </p>

                  <div className="mt-6 grid gap-3">
                    <a
                      href="mailto:hello@nagans.studio"
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/60 px-4 py-4 text-sm text-white/80 hover:bg-black/70"
                    >
                      <span>Email</span>
                      <span className="text-[#d4af37]">StudioKFM@gmail.com</span>
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
                <h3 className="mt-3 font-sans text-3xl text-white">
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
                  <p className="font-sans text-2xl text-white">{it.title}</p>
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
          <p className="mt-2 font-sans text-3xl leading-tight">{title}</p>
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
      <p className="mt-3 font-sans text-2xl leading-tight text-zinc-900">{quote}</p>
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
