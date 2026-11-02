'use client';

import React, { useState } from 'react';
import {
  Wind,
  ShieldAlert,
  Cpu,
  Sparkles,
  Eye,
  Zap,
  Layers,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';

interface FeaturePoint {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  align: 'left' | 'right';
  badgeText: string;
}

const features: FeaturePoint[] = [
  {
    id: 'ai-vision',
    title: '360° AI Computer Vision',
    subtitle: 'Pedestrian analytics, safety surveillance & traffic density monitoring',
    icon: Eye,
    align: 'left',
    badgeText: 'AI 360° COMPUTER VISION',
  },
  {
    id: 'cyclone-misting',
    title: '360° Cyclonic Mist Scrubber',
    subtitle: 'Ionized fine mist ring actively scrubbing particulate PM2.5 & PM10',
    icon: Wind,
    align: 'left',
    badgeText: 'CYCLONIC MIST SCRUBBER',
  },
  {
    id: 'treated-screen',
    title: 'Treated Air Output Monitor',
    subtitle: 'Continuous monitor proving drop down to 4.16 µg/m³ PM2.5',
    icon: Cpu,
    align: 'left',
    badgeText: 'TREATED CLEAN AIR OUTPUT',
  },
  {
    id: 'solar',
    title: 'Solar Hybrid Canopy',
    subtitle: 'Monocrystalline solar roof supporting autonomous clean power',
    icon: Zap,
    align: 'right',
    badgeText: 'SOLAR HYBRID CANOPY',
  },
  {
    id: 'led-lighting',
    title: 'Adaptive LED Luminaires',
    subtitle: 'Dark-activated streetlighting with automated lux sensors and zero glare',
    icon: Sparkles,
    align: 'right',
    badgeText: 'ADAPTIVE LED LUMINAIRES',
  },
  {
    id: 'ambient-screen',
    title: 'Ambient Air Quality HUD',
    subtitle: 'Real-time telemetry showing live surrounding PM10 & PM2.5',
    icon: ShieldAlert,
    align: 'right',
    badgeText: 'AMBIENT AIR QUALITY HUD',
  },
  {
    id: 'dooh-display',
    title: 'Digital DOOH Smart Media',
    subtitle: 'Weatherproof high-nit digital billboard for public advisories',
    icon: Layers,
    align: 'right',
    badgeText: 'DIGITAL DOOH SMART MEDIA',
  },
];

export default function PoleLightInteractive() {
  const [activeFeatureIndex, setActiveFeatureIndex] = useState<number>(0);
  const activeFeature = features[activeFeatureIndex];

  const handleSelectFeature = (index: number) => {
    setActiveFeatureIndex(index);
  };

  const handlePrev = () => {
    setActiveFeatureIndex((curr) => (curr - 1 + features.length) % features.length);
  };

  const handleNext = () => {
    setActiveFeatureIndex((curr) => (curr + 1) % features.length);
  };

  return (
    <section id="interactiveHardware" className="py-20 px-4 sm:px-6 lg:px-8 border-b border-[var(--border-subtle)] transition-colors">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-block font-mono text-xs font-bold text-[#c8102e] uppercase tracking-widest mb-3">
            ENGINEERING BREAKTHROUGH
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--text-primary)] tracking-tight mb-4">
            What is Atmos<span className="text-[#c8102e]">POLE</span>™?
          </h2>
          <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
            Turnkey atmospheric poles combining 360° cyclonic mist scrubbing, dual IoT telemetry, and AI pedestrian safety.
          </p>
        </div>

        {/* Interactive Explorer Card */}
        <div className="rounded-3xl border border-[var(--border-card)] bg-[var(--bg-card)] p-6 sm:p-10 shadow-xl transition-all">
          {/* Card Subheader */}
          <div className="mb-8 pb-5 border-b border-[var(--border-subtle)]">
            <div className="inline-flex items-center gap-1.5 font-mono text-xs text-[#c8102e] font-bold uppercase tracking-wider mb-1.5">
              <Sparkles size={14} /> Interactive Hardware Explorer
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)]">
              AtmosPOLE™ Integrated Architecture & Hardware Subsystems
            </h3>
          </div>

          {/* 3-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px_1fr] items-center gap-6 lg:gap-8">
            {/* Left Column (3 items) */}
            <div className="flex flex-col gap-4">
              {features
                .filter((f) => f.align === 'left')
                .map((feature) => {
                  const featureIdx = features.findIndex((x) => x.id === feature.id);
                  const isSelected = activeFeatureIndex === featureIdx;
                  const Icon = feature.icon;
                  return (
                    <div
                      key={feature.id}
                      onClick={() => handleSelectFeature(featureIdx)}
                      className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 border ${
                        isSelected
                          ? 'border-[#c8102e] bg-[var(--bg-card-hover)] shadow-lg lg:translate-x-1.5'
                          : 'border-[var(--border-subtle)] bg-[var(--bg-card)] hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-1.5">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                            isSelected ? 'bg-[#c8102e] text-white' : 'bg-red-500/10 text-[#c8102e]'
                          }`}
                        >
                          <Icon size={17} />
                        </div>
                        <h4 className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
                          {feature.title}
                        </h4>
                      </div>
                      <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-snug">
                        {feature.subtitle}
                      </p>
                    </div>
                  );
                })}
            </div>

            {/* Center Video Display */}
            <div className="relative w-full h-[540px] sm:h-[600px] flex items-center justify-center">
              <div className="relative w-full max-w-[340px] h-full rounded-2xl overflow-hidden border-2 border-[var(--border-card)] shadow-2xl bg-black">
                <video
                  src="/video-overview.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover block"
                />

                {/* Video Badge Overlay */}
                <div className="absolute bottom-4 inset-x-4 bg-slate-950/85 backdrop-blur-md border border-[#c8102e]/60 rounded-xl px-3.5 py-2.5 flex items-center justify-between text-white shadow-lg z-10">
                  <div className="flex items-center gap-2">
                    <Sparkles size={14} className="text-[#c8102e]" />
                    <span className="text-xs font-bold font-mono tracking-wide text-slate-100">
                      {activeFeature.badgeText}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-[#c8102e] px-2 py-0.5 rounded-full">
                    ACTIVE
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column (4 items) */}
            <div className="flex flex-col gap-4">
              {features
                .filter((f) => f.align === 'right')
                .map((feature) => {
                  const featureIdx = features.findIndex((x) => x.id === feature.id);
                  const isSelected = activeFeatureIndex === featureIdx;
                  const Icon = feature.icon;
                  return (
                    <div
                      key={feature.id}
                      onClick={() => handleSelectFeature(featureIdx)}
                      className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 border ${
                        isSelected
                          ? 'border-[#c8102e] bg-[var(--bg-card-hover)] shadow-lg lg:-translate-x-1.5'
                          : 'border-[var(--border-subtle)] bg-[var(--bg-card)] hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-1.5">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                            isSelected ? 'bg-[#c8102e] text-white' : 'bg-red-500/10 text-[#c8102e]'
                          }`}
                        >
                          <Icon size={17} />
                        </div>
                        <h4 className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
                          {feature.title}
                        </h4>
                      </div>
                      <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-snug">
                        {feature.subtitle}
                      </p>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Bottom Deep Dive Bar */}
          <div className="mt-8 p-4 sm:p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#c8102e] text-white flex items-center justify-center shrink-0 shadow-sm">
                <activeFeature.icon size={20} />
              </div>
              <div>
                <span className="text-[11px] font-mono text-[#c8102e] font-bold uppercase tracking-wider block">
                  FEATURE {activeFeatureIndex + 1} OF {features.length}
                </span>
                <h4 className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
                  {activeFeature.title}
                </h4>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                  {activeFeature.subtitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="px-3.5 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-xs font-semibold flex items-center gap-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <ChevronLeft size={14} />
                <span>Prev</span>
              </button>
              <button
                onClick={handleNext}
                className="px-3.5 py-1.5 rounded-lg bg-[#c8102e] text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-[#b00d27] transition-colors cursor-pointer shadow-sm"
              >
                <span>Next</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
