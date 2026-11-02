"use client";

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/ThemeContext";

const NAV_LINKS = [
  { href: "#features", label: "AtmosPOLE™ 3D" },
  { href: "#interactiveHardware", label: "Subsystems" },
  { href: "#crisis", label: "The Challenge" },
  { href: "#vision", label: "Smart India" },
  { href: "#telemetry", label: "Live Telemetry" },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const isScrolled = window.scrollY > 20;
          setScrolled(isScrolled);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isDark = theme === "dark";
  const isTransparent = !scrolled;

  // At the top over the dark hero video, use the crisp white logo.
  // When scrolled down, select logo according to active theme.
  const logoSrc = isTransparent
    ? "/logo.png"
    : isDark
    ? "/logo.png"
    : "/logo-dark-text.png";

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        isTransparent
          ? "bg-transparent border-b border-transparent shadow-none py-4 sm:py-5"
          : isDark
          ? "bg-[#070b14]/90 backdrop-blur-xl border-b border-white/10 text-white shadow-md py-3"
          : "bg-white/95 backdrop-blur-xl border-b border-slate-200/90 text-slate-900 shadow-sm py-3"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Brand Logo - Switches dynamically based on dark / light theme */}
        <a href="/" className="flex items-center group">
          <div className="relative h-9 sm:h-11 w-auto transition-all">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoSrc}
              alt="Tributum Power Private Limited"
              className="h-9 sm:h-11 w-auto object-contain group-hover:scale-102 transition-transform"
            />
          </div>
        </a>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`text-xs sm:text-sm font-medium transition-colors tracking-wide ${
                  isTransparent
                    ? "text-white/85 hover:text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                    : isDark
                    ? "text-slate-300 hover:text-white"
                    : "text-slate-700 hover:text-[#c8102e]"
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Actions: Theme Toggle & Deploy Button */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full border transition-all cursor-pointer flex items-center justify-center ${
              isTransparent
                ? "border-white/20 bg-black/30 backdrop-blur-md text-amber-300 hover:bg-white/20 hover:text-white"
                : isDark
                ? "border-white/20 bg-white/10 text-amber-300 hover:bg-white/20"
                : "border-slate-300 bg-slate-100 text-slate-800 hover:bg-slate-200"
            }`}
            title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
            aria-label="Toggle Theme"
          >
            {mounted ? (
              isDark ? <Sun size={17} /> : <Moon size={17} />
            ) : (
              <Sun size={17} />
            )}
          </button>

          <a
            href="#features"
            className="px-5 py-2.5 rounded-full text-white text-xs font-semibold tracking-wide transition-all shadow-sm hover:shadow-md flex items-center gap-2 bg-[#c8102e] hover:bg-[#b00d27]"
          >
            <span>Explore Pole</span>
            <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
              <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        {/* Mobile Buttons */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full border transition-all cursor-pointer flex items-center justify-center ${
              isTransparent
                ? "border-white/20 bg-black/30 text-amber-300"
                : isDark
                ? "border-white/20 bg-white/10 text-amber-300"
                : "border-slate-300 bg-slate-100 text-slate-800"
            }`}
            aria-label="Toggle Theme"
          >
            {mounted ? (
              isDark ? <Sun size={16} /> : <Moon size={16} />
            ) : (
              <Sun size={16} />
            )}
          </button>
          
          <button
            className={`p-2 rounded-lg focus:outline-hidden ${
              isTransparent || isDark ? "text-white" : "text-slate-800"
            }`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
          >
            <div className={`w-5 h-0.5 ${isTransparent || isDark ? "bg-white" : "bg-slate-800"} transition-all ${mobileOpen ? "rotate-45 translate-y-1" : "mb-1.5"}`} />
            <div className={`w-5 h-0.5 ${isTransparent || isDark ? "bg-white" : "bg-slate-800"} transition-all ${mobileOpen ? "-rotate-45" : ""}`} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className={`md:hidden px-6 py-6 shadow-xl space-y-4 border-b ${
            isDark
              ? "bg-[#070b14]/98 backdrop-blur-2xl border-white/10 text-white"
              : "bg-white/98 backdrop-blur-2xl border-slate-200 text-slate-800"
          }`}
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-semibold hover:text-[#c8102e] transition-colors py-1"
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
