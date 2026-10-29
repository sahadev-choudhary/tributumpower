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
  // Precise percentage coordinates on the 422x1024 pole image
  originX: number; // percentage (0 - 100)
  originY: number; // percentage (0 - 100)
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
      "Mounted at the crown of the pole, the monocrystalline solar array harvests daylight to power lighting, CCTV, misting, sensors, and display with zero operating grid electricity cost.",
    highlightText: "100% self-powered by daylight with integrated overnight battery reserve",
    originX: 50,
    originY: 4,
    scaleDesktop: 2.5,
    scaleMobile: 2.0,
    reticleX: 50,
    reticleY: 4,
    reticleLabel: "Crown Solar Array",
  },
  {
    id: "luminaire",
    stepNum: "02",
    category: "STREET ILLUMINATION",
    title: "High-Lumen Optical LED Luminaire",
    accent: "#ca8a04",
    badgeBg: "bg-yellow-100",
    badgeText: "text-yellow-800",
    description:
      "Cantilevered roadway luminaire features high-output optical LED clusters engineered for wide, uniform carriageway and pedestrian coverage, replacing standard streetlights 1-to-1.",
    highlightText: "Full roadway illumination standards powered entirely by clean solar energy",
    originX: 76,
    originY: 10.2,
    scaleDesktop: 2.6,
    scaleMobile: 2.1,
    reticleX: 76,
    reticleY: 10.2,
    reticleLabel: "Roadway LED Luminaire",
  },
  {
    id: "cctv",
    stepNum: "03",
    category: "SMART CITY SECURITY",
    title: "Integrated CCTV Surveillance",
    accent: "#4f46e5",
    badgeBg: "bg-indigo-100",
    badgeText: "text-indigo-800",
    description:
      "Mounted centrally right below the solar crown, the high-definition smart camera provides 24/7 roadway and pedestrian security oversight without requiring separate dedicated surveillance poles.",
    highlightText: "Direct feed integration for Smart City Command Centres (ICCC) and traffic safety",
    originX: 50,
    originY: 10,
    scaleDesktop: 2.8,
    scaleMobile: 2.3,
    reticleX: 50,
    reticleY: 9.8,
    reticleLabel: "HD Security Camera",
  },
  {
    id: "mist",
    stepNum: "04",
    category: "AIR PURIFICATION",
    title: "Active Mist Smog Suppression",
    accent: "#0284c7",
    badgeBg: "bg-sky-100",
    badgeText: "text-sky-800",
    description:
      "Micro-fine mist nozzles atomize water droplets into the air. These microscopic droplets collide with toxic PM2.5 and PM10 smog particles, weighing them down and washing the air clean right where citizens breathe.",
    highlightText: "Chemical-free particulate knock-down active on both sides of the pole",
    originX: 23,
    originY: 27,
    scaleDesktop: 2.6,
    scaleMobile: 2.1,
    reticleX: 23,
    reticleY: 27,
    reticleLabel: "Mist Suppression Nozzles",
  },
  {
    id: "sensors",
    stepNum: "05",
    category: "CONTINUOUS MONITORING",
    title: "Dual Air Quality Sensors",
    accent: "#dc2626",
    badgeBg: "bg-rose-100",
    badgeText: "text-rose-800",
    description:
      "Dual optical laser particulate sensors measure air quality in real time: tracking incoming ambient polluted air vs. the purified air after misting, streaming verified telemetry every 5 minutes.",
    highlightText: "Uncompromised transparency: ambient intake vs. clean treated output",
    originX: 50,
    originY: 22,
    scaleDesktop: 2.5,
    scaleMobile: 2.0,
    reticleX: 50,
    reticleY: 22,
    reticleLabel: "Intake Sensors & Vents",
  },
  {
    id: "screen",
    stepNum: "06",
    category: "CITIZEN TRANSPARENCY",
    title: "Public Digital Display",
    accent: "#7c3aed",
    badgeBg: "bg-violet-100",
    badgeText: "text-violet-800",
    description:
      "A tall, sunlight-readable portrait screen displays live PM2.5 and PM10 numbers, the Air Pulse™ Index, and total cubic feet of cleaned air — giving every citizen direct awareness without needing an app.",
    highlightText: "Real-time contrast: Ambient Unhealthy (125) vs. Treated Clean (4.16)",
    originX: 50,
    originY: 51,
    scaleDesktop: 2.2,
    scaleMobile: 1.8,
    reticleX: 50,
    reticleY: 51,
    reticleLabel: "Live Public Display",
  },
  {
    id: "full-pole",
    stepNum: "07",
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
  const stickyRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const activeIdxRef = useRef<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const lastStepTimeRef = useRef<number>(0);
  const touchStartYRef = useRef<number | null>(null);
  const touchStartXRef = useRef<number | null>(null);

  useEffect(() => {
    activeIdxRef.current = activeIdx;
  }, [activeIdx]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Jump to specific stage
  const jumpToStage = useCallback((idx: number) => {
    const targetIdx = Math.max(0, Math.min(STAGES.length - 1, idx));
    setActiveIdx(targetIdx);
    activeIdxRef.current = targetIdx;

    const el = containerRef.current;
    if (!el) return;
    const scrollableDistance = el.offsetHeight - window.innerHeight;
    if (scrollableDistance > 0) {
      const targetScroll = el.offsetTop + (targetIdx / (STAGES.length - 1)) * scrollableDistance;
      window.scrollTo({ top: targetScroll, behavior: "smooth" });
    }
  }, []);

  // Sync index with scroll position when scrolling naturally
  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const windowH = window.innerHeight;
    const scrollableDistance = el.offsetHeight - windowH;
    const currentScrolled = -rect.top;

    if (scrollableDistance <= 0) return;

    const progress = Math.max(0, Math.min(1, currentScrolled / scrollableDistance));
    const total = STAGES.length;
    const rawIndex = progress * total;
    const calculatedIndex = Math.min(total - 1, Math.max(0, Math.floor(rawIndex)));

    setActiveIdx(calculatedIndex);
    activeIdxRef.current = calculatedIndex;
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // ── NON-PASSIVE TOUCH & WHEEL PINNING LOCK ──────────────────────────────
  // Prevents mobile screen from flinging past before all 7 features are seen.
  // Each swipe up/down cleanly steps through features one by one!
  useEffect(() => {
    const stickyEl = stickyRef.current;
    if (!stickyEl) return;

    const COOLDOWN_MS = 380;

    const onTouchStart = (e: TouchEvent) => {
      touchStartYRef.current = e.touches[0].clientY;
      touchStartXRef.current = e.touches[0].clientX;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (touchStartYRef.current === null) return;
      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const windowH = window.innerHeight;
      const isPinned = rect.top <= 15 && rect.bottom >= windowH - 15;
      if (!isPinned) return;

      const currentY = e.touches[0].clientY;
      const currentX = e.touches[0].clientX;
      const diffY = touchStartYRef.current - currentY; // positive = swipe up (scroll down)
      const diffX = (touchStartXRef.current ?? currentX) - currentX;

      if (Math.abs(diffX) > Math.abs(diffY)) return;

      const now = Date.now();

      if (diffY > 18) {
        // Swiping UP -> next feature
        if (activeIdxRef.current < STAGES.length - 1) {
          if (e.cancelable) e.preventDefault();
          if (now - lastStepTimeRef.current > COOLDOWN_MS) {
            lastStepTimeRef.current = now;
            touchStartYRef.current = currentY;
            jumpToStage(activeIdxRef.current + 1);
          }
        }
      } else if (diffY < -18) {
        // Swiping DOWN -> previous feature
        if (activeIdxRef.current > 0) {
          if (e.cancelable) e.preventDefault();
          if (now - lastStepTimeRef.current > COOLDOWN_MS) {
            lastStepTimeRef.current = now;
            touchStartYRef.current = currentY;
            jumpToStage(activeIdxRef.current - 1);
          }
        }
      }
    };

    const onTouchEnd = () => {
      touchStartYRef.current = null;
      touchStartXRef.current = null;
    };

    const onWheel = (e: WheelEvent) => {
      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const windowH = window.innerHeight;
      const isPinned = rect.top <= 15 && rect.bottom >= windowH - 15;
      if (!isPinned) return;

      const now = Date.now();

      if (e.deltaY > 15) {
        if (activeIdxRef.current < STAGES.length - 1) {
          if (e.cancelable) e.preventDefault();
          if (now - lastStepTimeRef.current > COOLDOWN_MS) {
            lastStepTimeRef.current = now;
            jumpToStage(activeIdxRef.current + 1);
          }
        }
      } else if (e.deltaY < -15) {
        if (activeIdxRef.current > 0) {
          if (e.cancelable) e.preventDefault();
          if (now - lastStepTimeRef.current > COOLDOWN_MS) {
            lastStepTimeRef.current = now;
            jumpToStage(activeIdxRef.current - 1);
          }
        }
      }
    };

    stickyEl.addEventListener("touchstart", onTouchStart, { passive: true });
    stickyEl.addEventListener("touchmove", onTouchMove, { passive: false });
    stickyEl.addEventListener("touchend", onTouchEnd, { passive: true });
    stickyEl.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      stickyEl.removeEventListener("touchstart", onTouchStart);
      stickyEl.removeEventListener("touchmove", onTouchMove);
      stickyEl.removeEventListener("touchend", onTouchEnd);
      stickyEl.removeEventListener("wheel", onWheel);
    };
  }, [jumpToStage]);

  const current = STAGES[activeIdx] || STAGES[0];
  const activeScale = isMobile ? current.scaleMobile : current.scaleDesktop;

  return (
    <section
      ref={containerRef}
      id="features"
      className="relative bg-gradient-to-b from-slate-50 via-sky-50/20 to-white"
      style={{ height: "420vh" }}
    >
      {/* ── STICKY VIEWPORT: Pinned on screen throughout all 7 stages ── */}
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between py-3 sm:py-5 px-4 sm:px-8 lg:px-12 select-none"
      >
        {/* Ambient atmospheric backdrop lighting */}
        <div
          className="absolute inset-0 pointer-events-none transition-all duration-700 ease-out"
          style={{
            background: `radial-gradient(circle 500px at 45% 50%, ${current.accent}14, transparent 70%),
                         radial-gradient(circle 450px at 75% 30%, rgba(22, 163, 74, 0.05), transparent 70%)`,
          }}
        />

        {/* ── TOP HEADER BAR: Milestone Navigation ── */}
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

        {/* ── CENTRAL STAGE: TWO SEPARATE GRID COLUMNS (POLE BESIDE TEXT) ── */}
        <div className="relative z-20 flex-1 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-6 lg:gap-10 items-center my-auto overflow-hidden">
          
          {/* ── COLUMN 1 (Left 7 Cols on Desktop / Top Half on Mobile): THE POLE ── */}
          <div className="lg:col-span-7 h-[42vh] sm:h-[48vh] lg:h-[72vh] w-full flex items-center justify-center relative overflow-hidden bg-white/40 rounded-2xl sm:rounded-3xl border border-slate-200/60 shadow-inner">
            
            {/* Direct aspect-ratio Pole Wrapper — 100% 1-to-1 coordinate alignment */}
            <div
              className="relative h-[90%] max-w-[90%] aspect-[422/1024] flex items-center justify-center filter drop-shadow-[0_20px_35px_rgba(15,23,42,0.18)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                transformOrigin: `${current.originX}% ${current.originY}%`,
                transform: `scale(${activeScale})`,
              }}
            >
              <Image
                src="/atmospole-studio.png"
                alt="AtmosPOLE™ Smart Urban Infrastructure"
                fill
                priority
                sizes="(max-width: 1024px) 50vw, 30vw"
                className="object-contain"
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

              {/* CCTV Scan Line / Pulse Glow when CCTV Stage is Active */}
              {current.id === "cctv" && (
                <div
                  className="absolute top-[8.5%] left-[36%] right-[36%] h-[24px] rounded-full pointer-events-none opacity-60 animate-pulse"
                  style={{
                    boxShadow: "0 0 25px rgba(79, 70, 229, 0.8)",
                  }}
                />
              )}

              {/* Animated Mist Sprays when Mist Stage is Active */}
              {current.id === "mist" && (
                <div className="absolute inset-0 pointer-events-none">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="absolute rounded-full blur-xs"
                      style={{
                        width: `${26 + i * 8}px`,
                        height: "7px",
                        background: "rgba(2, 132, 199, 0.45)",
                        top: `${24 + i * 3}%`,
                        left: "-18%",
                        animation: `mistDriftL 1.8s infinite ease-out`,
                      }}
                    />
                  ))}
                </div>
              )}

              {/* LED Beam Glow when Luminaire Stage is Active */}
              {current.id === "luminaire" && (
                <div
                  className="absolute top-[8%] right-[-20%] w-[180px] h-[180px] pointer-events-none opacity-50 blur-xl"
                  style={{
                    background:
                      "radial-gradient(ellipse at 50% 0%, rgba(234, 179, 8, 0.6) 0%, transparent 70%)",
                  }}
                />
              )}

              {/* Solar Irradiance Glow when Solar Stage is Active */}
              {current.id === "solar" && (
                <div
                  className="absolute -top-[12%] left-[10%] right-[10%] h-[90px] pointer-events-none opacity-50 blur-lg"
                  style={{
                    background:
                      "radial-gradient(ellipse at 50% 50%, rgba(245, 158, 11, 0.6) 0%, transparent 60%)",
                  }}
                />
              )}
            </div>

            {/* Tag overlay for active component */}
            <div className="absolute bottom-3 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-slate-200/80 text-[10px] font-mono font-semibold text-slate-700 shadow-xs">
              {current.reticleLabel}
            </div>
          </div>

          {/* ── COLUMN 2 (Right 5 Cols on Desktop / Bottom Half on Mobile): THE TEXT ── */}
          <div className="lg:col-span-5 w-full flex flex-col justify-center">
            
            <div
              key={current.id}
              className="p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl bg-white/85 backdrop-blur-md border border-white/90 shadow-xl transition-all duration-500 relative"
            >
              {/* Decorative top color bar */}
              <div
                className="absolute top-0 left-6 right-6 h-1 rounded-b-full transition-colors duration-500"
                style={{ backgroundColor: current.accent }}
              />

              {/* Category Pill & Step Counter */}
              <div className="flex items-center justify-between mb-1.5 sm:mb-3 pt-1">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold tracking-wider uppercase ${current.badgeBg} ${current.badgeText}`}
                >
                  {current.category}
                </span>
                <span className="text-[11px] sm:text-xs font-mono font-semibold text-slate-400">
                  {current.stepNum} of 07
                </span>
              </div>

              {/* Title */}
              <h3 className="text-lg sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight leading-snug mb-1.5 sm:mb-3">
                {current.title}
              </h3>

              {/* Description */}
              <p className="text-xs sm:text-sm lg:text-base text-slate-600 leading-relaxed mb-2.5 sm:mb-4">
                {current.description}
              </p>

              {/* Punchy Highlight Pill */}
              <div
                className="rounded-xl px-3.5 py-2 sm:py-2.5 flex items-start gap-2.5 border transition-colors mb-2.5 sm:mb-4"
                style={{
                  backgroundColor: `${current.accent}0d`,
                  borderColor: `${current.accent}25`,
                }}
              >
                <div
                  className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                  style={{ backgroundColor: current.accent }}
                />
                <span className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
                  {current.highlightText}
                </span>
              </div>

              {/* Quick Arrow Nav for manual clicking / tapping */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-200/80 text-xs">
                <button
                  onClick={() => jumpToStage(activeIdx - 1)}
                  disabled={activeIdx === 0}
                  className={`flex items-center gap-1 font-semibold px-2 py-1 rounded-md transition-colors ${
                    activeIdx === 0
                      ? "text-slate-300 cursor-not-allowed"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
                    <path d="M10 13l-5-5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Prev</span>
                </button>

                <span className="text-[10px] sm:text-[11px] font-mono text-slate-400">
                  Swipe / scroll for next
                </span>

                <button
                  onClick={() => jumpToStage(activeIdx + 1)}
                  disabled={activeIdx === STAGES.length - 1}
                  className={`flex items-center gap-1 font-semibold px-2 py-1 rounded-md transition-colors ${
                    activeIdx === STAGES.length - 1
                      ? "text-slate-300 cursor-not-allowed"
                      : "text-slate-900 hover:text-[#c8102e] hover:bg-slate-100"
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

        {/* ── BOTTOM STATUS BAR ── */}
        <div className="relative z-30 max-w-7xl mx-auto w-full flex items-center justify-between text-[10px] sm:text-xs text-slate-400 pt-1.5 sm:pt-2 border-t border-slate-200/70 font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            Scroll anywhere on screen to journey through all 7 points
          </span>
          <span className="font-mono text-slate-500 shrink-0">
            {activeIdx === STAGES.length - 1 ? "Complete Pole View" : `Step ${activeIdx + 1} of 7`}
          </span>
        </div>

      </div>
    </section>
  );
}
