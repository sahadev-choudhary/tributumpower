'use client';

import React from 'react';
import { AlertOctagon } from 'lucide-react';

export default function UrbanCrisisSection() {
  return (
    <section id="crisis" className="relative w-full min-h-[85vh] flex items-center overflow-hidden py-20 sm:py-24 border-b border-[var(--border-subtle)]">
      {/* Full-Screen Background Video */}
      <video
        src="/video-traffic.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 brightness-105 contrast-105"
      />

      {/* Luminous Dark Gradient Overlay ensuring clear text readability */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#070b14]/95 via-[#070b14]/85 to-[#070b14]/50 pointer-events-none" />

      {/* 7XL Content Container */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 w-full flex flex-col lg:flex-row items-center lg:items-end justify-between gap-10">
        <div className="max-w-xl">
          <div className="mb-6">
            <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[#ef4444] uppercase tracking-wider bg-red-500/15 border border-red-500/35 px-3 py-1 rounded-full mb-3 shadow-xs">
              THE URBAN CRISIS
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-3 drop-shadow-md">
              What Problems Cities Face Without Atmos<span className="text-[#ef4444]">POLE</span>™
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed drop-shadow-sm">
              Without active roadside scrubbing, pedestrians and commuters absorb dangerous PM2.5 daily.
            </p>
          </div>

          <div className="flex flex-col gap-3.5">
            <div className="bg-[#0a101a]/85 backdrop-blur-xl border border-red-500/35 border-l-4 border-l-[#ef4444] rounded-2xl p-4 sm:p-5 shadow-2xl">
              <div className="flex items-center gap-2.5 mb-1">
                <AlertOctagon size={18} className="text-[#ef4444] shrink-0" />
                <h3 className="text-sm sm:text-base font-bold text-white">
                  Severe PM2.5 & PM10 Inhalation
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-7">
                Roadside particulate matter regularly exceeds safe WHO limits by 15x to 20x.
              </p>
            </div>

            <div className="bg-[#0a101a]/85 backdrop-blur-xl border border-red-500/35 border-l-4 border-l-[#ef4444] rounded-2xl p-4 sm:p-5 shadow-2xl">
              <div className="flex items-center gap-2.5 mb-1">
                <AlertOctagon size={18} className="text-[#ef4444] shrink-0" />
                <h3 className="text-sm sm:text-base font-bold text-white">
                  Urban Heat Island Traps
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-7">
                Vehicular friction and asphalt trap toxic exhaust fumes at bumper breathing height.
              </p>
            </div>

            <div className="bg-[#0a101a]/85 backdrop-blur-xl border border-red-500/35 border-l-4 border-l-[#ef4444] rounded-2xl p-4 sm:p-5 shadow-2xl">
              <div className="flex items-center gap-2.5 mb-1">
                <AlertOctagon size={18} className="text-[#ef4444] shrink-0" />
                <h3 className="text-sm sm:text-base font-bold text-white">
                  Zero Pedestrian Transparency
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-7">
                Traditional regional weather stations cannot measure street-level breathing corridors.
              </p>
            </div>
          </div>
        </div>

        {/* Floating Live Telemetry Badge */}
        <div className="w-full lg:w-auto max-w-sm bg-[#0a101a]/90 backdrop-blur-xl border border-red-500/40 rounded-2xl p-4 shadow-2xl">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#ef4444] animate-pulse shadow-[0_0_8px_#ef4444]" />
            <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider">
              UNSCRUBBED ARTERIAL CORRIDORS
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Vehicular emissions accumulate at bumper height without pole filtration.
          </p>
        </div>
      </div>
    </section>
  );
}
