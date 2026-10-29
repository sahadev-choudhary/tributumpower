"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

const NAV_LINKS = [
  { href: "#crisis", label: "The Challenge" },
  { href: "#solution", label: "The Solution" },
  { href: "#features", label: "AtmosPOLE™" },
  { href: "#vision", label: "Smart India" },
  { href: "#telemetry", label: "Live Telemetry" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [inVideoSection, setInVideoSection] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Detect if user is currently inside the full screen video section (#features)
      const featuresEl = document.getElementById("features");
      if (featuresEl) {
        const rect = featuresEl.getBoundingClientRect();
        // Section is pinned full-screen while rect.top <= 80 and rect.bottom >= 80
        const isOverVideo = rect.top <= 80 && rect.bottom >= 80;
        setInVideoSection(isOverVideo);
      } else {
        setInVideoSection(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("touchmove", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("touchmove", handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        inVideoSection
          ? "md:bg-transparent md:border-transparent md:shadow-none bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-xs py-3"
          : scrolled
          ? "bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-xs py-3"
          : "bg-white/85 backdrop-blur-md border-b border-slate-200/60 shadow-xs py-3.5"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Brand Logo - Official High Resolution */}
        <a href="/" className="flex items-center group">
          <div
            className={`relative h-9 sm:h-11 w-auto transition-all ${
              inVideoSection
                ? "md:bg-white/90 md:px-2.5 md:py-1 md:rounded-xl md:backdrop-blur-md md:shadow-sm"
                : ""
            }`}
          >
            <Image
              src="/tributum-logo-clean.png"
              alt="Tributum Power Private Limited"
              width={180}
              height={55}
              priority
              className="h-9 sm:h-11 w-auto object-contain group-hover:scale-102 transition-transform"
            />
          </div>
        </a>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`text-xs sm:text-sm font-medium transition-colors tracking-wide ${
                  inVideoSection
                    ? "text-white/90 hover:text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                    : "text-slate-600 hover:text-[#c8102e]"
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Action Button */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="#features"
            className={`px-5 py-2.5 rounded-full text-white text-xs font-semibold tracking-wide transition-all shadow-sm hover:shadow-md flex items-center gap-2 ${
              inVideoSection
                ? "bg-[#c8102e] hover:bg-[#b00d27] border border-white/20"
                : "bg-[#c8102e] hover:bg-[#b00d27]"
            }`}
          >
            <span>Explore Pole</span>
            <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
              <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 text-slate-700 focus:outline-hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
        >
          <div className={`w-5 h-0.5 bg-slate-800 transition-all ${mobileOpen ? "rotate-45 translate-y-1" : "mb-1.5"}`} />
          <div className={`w-5 h-0.5 bg-slate-800 transition-all ${mobileOpen ? "-rotate-45" : ""}`} />
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-2xl border-b border-slate-200 px-6 py-6 shadow-xl space-y-4">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-semibold text-slate-700 hover:text-[#c8102e] transition-colors py-1"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#features"
            onClick={() => setMobileOpen(false)}
            className="block text-center w-full py-3 rounded-full bg-[#c8102e] text-white text-xs font-bold uppercase tracking-wider"
          >
            Explore Pole
          </a>
        </div>
      )}
    </header>
  );
}
