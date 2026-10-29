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
  scaleDesktop: number;
  scaleMobile: number;
  // Visual pointer reticle coordinates (% of image)
  reticleX?: number;
  reticleY?: number;
  reticleLabel: string;
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
    scaleDesktop: 2.6,
    scaleMobile: 2.2,
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
    scaleDesktop: 2.7,
    scaleMobile: 2.3,
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
    scaleDesktop: 2.7,
    scaleMobile: 2.3,
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
    scaleDesktop: 2.5,
    scaleMobile: 2.1,
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
    scaleDesktop: 2.0,
    scaleMobile: 1.8,
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
    scaleDesktop: 1.0,
    scaleMobile: 1.0,
    reticleLabel: "Full Integrated AtmosPOLE™",
  },
];

export default function ScrollFeatures() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Detect mobile viewport on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Natural scroll tracking: as the page scrolls down anywhere on screen (phone or desktop),
  // it locks to each feature smoothly through the full 600vh height before moving to the next section!
  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const windowH = window.innerHeight;
    const scrollableDistance = el.offsetHeight - windowH;
    const currentScrolled = -rect.top;

    if (scrollableDistance <= 0) return;

    // Progress 0 to 1 across the entire 600vh container
    const progress = Math.max(0, Math.min(1, currentScrolled / scrollableDistance));

    // Calculate active stage from 0 to 5
    const total = STAGES.length;
    const rawIndex = progress * total;
    const calculatedIndex = Math.min(total - 1, Math.max(0, Math.floor(rawIndex)));

    setActiveIdx(calculatedIndex);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Jump to specific feature on click
  const jumpToStage = (idx: number) => {
    const el = containerRef.current;
    if (!el) return;
    const scrollableDistance = el.offsetHeight - window.innerHeight;
    const targetScroll = el.offsetTop + (idx / (STAGES.length - 1)) * scrollableDistance;
    window.scrollTo({ top: targetScroll, behavior: "smooth" });
  };

  const current = STAGES[activeIdx] || STAGES[0];
  const activeScale = isMobile ? current.scaleMobile : current.scaleDesktop;

  return (
    <section
      ref={containerRef}
      id="features"
      className="relative bg-gradient-to-b from-slate-50 via-sky-50/20 to-white"
      /* 600vh height: 1 full viewport per feature stage.
         Ensures the user CANNOT accidentally swipe past the section on phone!
         They MUST travel through all 6 points from top to bottom before the next section appears! */
      style={{ height: "600vh" }}
    >
      {/* ── STICKY VIEWPORT: Stays locked to the screen while scrolling through the 600vh track ── */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between py-4 sm:py-6 px-4 sm:px-8 lg:px-12">
        
        {/* Ambient atmospheric backdrop lighting */}
        <div
          className="absolute inset-0 pointer-events-none transition-all duration-700 ease-out"
          style={{
            background: `radial-gradient(circle 500px at 45% 50%, ${current.accent}14, transparent 70%),
                         radial-gradient(circle 450px at 75% 30%, rgba(22, 163, 74, 0.05), transparent 70%)`,
          }}
        />

        {/* Top Header Bar with Milestone Indicators */}
        <div className="relative z-30 max-w-7xl mx-auto w-full flex items-center justify-between pb-2 sm:pb-3 border-b border-slate-200/70">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full animate-ping shrink-0"
              style={{ backgroundColor: current.accent }}
            />
            <span className="text-[11px] sm:text-xs font-bold tracking-widest text-slate-700 uppercase">
              AtmosPOLE™ Inspection · Point {activeIdx + 1} of {STAGES.length}
            </span>
          </div>

          {/* Quick-select milestone pills */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            {STAGES.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => jumpToStage(idx)}
                aria-label={`Jump to ${s.title}`}
                className={`transition-all duration-300 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                  idx === activeIdx
                    ? "w-7 sm:w-8 h-6 text-white shadow-xs"
                    : "w-5 sm:w-6 h-6 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
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

        {/* Central Stage: Desktop Split Screen / Mobile Vertical Stack */}
        <div className="relative z-20 flex-1 grid lg:grid-cols-12 gap-4 lg:gap-12 items-center max-w-7xl mx-auto w-full my-auto overflow-hidden">
          
          {/* ── POLE VIEWPORT: Focuses and Zooms to the Specific Component ── */}
          <div className="lg:col-span-7 h-[42vh] sm:h-[48vh] lg:h-[74vh] flex items-center justify-center relative overflow-hidden bg-white/50 rounded-2xl sm:rounded-3xl border border-slate-200/60 shadow-inner">
            
            {/* The Moving Pole Element — Zoom and Origin Shift */}
            <div
              className="relative w-full h-full flex items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                transformOrigin: `${current.originX}% ${current.originY}%`,
                transform: `scale(${activeScale})`,
              }}
            >
              <div className="relative w-36 sm:w-48 md:w-56 lg:w-72 h-[88%] flex items-center justify-center filter drop-shadow-[0_20px_35px_rgba(15,23,42,0.18)]">
                <Image
                  src="/atmospole-studio.png"
                  alt="AtmosPOLE™ Smart Urban Infrastructure"
                  width={422}
                  height={1024}
                  priority
                  className="w-full h-full object-contain"
                />

                {/* Reticle / Target ring on the specific component */}
                {current.reticleX !== undefined && current.reticleY !== undefined && current.id !== "full-pole" && (
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
                      className="relative block w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 bg-white/95 shadow-md flex items-center justify-center"
                      style={{ borderColor: current.accent }}
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: current.accent }}
                      />
                    </span>
                  </div>
                )}

                {/* Animated Mist Sprays when Left Mist Stage is Active */}
                {current.id === "mist-left" && (
                  <div className="absolute inset-0 pointer-events-none">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="absolute rounded-full blur-xs"
                        style={{
                          width: `${26 + i * 8}px`,
                          height: "7px",
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
                    className="absolute top-[8%] right-[-35%] w-[220px] h-[220px] pointer-events-none opacity-50 blur-xl"
                    style={{
                      background:
                        "radial-gradient(ellipse at 50% 0%, rgba(234, 179, 8, 0.5) 0%, transparent 70%)",
                    }}
                  />
                )}

                {/* Solar Irradiance Glow when Solar Stage is Active */}
                {current.id === "solar" && (
                  <div
                    className="absolute -top-[15%] left-[-20%] right-[-20%] h-[130px] pointer-events-none opacity-50 blur-lg"
                    style={{
                      background:
                        "radial-gradient(ellipse at 50% 50%, rgba(245, 158, 11, 0.6) 0%, transparent 60%)",
                    }}
                  />
                )}
              </div>
            </div>

            {/* Subtitle tag overlay */}
            <div className="absolute bottom-3 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-slate-200/80 text-[10px] font-mono font-semibold text-slate-700 shadow-xs">
              {current.reticleLabel}
            </div>
          </div>

          {/* ── TRANSLUCENT FLOATING CARD: Updates smoothly with each point ── */}
          <div className="lg:col-span-5 relative flex flex-col justify-center">
            
            <div
              key={current.id}
              className="glass-light rounded-2xl sm:rounded-3xl p-4 sm:p-7 lg:p-8 transition-all duration-500 shadow-xl border border-white/90 relative"
            >
              {/* Decorative top color bar */}
              <div
                className="absolute top-0 left-6 right-6 h-1 rounded-b-full transition-colors duration-500"
                style={{ backgroundColor: current.accent }}
              />

              {/* Category Pill & Step Counter */}
              <div className="flex items-center justify-between mb-2 sm:mb-3 pt-1">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold tracking-wider uppercase ${current.badgeBg} ${current.badgeText}`}
                >
                  {current.category}
                </span>
                <span className="text-[11px] sm:text-xs font-mono font-semibold text-slate-400">
                  {current.stepNum} of 06
                </span>
              </div>

              {/* Title */}
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight leading-snug mb-2 sm:mb-3">
                {current.title}
              </h3>

              {/* Trimmed Description */}
              <p className="text-xs sm:text-sm lg:text-base text-slate-600 leading-relaxed mb-4 sm:mb-5">
                {current.description}
              </p>

              {/* Punchy Highlight Pill */}
              <div
                className="rounded-xl px-3.5 py-2.5 sm:py-3 flex items-start gap-2.5 border transition-colors"
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

              {/* Quick Arrow Nav for manual clicking */}
              <div className="flex items-center justify-between mt-4 sm:mt-5 pt-3 border-t border-slate-200/80 text-xs">
                <button
                  onClick={() => jumpToStage(Math.max(0, activeIdx - 1))}
                  disabled={activeIdx === 0}
                  className={`flex items-center gap-1 font-semibold ${
                    activeIdx === 0
                      ? "text-slate-300 cursor-not-allowed"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
                    <path d="M10 13l-5-5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Prev</span>
                </button>

                <span className="text-[10px] sm:text-[11px] font-mono text-slate-400">
                  Scroll down for next
                </span>

                <button
                  onClick={() => jumpToStage(Math.min(STAGES.length - 1, activeIdx + 1))}
                  disabled={activeIdx === STAGES.length - 1}
                  className={`flex items-center gap-1 font-semibold ${
                    activeIdx === STAGES.length - 1
                      ? "text-slate-300 cursor-not-allowed"
                      : "text-slate-900 hover:text-[#c8102e]"
                  }`}
                >
                  <span>Next</span>
                  <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
                    <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>

            </div>

          </div>

        </div>

        {/* Bottom Status Bar */}
        <div className="relative z-30 max-w-7xl mx-auto w-full flex items-center justify-between text-[10px] sm:text-xs text-slate-400 pt-2 border-t border-slate-200/70 font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            Scroll anywhere on screen to journey through all 6 points
          </span>
          <span className="font-mono text-slate-500 shrink-0">
            {activeIdx === STAGES.length - 1 ? "Inspection Complete" : `Step ${activeIdx + 1} of 6`}
          </span>
        </div>

      </div>
    </section>
  );
}
