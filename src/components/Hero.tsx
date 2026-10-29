"use client";

import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-16 px-6 overflow-hidden bg-gradient-to-b from-sky-50/70 via-white to-slate-50">
      {/* Radiant positive background glows */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-20 left-10 w-[450px] h-[450px] bg-rose-100/35 rounded-full blur-3xl pointer-events-none" />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#0f172a 1px, transparent 1px), linear-gradient(90deg, #0f172a 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Bold & Trimmed Copy */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            
            {/* Positive Mission Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/60 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold tracking-wide text-emerald-800">
                Pioneering Clean Air Infrastructure for India
              </span>
            </div>

            {/* Core Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.1]">
              A Better Way to Breathe.
              <br />
              <span className="gradient-brand">A Smarter Way to Build.</span>
            </h1>

            {/* Short, Punchy Description */}
            <p className="text-base sm:text-lg text-slate-600 max-w-lg mx-auto lg:mx-0 leading-relaxed font-normal">
              <strong className="text-slate-900 font-semibold">AtmosPOLE™</strong> replaces ordinary streetlights with solar-powered smart poles that capture toxic PM2.5 smog with micro-mist, integrate CCTV security, and light roads with zero grid power.
            </p>

            {/* Key Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
              <a
                href="#features"
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#c8102e] hover:bg-[#b00d27] text-white text-sm font-semibold tracking-wide transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
              >
                <span>Inspect AtmosPOLE™</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 16 16" fill="none">
                  <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a
                href="#crisis"
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold tracking-wide border border-slate-200 transition-all shadow-xs flex items-center justify-center"
              >
                The India Challenge
              </a>
            </div>

            {/* 3 Crisp Highlight Badges */}
            <div className="pt-8 grid grid-cols-3 gap-3 sm:gap-6 border-t border-slate-200/80 max-w-lg mx-auto lg:mx-0">
              <div className="space-y-1">
                <div className="text-xl sm:text-2xl font-black text-slate-900">100%</div>
                <div className="text-[11px] sm:text-xs text-slate-500 font-medium">Solar Self-Powered</div>
              </div>
              <div className="space-y-1 border-x border-slate-200/80 px-2 sm:px-4">
                <div className="text-xl sm:text-2xl font-black text-emerald-600">PM2.5</div>
                <div className="text-[11px] sm:text-xs text-slate-500 font-medium">Active Mist Suppression</div>
              </div>
              <div className="space-y-1">
                <div className="text-xl sm:text-2xl font-black text-[#c8102e]">0-Grid</div>
                <div className="text-[11px] sm:text-xs text-slate-500 font-medium">Zero Power Drain</div>
              </div>
            </div>

          </div>

          {/* Right Column: High-Res Pole Visual */}
          <div className="lg:col-span-5 flex justify-center relative">
            {/* Subtle glow circle behind pole */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-emerald-100/60 to-rose-100/50 blur-2xl" />

            {/* Pole image */}
            <div className="relative w-52 sm:w-64 lg:w-72 anim-float drop-shadow-[0_25px_35px_rgba(15,23,42,0.15)]">
              <Image
                src="/atmospole-studio.png"
                alt="AtmosPOLE™ Smart Urban Infrastructure"
                width={422}
                height={1024}
                priority
                className="w-full h-auto object-contain"
              />

              {/* Dynamic Mist Particles in Hero */}
              <div className="absolute inset-0 pointer-events-none">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="absolute rounded-full blur-xs"
                    style={{
                      width: `${24 + i * 8}px`,
                      height: "6px",
                      background: "rgba(16, 185, 129, 0.25)",
                      top: `${30 + i * 5}%`,
                      left: i % 2 === 0 ? "-12%" : "auto",
                      right: i % 2 === 1 ? "-12%" : "auto",
                      animation: `${i % 2 === 0 ? "mistDrift" : "mistDriftL"} ${2.5 + i * 0.4}s infinite ease-out`,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Floating Live Badge */}
            <div className="absolute -bottom-3 sm:bottom-4 bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-2xl px-4 py-2.5 shadow-lg flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <div className="text-left">
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Live Status</div>
                <div className="text-xs font-bold text-slate-800">AtmosPOLE™ Active & Purifying</div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
