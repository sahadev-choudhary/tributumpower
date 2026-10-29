"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";

interface FeatureStage {
  id: string;
  stepNum: string;
  category: string;
  title: string;
  accent: string;
  badgeBg: string;
  badgeText: string;
  description: string;
  highlightText: string;
  // Precise transform origin & scale on the 422x1024 pole image
  originX: number; // percentage (0 - 100)
  originY: number; // percentage (0 - 100)
  scale: number;
  // Visual pointer reticle coordinates (% of image)
  reticleX?: number;
  reticleY?: number;
  reticleLabel?: string;
}

const STAGES: FeatureStage[] = [
  {
    id: "solar",
    stepNum: "01",
    category: "TOP CROWN",
    title: "Solar Power Array",
    accent: "#d97706",
    badgeBg: "bg-amber-100",
    badgeText: "text-amber-800",
    description:
      "Mounted at the very crown of the AtmosPOLE™, the high-efficiency monocrystalline solar array harvests daylight to power the lights, mist system, sensors, and display without drawing grid electricity.",
    highlightText: "100% self-powered by daylight with integrated overnight battery reserve",
    originX: 50,
    originY: 4,
    scale: 2.6,
    reticleX: 50,
    reticleY: 4,
    reticleLabel: "Crown Solar Panel",
  },
  {
    id: "lamp-right",
    stepNum: "02",
    category: "STREET ILLUMINATION",
    title: "Right LED Road Luminaire",
    accent: "#ca8a04",
    badgeBg: "bg-yellow-100",
    badgeText: "text-yellow-800",
    description:
      "Cantilevered roadway luminaires feature high-output optical LED clusters designed to provide wide, uniform carriageway and pedestrian coverage, replacing standard sodium-vapor streetlights 1-to-1.",
    highlightText: "Full roadway lighting standards powered entirely by clean solar energy",
    originX: 82,
    originY: 10,
    scale: 2.7,
    reticleX: 78,
    reticleY: 10,
    reticleLabel: "Right LED Luminaire",
  },
  {
    id: "mist-left",
    stepNum: "03",
    category: "AIR PURIFICATION",
    title: "Active Mist Smog Suppression",
    accent: "#0284c7",
    badgeBg: "bg-sky-100",
    badgeText: "text-sky-800",
    description:
      "Micro-fine mist nozzles atomize water droplets into the air. These microscopic droplets collide with toxic PM2.5 and PM10 smog particles, weighing them down and washing the air clean right where citizens breathe.",
    highlightText: "Chemical-free particulate knock-down active on both sides of the pole",
    originX: 18,
    originY: 28,
    scale: 2.7,
    reticleX: 16,
    reticleY: 28,
    reticleLabel: "Mist Suppression Nozzles",
  },
  {
    id: "sensors",
    stepNum: "04",
    category: "CONTINUOUS MONITORING",
    title: "Dual Air Quality Sensors",
    accent: "#dc2626",
    badgeBg: "bg-rose-100",
    badgeText: "text-rose-800",
    description:
      "Dual optical laser particulate sensors measure air quality in real time: tracking incoming ambient polluted air vs. the purified air after misting, streaming verified readings every 5 minutes.",
    highlightText: "Uncompromised transparency: ambient intake vs. clean treated output",
    originX: 50,
    originY: 23,
    scale: 2.5,
    reticleX: 50,
    reticleY: 22,
    reticleLabel: "Intake Sensors & Vents",
  },
  {
    id: "screen",
    stepNum: "05",
    category: "CITIZEN TRANSPARENCY",
    title: "Public Digital Display",
    accent: "#7c3aed",
    badgeBg: "bg-violet-100",
    badgeText: "text-violet-800",
    description:
      "A tall, sunlight-readable portrait screen displays live PM2.5 and PM10 numbers, the Air Pulse™ Index, and total cubic feet of cleaned air — giving every citizen direct awareness without needing an app.",
    highlightText: "Real-time contrast: Ambient Unhealthy (125) vs. Treated Clean (4.16)",
    originX: 50,
    originY: 50,
    scale: 2.0,
    reticleX: 50,
    reticleY: 48,
    reticleLabel: "Live Public Display",
  },
  {
    id: "full-pole",
    stepNum: "06",
    category: "UNIFIED URBAN ASSET",
    title: "The Complete Smart Pole",
    accent: "#16a34a",
    badgeBg: "bg-emerald-100",
    badgeText: "text-emerald-800",
    description:
      "From solar crown and CCTV surveillance down to the rugged bolted base, AtmosPOLE™ consolidates six vital urban capabilities into one elegant architectural column ready for India's 100+ Smart Cities.",
    highlightText: "One standard footprint. Six integrated smart city functions. Zero disruption.",
    originX: 50,
    originY: 50,
    scale: 1.0,
    reticleLabel: "Full Integrated AtmosPOLE™",
  },
];

export default function ScrollFeatures() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const isScrollingRef = useRef(false);

  // Smooth wheel navigation: one gentle scroll flick advances to next/prev stage
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      const rect = el.getBoundingClientRect();
      const inView = rect.top <= 80 && rect.bottom >= window.innerHeight - 80;

      if (!inView) return;

      // Allow natural scroll up when at the first stage and scrolling up
      if (activeIdx === 0 && e.deltaY < 0) return;
      // Allow natural scroll down when at the last stage and scrolling down
      if (activeIdx === STAGES.length - 1 && e.deltaY > 0) return;

      // Intercept and advance precisely 1 feature with no dead delay
      e.preventDefault();

      if (isScrollingRef.current) return;
      if (Math.abs(e.deltaY) < 18) return; // ignore micro-jitters

      isScrollingRef.current = true;
      if (e.deltaY > 0) {
        setActiveIdx((prev) => Math.min(STAGES.length - 1, prev + 1));
      } else {
        setActiveIdx((prev) => Math.max(0, prev - 1));
      }

      setTimeout(() => {
        isScrollingRef.current = false;
      }, 550);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [activeIdx]);

  // Touch swipe support for mobile
  const touchStartY = useRef<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY.current - touchEndY;

    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        // Swipe up -> next
        setActiveIdx((prev) => Math.min(STAGES.length - 1, prev + 1));
      } else {
        // Swipe down -> prev
        setActiveIdx((prev) => Math.max(0, prev - 1));
      }
    }
    touchStartY.current = null;
  };

  const current = STAGES[activeIdx] || STAGES[0];

  return (
    <section
      ref={containerRef}
      id="features"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      className="relative min-h-screen py-10 sm:py-16 px-6 sm:px-12 bg-gradient-to-b from-slate-50 via-sky-50/20 to-white flex items-center justify-center overflow-hidden"
    >
      {/* Ambient background illumination */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-700 ease-out"
        style={{
          background: `radial-gradient(circle 500px at 45% 50%, ${current.accent}14, transparent 70%),
                       radial-gradient(circle 450px at 75% 30%, rgba(22, 163, 74, 0.05), transparent 70%)`,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col justify-between min-h-[85vh]">
        
        {/* Top Header Bar with Milestone Indicators */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/70">
          <div className="flex items-center gap-2.5">
            <span
              className="w-2.5 h-2.5 rounded-full animate-ping"
              style={{ backgroundColor: current.accent }}
            />
            <span className="text-xs font-bold tracking-widest text-slate-600 uppercase">
              AtmosPOLE™ Inspection · Point {activeIdx + 1} of {STAGES.length}
            </span>
          </div>

          {/* Quick-select milestone pills */}
          <div className="flex items-center gap-1.5">
            {STAGES.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setActiveIdx(idx)}
                aria-label={`Jump to ${s.title}`}
                className={`transition-all duration-300 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                  idx === activeIdx
                    ? "w-8 h-6 text-white shadow-xs"
                    : "w-6 h-6 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
                }`}
                style={{
                  backgroundColor: idx === activeIdx ? current.accent : "transparent",
                }}
              >
                {s.stepNum}
              </button>
            ))}
          </div>
        </div>

        {/* Central Stage: Focused Pole on Left, Translucent Floating Card on Right */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto py-6">
          
          {/* ── LEFT (Cols 1-7): Clean Viewport with Targeted Zoom ── */}
          <div className="lg:col-span-7 h-[50vh] sm:h-[60vh] lg:h-[72vh] flex items-center justify-center relative overflow-hidden bg-white/40 rounded-3xl border border-slate-200/50 shadow-inner">
            
            {/* Pole Container — Scales and moves exactly from the target component */}
            <div
              className="relative w-full h-full flex items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                transformOrigin: `${current.originX}% ${current.originY}%`,
                transform: `scale(${current.scale})`,
              }}
            >
              <div className="relative w-44 sm:w-56 md:w-64 lg:w-72 h-[85%] flex items-center justify-center filter drop-shadow-[0_20px_35px_rgba(15,23,42,0.18)]">
                <Image
                  src="/atmospole-studio.png"
                  alt="AtmosPOLE™ Smart Urban Infrastructure"
                  width={422}
                  height={1024}
                  priority
                  className="w-full h-full object-contain"
                />

                {/* Reticle / Target ring on the specific component */}
                {current.reticleX !== undefined && current.reticleY !== undefined && (
                  <div
                    className="absolute pointer-events-none transition-all duration-700 ease-out"
                    style={{
                      top: `${current.reticleY}%`,
                      left: `${current.reticleX}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <span
                      className="absolute -inset-3.5 rounded-full animate-ping opacity-75"
                      style={{ backgroundColor: current.accent }}
                    />
                    <span
                      className="relative block w-6 h-6 rounded-full border-2 bg-white/95 shadow-md flex items-center justify-center"
                      style={{ borderColor: current.accent }}
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: current.accent }}
                      />
                    </span>
                  </div>
                )}

                {/* Animated Mist Sprays when Mist Stage is Active */}
                {current.id === "mist-left" && (
                  <div className="absolute inset-0 pointer-events-none">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="absolute rounded-full blur-xs"
                        style={{
                          width: `${30 + i * 10}px`,
                          height: "8px",
                          background: "rgba(2, 132, 199, 0.4)",
                          top: `${26 + i * 4}%`,
                          left: "-22%",
                          animation: `mistDriftL 1.8s infinite ease-out`,
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* LED Beam Glow when Right Lamp Stage is Active */}
                {current.id === "lamp-right" && (
                  <div
                    className="absolute top-[8%] right-[-35%] w-[250px] h-[250px] pointer-events-none opacity-50 blur-xl"
                    style={{
                      background:
                        "radial-gradient(ellipse at 50% 0%, rgba(234, 179, 8, 0.5) 0%, transparent 70%)",
                    }}
                  />
                )}

                {/* Solar Irradiance Glow when Solar Stage is Active */}
                {current.id === "solar" && (
                  <div
                    className="absolute -top-[15%] left-[-20%] right-[-20%] h-[140px] pointer-events-none opacity-50 blur-lg"
                    style={{
                      background:
                        "radial-gradient(ellipse at 50% 50%, rgba(245, 158, 11, 0.6) 0%, transparent 60%)",
                    }}
                  />
                )}
              </div>
            </div>

            {/* Subtitle tag overlay */}
            <div className="absolute bottom-4 left-5 bg-white/85 backdrop-blur-md px-3 py-1 rounded-full border border-slate-200/80 text-[10px] font-mono font-semibold text-slate-600 shadow-xs">
              {current.reticleLabel}
            </div>
          </div>

          {/* ── RIGHT (Cols 8-12): Translucent Floating Glass Backdrop Card ── */}
          <div className="lg:col-span-5 relative flex flex-col justify-center">
            
            <div
              key={current.id}
              className="glass-light rounded-3xl p-6 sm:p-9 transition-all duration-500 shadow-xl border border-white/90 relative"
            >
              {/* Decorative top color bar */}
              <div
                className="absolute top-0 left-8 right-8 h-1 rounded-b-full transition-colors duration-500"
                style={{ backgroundColor: current.accent }}
              />

              {/* Category Pill & Step Counter */}
              <div className="flex items-center justify-between mb-3 pt-2">
                <span
                  className={`px-3 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase ${current.badgeBg} ${current.badgeText}`}
                >
                  {current.category}
                </span>
                <span className="text-xs font-mono font-semibold text-slate-400">
                  {current.stepNum} of 06
                </span>
              </div>

              {/* Title */}
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug mb-3">
                {current.title}
              </h3>

              {/* Trimmed Description */}
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6">
                {current.description}
              </p>

              {/* Punchy Highlight Pill */}
              <div
                className="rounded-xl px-4 py-3 flex items-start gap-3 border transition-colors"
                style={{
                  backgroundColor: `${current.accent}0d`,
                  borderColor: `${current.accent}25`,
                }}
              >
                <div
                  className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                  style={{ backgroundColor: current.accent }}
                />
                <span className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
                  {current.highlightText}
                </span>
              </div>

              {/* Navigation Arrows for Direct Control */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200/80">
                <button
                  onClick={() => setActiveIdx((prev) => Math.max(0, prev - 1))}
                  disabled={activeIdx === 0}
                  className={`flex items-center gap-1.5 text-xs font-semibold ${
                    activeIdx === 0
                      ? "text-slate-300 cursor-not-allowed"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                    <path d="M10 13l-5-5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Previous</span>
                </button>

                <div className="text-[11px] font-mono text-slate-400">
                  Scroll or click next
                </div>

                <button
                  onClick={() => setActiveIdx((prev) => Math.min(STAGES.length - 1, prev + 1))}
                  disabled={activeIdx === STAGES.length - 1}
                  className={`flex items-center gap-1.5 text-xs font-semibold ${
                    activeIdx === STAGES.length - 1
                      ? "text-slate-300 cursor-not-allowed"
                      : "text-slate-900 hover:text-[#c8102e]"
                  }`}
                >
                  <span>Next Feature</span>
                  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                    <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>

            </div>

          </div>

        </div>

        {/* Bottom Status Cue */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-200/70 font-medium">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            1 scroll / gesture advances 1 feature in real time
          </span>
          <span className="font-mono text-slate-500">
            {activeIdx === STAGES.length - 1 ? "Inspection Complete" : "Use scroll or arrow buttons to navigate"}
          </span>
        </div>

      </div>
    </section>
  );
}
