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
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/85 backdrop-blur-xl border-b border-slate-200/80 shadow-xs py-3.5"
          : "bg-transparent py-5"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Brand Logo - Official High Resolution with Dark 'T' & Private Limited */}
        <a href="/" className="flex items-center group">
          <div className="relative h-9 sm:h-11 w-auto">
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
                className="text-xs sm:text-sm font-medium text-slate-600 hover:text-[#c8102e] transition-colors tracking-wide"
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
            className="px-5 py-2.5 rounded-full bg-[#c8102e] hover:bg-[#b00d27] text-white text-xs font-semibold tracking-wide transition-all shadow-sm hover:shadow-md flex items-center gap-2"
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
