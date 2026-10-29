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
  // Choreography: where does the pole sit, and where is the text?
  // "center" | "left" (pole on left, text on right) | "right" (pole on right, text on left)
  layout: "center" | "left" | "right";
  // Camera transform parameters on the 422x1024 pole image
  originX: number; // percentage
  originY: number; // percentage
  scaleDesktop: number;
  scaleMobile: number;
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
      "Mounted at the very crown of the AtmosPOLE™, the high-efficiency monocrystalline solar array harvests daylight to power lighting, misting, sensors, and display with zero operating grid electricity cost.",
    highlightText: "100% self-powered by daylight with integrated overnight battery reserve",
    layout: "center",
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
      "Cantilevered roadway luminaires feature high-output optical LED clusters designed to provide wide, uniform carriageway and pedestrian sidewalk coverage, replacing conventional streetlights 1-to-1.",
    highlightText: "Full roadway lighting standards powered entirely by clean solar energy",
    layout: "left", // Pole moves left, text on the right
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
    layout: "right", // Pole moves right, text on the left
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
      "Dual optical laser particulate sensors measure air quality in real time: tracking incoming ambient polluted air vs. the purified air after misting, streaming verified telemetry every 5 minutes.",
    highlightText: "Uncompromised transparency: ambient intake vs. clean treated output",
    layout: "left", // Pole moves left, text on the right
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
    layout: "right", // Pole moves right, text on the left
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
    layout: "center", // Pole returns to center, zoomed out completely
    originX: 50,
    originY: 50,
    scaleDesktop: 1.0,
    scaleMobile: 1.0,
    reticleLabel: "Full Integrated AtmosPOLE™",
  },
];

export default function ScrollFeatures() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const isTransitioningRef = useRef<boolean>(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Realtime single-scroll navigation:
  // 1 scroll gesture = exactly 1 feature advance!
  // At the boundary (stage 0 scrolling up or stage 5 scrolling down), natural page scrolling continues!
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      const rect = el.getBoundingClientRect();
      const inView = rect.top <= 80 && rect.bottom >= window.innerHeight - 80;

      if (!inView) return;

      // Allow natural scroll up when on first stage and scrolling up
      if (activeIdx === 0 && e.deltaY < 0) return;
      // Allow natural scroll down when on last stage and scrolling down
      if (activeIdx === STAGES.length - 1 && e.deltaY > 0) return;

      // Intercept and advance 1 stage in real time
      e.preventDefault();

      if (isTransitioningRef.current) return;
      if (Math.abs(e.deltaY) < 15) return;

      isTransitioningRef.current = true;
      if (e.deltaY > 0) {
        setActiveIdx((prev) => Math.min(STAGES.length - 1, prev + 1));
      } else {
        setActiveIdx((prev) => Math.max(0, prev - 1));
      }

      setTimeout(() => {
        isTransitioningRef.current = false;
      }, 500);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [activeIdx]);

  // Touch swipe support for mobile: 1 swipe = 1 feature
  const touchStartY = useRef<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const diff = touchStartY.current - e.changedTouches[0].clientY;

    if (Math.abs(diff) > 35) {
      if (diff > 0 && activeIdx < STAGES.length - 1) {
        // Swipe up -> next feature
        setActiveIdx((prev) => Math.min(STAGES.length - 1, prev + 1));
      } else if (diff < 0 && activeIdx > 0) {
        // Swipe down -> prev feature
        setActiveIdx((prev) => Math.max(0, prev - 1));
      }
    }
    touchStartY.current = null;
  };

  const current = STAGES[activeIdx] || STAGES[0];
  const activeScale = isMobile ? current.scaleMobile : current.scaleDesktop;

  // Calculate pole horizontal translation:
  // "center" -> 0%
  // "left"   -> move pole to the left so text fits on the right
  // "right"  -> move pole to the right so text fits on the left
  let poleTranslateX = "0%";
  if (!isMobile) {
    if (current.layout === "left") poleTranslateX = "-22%";
    if (current.layout === "right") poleTranslateX = "22%";
  }

  return (
    <section
      ref={sectionRef}
      id="features"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      /* One unified, clean section canvas: no boxed placeholders */
      className="relative min-h-screen py-8 sm:py-12 px-4 sm:px-8 lg:px-12 bg-gradient-to-b from-slate-50 via-sky-50/20 to-white flex flex-col justify-between overflow-hidden"
    >
      {/* Ambient background glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-700 ease-out"
        style={{
          background: `radial-gradient(circle 600px at 50% 50%, ${current.accent}12, transparent 70%)`,
        }}
      />

      {/* ── TOP HEADER: Milestone tracker & Quick selection ── */}
      <div className="relative z-30 max-w-7xl mx-auto w-full flex items-center justify-between pb-3 border-b border-slate-200/60">
        <div className="flex items-center gap-2.5">
          <span
            className="w-2.5 h-2.5 rounded-full animate-ping shrink-0"
            style={{ backgroundColor: current.accent }}
          />
          <span className="text-xs font-bold tracking-widest text-slate-700 uppercase">
            AtmosPOLE™ Inspection · Point {activeIdx + 1} of {STAGES.length}
          </span>
        </div>

        {/* Milestone Pills */}
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

      {/* ── UNIFIED STAGE CANVAS: POLE AND TEXT FLOWING SEAMLESSLY (NO BOXES) ── */}
      <div className="relative z-20 flex-1 max-w-7xl mx-auto w-full flex items-center justify-center my-auto py-4">
        
        {/* Full-width container where the pole moves left/right and text flows dynamically */}
        <div className="relative w-full h-[65vh] sm:h-[72vh] flex items-center justify-center">
          
          {/* ── THE POLE: Moves Center -> Left -> Right -> Left -> Right -> Center ── */}
          <div
            className="absolute inset-0 flex items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none"
            style={{
              transform: `translateX(${poleTranslateX})`,
            }}
          >
            {/* Pole Zoom & Origin Shift */}
            <div
              className="relative w-full h-full flex items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                transformOrigin: `${current.originX}% ${current.originY}%`,
                transform: `scale(${activeScale})`,
              }}
            >
              <div className="relative w-40 sm:w-52 md:w-64 lg:w-72 h-[88%] flex items-center justify-center filter drop-shadow-[0_25px_40px_rgba(15,23,42,0.18)]">
                <Image
                  src="/atmospole-studio.png"
                  alt="AtmosPOLE™ Smart Urban Infrastructure"
                  width={422}
                  height={1024}
                  priority
                  className="w-full h-full object-contain"
                />

                {/* Target reticle directly on the focused component */}
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
                          width: `${28 + i * 8}px`,
                          height: "7px",
                          background: "rgba(2, 132, 199, 0.45)",
                          top: `${26 + i * 4}%`,
                          left: "-24%",
                          animation: `mistDriftL 1.8s infinite ease-out`,
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* LED Beam Glow when Right Lamp Stage is Active */}
                {current.id === "lamp-right" && (
                  <div
                    className="absolute top-[8%] right-[-35%] w-[240px] h-[240px] pointer-events-none opacity-50 blur-xl"
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
          </div>

          {/* ── SEAMLESS FLOATING TEXT (NO PLACEHOLDER BOXES) ── */}
          {/*
              Positioning rules:
              - If current.layout === "left"  -> text sits on the RIGHT
              - If current.layout === "right" -> text sits on the LEFT
              - If current.layout === "center" (Solar & Complete Pole) -> text sits beside or below
              - On mobile -> elegant overlay at bottom with backdrop blur
          */}
          <div
            className={`absolute z-30 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] max-w-md pointer-events-auto ${
              isMobile
                ? "bottom-0 inset-x-0 mx-auto px-4"
                : current.layout === "left"
                ? "right-4 lg:right-8 top-1/2 -translate-y-1/2 text-left"
                : current.layout === "right"
                ? "left-4 lg:left-8 top-1/2 -translate-y-1/2 text-left"
                : activeIdx === 0
                ? "right-4 lg:right-12 top-1/2 -translate-y-1/2 text-left"
                : "right-4 lg:right-12 top-1/2 -translate-y-1/2 text-left"
            }`}
          >
            <div
              key={current.id}
              className="p-4 sm:p-6 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 shadow-lg"
            >
              {/* Category Pill & Step Counter */}
              <div className="flex items-center gap-2.5 mb-2">
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
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight leading-snug mb-2">
                {current.title}
              </h3>

              {/* Trimmed Description */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                {current.description}
              </p>

              {/* Highlight Pill */}
              <div
                className="rounded-xl px-3.5 py-2 flex items-start gap-2 border transition-colors"
                style={{
                  backgroundColor: `${current.accent}0d`,
                  borderColor: `${current.accent}25`,
                }}
              >
                <div
                  className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                  style={{ backgroundColor: current.accent }}
                />
                <span className="text-[11px] sm:text-xs font-semibold text-slate-800 leading-snug">
                  {current.highlightText}
                </span>
              </div>

              {/* Quick Nav Arrows */}
              <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-200/60 text-xs">
                <button
                  onClick={() => setActiveIdx((prev) => Math.max(0, prev - 1))}
                  disabled={activeIdx === 0}
                  className={`flex items-center gap-1 font-semibold ${
                    activeIdx === 0 ? "text-slate-300 cursor-not-allowed" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
                    <path d="M10 13l-5-5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Prev</span>
                </button>

                <span className="text-[10px] font-mono text-slate-400">
                  Scroll or swipe to advance
                </span>

                <button
                  onClick={() => setActiveIdx((prev) => Math.min(STAGES.length - 1, prev + 1))}
                  disabled={activeIdx === STAGES.length - 1}
                  className={`flex items-center gap-1 font-semibold ${
                    activeIdx === STAGES.length - 1 ? "text-slate-300 cursor-not-allowed" : "text-slate-900 hover:text-[#c8102e]"
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

      </div>

      {/* ── BOTTOM STATUS BAR ── */}
      <div className="relative z-30 max-w-7xl mx-auto w-full flex items-center justify-between text-[10px] sm:text-xs text-slate-500 pt-2 border-t border-slate-200/60 font-medium">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
          1 scroll gesture moves to the next feature in real time
        </span>
        <span className="font-mono text-slate-500 shrink-0">
          {activeIdx === STAGES.length - 1 ? "Complete Pole View" : `Step ${activeIdx + 1} of 6`}
        </span>
      </div>

    </section>
  );
}
