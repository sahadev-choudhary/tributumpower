"use client";

import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] lg:min-h-screen flex items-center justify-center pt-24 pb-8 sm:pb-12 lg:pt-24 lg:pb-10 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-sky-50/80 via-white to-slate-50">
      
      {/* ── BACKGROUND VIDEO LAYER (40% OPACITY) ───────────────────────── */}
      {/* Drops file into /public/video/hero.mp4 to play automatically */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-40 mix-blend-multiply transition-opacity duration-700"
        >
          <source src="/video/hero.mp4" type="video/mp4" />
          <source src="/video/video_2b6c1a47 (online-video-cutter.com).mp4" type="video/mp4" />
          <source src="/video/hero-bg.mp4" type="video/mp4" />
          <source src="/video/atmospole.mp4" type="video/mp4" />
          <source src="/video/hero.webm" type="video/webm" />
        </video>
        {/* Soft atmospheric gradient wash ensuring crystal-clear text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-50/60 via-white/50 to-slate-50/80 pointer-events-none" />
      </div>

      {/* Radiant positive background glows */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-emerald-100/35 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute top-20 left-10 w-[450px] h-[450px] bg-rose-100/30 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(#0f172a 1px, transparent 1px), linear-gradient(90deg, #0f172a 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative max-w-7xl mx-auto w-full z-10">
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          {/* Left Column: Bold, balanced copy utilizing horizontal space */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-4 sm:space-y-5">
            
            {/* Positive Mission Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50/90 border border-emerald-200/70 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] sm:text-xs font-semibold tracking-wide text-emerald-800">
                Pioneering Clean Air Infrastructure for India
              </span>
            </div>

            {/* Core Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-[3.25rem] xl:text-6xl font-black tracking-tight text-slate-900 leading-[1.12]">
              A Better Way to Breathe.
              <br />
              <span className="gradient-brand">A Smarter Way to Build.</span>
            </h1>

            {/* Short, Punchy Description utilizing horizontal width */}
            <p className="text-sm sm:text-base lg:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              <strong className="text-slate-900 font-semibold">AtmosPOLE™</strong> replaces ordinary streetlights with solar-powered smart poles that capture toxic PM2.5 smog with micro-mist, integrate CCTV security, and light roads with zero grid power.
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
                className="w-full sm:w-auto px-7 py-3 rounded-full bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold tracking-wide border border-slate-200 transition-all shadow-xs flex items-center justify-center"
              >
                The India Challenge
              </a>
            </div>

            {/* 3 Crisp Highlight Badges — compact & scannable */}
            <div className="pt-4 sm:pt-5 grid grid-cols-3 gap-2 sm:gap-6 border-t border-slate-200/80 max-w-xl mx-auto lg:mx-0">
              <div className="space-y-0.5">
                <div className="text-lg sm:text-2xl font-black text-slate-900">100%</div>
                <div className="text-[10px] sm:text-xs text-slate-500 font-medium leading-tight">Solar Self-Powered</div>
              </div>
              <div className="space-y-0.5 border-x border-slate-200/80 px-2 sm:px-4">
                <div className="text-lg sm:text-2xl font-black text-emerald-600">PM2.5</div>
                <div className="text-[10px] sm:text-xs text-slate-500 font-medium leading-tight">Active Mist Capture</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-lg sm:text-2xl font-black text-[#c8102e]">0-Grid</div>
                <div className="text-[10px] sm:text-xs text-slate-500 font-medium leading-tight">Zero Power Drain</div>
              </div>
            </div>

          </div>

          {/* Right Column: High-Res Pole Visual (calibrated height to fit screen) */}
          <div className="lg:col-span-5 flex justify-center relative">
            {/* Subtle glow circle behind pole */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-gradient-to-tr from-emerald-100/60 to-rose-100/50 blur-2xl pointer-events-none" />

            {/* Pole image container calibrated to fit viewport */}
            <div className="relative w-44 sm:w-56 lg:w-64 max-h-[52vh] sm:max-h-[58vh] anim-float drop-shadow-[0_20px_30px_rgba(15,23,42,0.15)] flex items-center justify-center">
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
                      background: "rgba(16, 185, 129, 0.25)",
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
            <div className="absolute -bottom-2 sm:bottom-2 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl px-3.5 py-2 shadow-lg flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <div className="text-left">
                <div className="text-[9px] font-mono uppercase tracking-wider text-slate-400">Live Status</div>
                <div className="text-[11px] sm:text-xs font-bold text-slate-800">AtmosPOLE™ Active & Purifying</div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
