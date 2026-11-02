"use client";

import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative min-h-screen min-h-[100dvh] w-full flex items-center justify-center pt-20 pb-10 sm:pt-24 sm:pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden bg-slate-950">
      
      {/* ── BACKGROUND VIDEO LAYER (100% FULL VISIBILITY) ───────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-100"
        >
          <source src="/video/hero.mp4" type="video/mp4" />
          <source src="/video/Video Project 2.mp4" type="video/mp4" />
          <source src="/video/hero-bg.mp4" type="video/mp4" />
          <source src="/video/atmospole.mp4" type="video/mp4" />
        </video>
        {/* Contrast overlay: keeps full video visible while making white text razor sharp */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/45 pointer-events-none" />
      </div>

      {/* Grid Pattern with subtle glow */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative max-w-7xl mx-auto w-full z-10 text-left px-6 py-8 sm:py-16">
        <div className="space-y-4 sm:space-y-6 max-w-4xl text-left">
          {/* Positive Mission Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs sm:text-sm font-semibold tracking-wide text-emerald-300">
              Pioneering Clean Air Infrastructure for India
            </span>
          </div>

          {/* Core Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight text-white leading-[1.12] drop-shadow-md">
            A Better Way to Breathe.
            <br />
            <span className="text-emerald-400 drop-shadow-sm">A Smarter Way to Build.</span>
          </h1>

          {/* Short, White 2-Sentence Description */}
          <p className="text-sm sm:text-lg lg:text-xl text-white/90 max-w-3xl leading-relaxed font-normal drop-shadow-sm">
            <strong className="text-white font-semibold">AtmosPOLE™</strong> replaces ordinary streetlights with solar-powered smart infrastructure that actively cleans urban air. It combines micro-mist smog suppression with 24/7 CCTV security and zero-grid roadway illumination.
          </p>

          {/* Key Action Buttons - Left aligned */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-start gap-3 sm:gap-4">
            <a
              href="#features"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#c8102e] hover:bg-[#b00d27] text-white text-sm sm:text-base font-semibold tracking-wide transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Inspect AtmosPOLE™ 3D</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 16 16" fill="none">
                <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a
              href="#crisis"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white hover:bg-slate-100 text-slate-900 text-sm sm:text-base font-semibold tracking-wide border border-white/60 transition-all shadow-md flex items-center justify-center backdrop-blur-xs cursor-pointer"
            >
              The India Challenge
            </a>
          </div>

          {/* 3 Crisp Highlight Badges - Left aligned */}
          <div className="pt-6 sm:pt-8 grid grid-cols-3 gap-3 sm:gap-8 border-t border-white/20 max-w-2xl text-left">
            <div className="space-y-1">
              <div className="text-lg sm:text-3xl font-black text-white drop-shadow-sm">100%</div>
              <div className="text-xs sm:text-sm text-white/80 font-medium leading-tight">Solar Self-Powered</div>
            </div>
            <div className="space-y-1 border-x border-white/20 px-2 sm:px-4">
              <div className="text-lg sm:text-3xl font-black text-emerald-400 drop-shadow-sm">PM2.5</div>
              <div className="text-xs sm:text-sm text-white/80 font-medium leading-tight">Active Mist Capture</div>
            </div>
            <div className="space-y-1">
              <div className="text-lg sm:text-3xl font-black text-rose-400 drop-shadow-sm">0-Grid</div>
              <div className="text-xs sm:text-sm text-white/80 font-medium leading-tight">Zero Power Drain</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
