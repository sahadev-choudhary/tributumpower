"use client";

import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] lg:min-h-screen flex items-center justify-center pt-24 pb-8 sm:pb-12 lg:pt-24 lg:pb-10 px-4 sm:px-6 lg:px-8 overflow-hidden bg-slate-950">
      
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

      <div className="relative max-w-7xl mx-auto w-full z-10">
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          {/* Left Column: Bold, balanced copy utilizing horizontal space */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-4 sm:space-y-5">
            
            {/* Positive Mission Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] sm:text-xs font-semibold tracking-wide text-emerald-300">
                Pioneering Clean Air Infrastructure for India
              </span>
            </div>

            {/* Core Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-[3.25rem] xl:text-6xl font-black tracking-tight text-white leading-[1.12] drop-shadow-md">
              A Better Way to Breathe.
              <br />
              <span className="text-emerald-400 drop-shadow-sm">A Smarter Way to Build.</span>
            </h1>

            {/* Short, White 2-Sentence Description */}
            <p className="text-sm sm:text-base lg:text-lg text-white/90 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal drop-shadow-sm">
              <strong className="text-white font-semibold">AtmosPOLE™</strong> replaces ordinary streetlights with solar-powered smart infrastructure that actively cleans urban air. It combines micro-mist smog suppression with 24/7 CCTV security and zero-grid roadway illumination.
            </p>

            {/* Key Action Buttons — Both 100% visible in full hero section above the fold */}
            <div className="pt-1 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
              <a
                href="#features"
                className="w-full sm:w-auto px-7 py-3 rounded-full bg-[#c8102e] hover:bg-[#b00d27] text-white text-sm font-semibold tracking-wide transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
              >
                <span>Inspect AtmosPOLE™</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 16 16" fill="none">
                  <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a
                href="#crisis"
                className="w-full sm:w-auto px-7 py-3 rounded-full bg-white hover:bg-slate-100 text-slate-900 text-sm font-semibold tracking-wide border border-white/60 transition-all shadow-md flex items-center justify-center backdrop-blur-xs"
              >
                The India Challenge
              </a>
            </div>

            {/* 3 Crisp Highlight Badges — styled for dark background video */}
            <div className="pt-4 sm:pt-5 grid grid-cols-3 gap-2 sm:gap-6 border-t border-white/20 max-w-xl mx-auto lg:mx-0">
              <div className="space-y-0.5">
                <div className="text-lg sm:text-2xl font-black text-white drop-shadow-sm">100%</div>
                <div className="text-[10px] sm:text-xs text-white/80 font-medium leading-tight drop-shadow-xs">Solar Self-Powered</div>
              </div>
              <div className="space-y-0.5 border-x border-white/20 px-2 sm:px-4">
                <div className="text-lg sm:text-2xl font-black text-emerald-400 drop-shadow-sm">PM2.5</div>
                <div className="text-[10px] sm:text-xs text-white/80 font-medium leading-tight drop-shadow-xs">Active Mist Capture</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-lg sm:text-2xl font-black text-rose-400 drop-shadow-sm">0-Grid</div>
                <div className="text-[10px] sm:text-xs text-white/80 font-medium leading-tight drop-shadow-xs">Zero Power Drain</div>
              </div>
            </div>

          </div>

          {/* Right Column: High-Res Pole Visual (Desktop only — hidden on mobile for clean clutter-free layout) */}
          <div className="hidden lg:flex lg:col-span-5 justify-center relative">
            {/* Subtle glow circle behind pole */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />

            {/* Pole image container calibrated to fit viewport */}
            <div className="relative w-44 sm:w-56 lg:w-64 max-h-[52vh] sm:max-h-[58vh] anim-float drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)] flex items-center justify-center">
              <Image
                src="/atmospole-studio.png"
                alt="AtmosPOLE™ Smart Urban Infrastructure"
                width={422}
                height={1024}
                priority
                className="w-full h-auto max-h-[50vh] sm:max-h-[56vh] object-contain"
              />

              {/* Dynamic Mist Particles in Hero */}
              <div className="absolute inset-0 pointer-events-none">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="absolute rounded-full blur-xs"
                    style={{
                      width: `${22 + i * 6}px`,
                      height: "5px",
                      background: "rgba(52, 211, 153, 0.45)",
                      top: `${30 + i * 5}%`,
                      left: i % 2 === 0 ? "-10%" : "auto",
                      right: i % 2 === 1 ? "-10%" : "auto",
                      animation: `${i % 2 === 0 ? "mistDrift" : "mistDriftL"} ${2.5 + i * 0.4}s infinite ease-out`,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Floating Live Badge */}
            <div className="absolute -bottom-2 sm:bottom-2 bg-black/60 backdrop-blur-md border border-white/20 rounded-2xl px-3.5 py-2 shadow-xl flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <div className="text-left">
                <div className="text-[9px] font-mono uppercase tracking-wider text-slate-300">Live Status</div>
                <div className="text-[11px] sm:text-xs font-bold text-white">AtmosPOLE™ Active & Purifying</div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
