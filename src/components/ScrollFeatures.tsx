"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// ── CONFIGURATION & FRAME MANIFEST ──────────────────────────────────────────
const TOTAL_FRAMES = 480;
const FRAME_WIDTH = 1280;
const FRAME_HEIGHT = 720;
const SCROLL_DISTANCE_VH = 450; // Configurable scroll track height (in vh)
const MAX_CACHE_SIZE = 90; // Bounded memory cache: keeps nearest frames decoded
const CONCURRENT_DOWNLOADS = 6;

const getFrameUrl = (index: number): string => {
  const clamped = Math.max(0, Math.min(TOTAL_FRAMES - 1, index));
  const pad = String(clamped + 1).padStart(5, "0");
  return `/Pole Sequence/${pad}.jpg`;
};

// ── 5 CINEMATIC FEATURE STAGES CORRESPONDING TO 3D CAMERA MOTION ────────────
interface FeatureStage {
  id: string;
  stepNum: string;
  frameStart: number;
  frameEnd: number;
  category: string;
  title: string;
  accent: string;
  description: string;
  highlightText: string;
}

const STAGES: FeatureStage[] = [
  {
    id: "solar",
    stepNum: "01",
    frameStart: 0,
    frameEnd: 90,
    category: "TOP CROWN",
    title: "Monocrystalline Solar Crown",
    accent: "#f59e0b",
    description:
      "Mounted at the crown of AtmosPOLE™, the high-efficiency solar array harvests daylight to power illumination, misting, and continuous telemetry with zero operating grid electricity bills.",
    highlightText: "100% self-powered by daylight with integrated overnight battery reserve",
  },
  {
    id: "luminaire-mesh",
    stepNum: "02",
    frameStart: 91,
    frameEnd: 175,
    category: "STREET ILLUMINATION & COMMS",
    title: "Optical LED Luminaire & Mesh Node",
    accent: "#eab308",
    description:
      "Cantilevered roadway luminaires deliver wide, uniform carriageway and pedestrian sidewalk coverage, coupled with encrypted municipal IoT mesh node connectivity for smart city systems.",
    highlightText: "Full roadway illumination standards replacing conventional streetlights 1-to-1",
  },
  {
    id: "mist-cctv",
    stepNum: "03",
    frameStart: 176,
    frameEnd: 265,
    category: "AIR PURIFICATION & SECURITY",
    title: "Active Mist Suppression & 24/7 CCTV",
    accent: "#06b6d4",
    description:
      "Micro-fine mist nozzles atomize water droplets that collide with toxic PM2.5 and PM10 particles, washing the air clean right where citizens breathe, backed by a 24/7 smart security camera.",
    highlightText: "Chemical-free particulate knock-down with integrated municipal surveillance",
  },
  {
    id: "telemetry-display",
    stepNum: "04",
    frameStart: 266,
    frameEnd: 365,
    category: "CONTINUOUS TELEMETRY",
    title: "Dual Laser Sensors & Public Display",
    accent: "#10b981",
    description:
      "Dual optical laser sensors track ambient intake vs. clean treated air every 5 minutes, streaming verified telemetry to a tall, sunlight-readable portrait screen for public transparency.",
    highlightText: "Real-time citizen contrast: Ambient Unhealthy vs. Treated Clean air",
  },
  {
    id: "full-pole",
    stepNum: "05",
    frameStart: 366,
    frameEnd: 479,
    category: "UNIFIED URBAN ASSET",
    title: "The Complete Smart Pole",
    accent: "#3b82f6",
    description:
      "From solar crown down to the rugged bolted base, AtmosPOLE™ consolidates six vital urban capabilities into one elegant architectural column ready for India's 100+ Smart Cities.",
    highlightText: "Standard footprint. Six integrated smart capabilities. Zero road redesign.",
  },
];

export default function ScrollFeatures() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [activeStageIdx, setActiveStageIdx] = useState<number>(0);
  const [currentFrameNum, setCurrentFrameNum] = useState<number>(1);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [initialLoaded, setInitialLoaded] = useState<boolean>(false);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  // Animation & cache state refs
  const currentFrameRef = useRef<number>(0);
  const targetFrameRef = useRef<number>(0);
  const activeDownloadsRef = useRef<Set<number>>(new Set());
  const imageCacheRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const cacheOrderRef = useRef<number[]>([]);
  const lastDrawnFrameRef = useRef<number>(-1);
  const rafIdRef = useRef<number | null>(null);

  // ── DETECT VIEWPORT & MOTION PREFERENCE ──────────────────────────────────
  useEffect(() => {
    const checkViewport = () => {
      const mobile = window.innerWidth < 1024 || window.innerHeight > window.innerWidth;
      setIsMobile(mobile);
    };

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handleMotionChange);

    checkViewport();
    window.addEventListener("resize", checkViewport);

    return () => {
      window.removeEventListener("resize", checkViewport);
      mediaQuery.removeEventListener("change", handleMotionChange);
    };
  }, []);

  // ── IMAGE LOADER WITH BOUNDED LRU CACHE ──────────────────────────────────
  const requestFrame = useCallback((index: number): Promise<HTMLImageElement | null> => {
    const cache = imageCacheRef.current;
    if (cache.has(index)) {
      // Refresh LRU order
      const order = cacheOrderRef.current;
      const idx = order.indexOf(index);
      if (idx > -1) order.splice(idx, 1);
      order.push(index);
      return Promise.resolve(cache.get(index)!);
    }

    if (activeDownloadsRef.current.has(index)) {
      return Promise.resolve(null);
    }

    if (activeDownloadsRef.current.size >= CONCURRENT_DOWNLOADS) {
      return Promise.resolve(null);
    }

    activeDownloadsRef.current.add(index);

    return new Promise((resolve) => {
      const img = new window.Image();
      img.src = getFrameUrl(index);

      img.onload = () => {
        activeDownloadsRef.current.delete(index);
        cache.set(index, img);
        cacheOrderRef.current.push(index);

        // Evict oldest if exceeding bounded cache size
        while (cacheOrderRef.current.length > MAX_CACHE_SIZE) {
          const oldest = cacheOrderRef.current.shift();
          if (oldest !== undefined && oldest !== 0 && oldest !== Math.round(targetFrameRef.current)) {
            cache.delete(oldest);
          }
        }
        resolve(img);
      };

      img.onerror = () => {
        activeDownloadsRef.current.delete(index);
        resolve(null);
      };
    });
  }, []);

  // ── INITIAL PRELOAD (FIRST FRAME + STRATEGIC KEYFRAMES) ──────────────────
  useEffect(() => {
    // 1. Load First Frame with top priority
    const firstImg = new window.Image();
    firstImg.src = getFrameUrl(0);
    firstImg.onload = () => {
      imageCacheRef.current.set(0, firstImg);
      cacheOrderRef.current.push(0);
      setInitialLoaded(true);
    };

    // 2. Preload strategic keyframes across the sequence
    const keyframes = [0, 60, 120, 180, 240, 300, 360, 420, 479];
    keyframes.forEach((f) => {
      if (f !== 0) requestFrame(f);
    });
  }, [requestFrame]);

  // ── PRIORITY PROGRESSIVE LOADER AROUND CURRENT PLAYHEAD ──────────────────
  const updatePreloadWindow = useCallback(
    (centerFrame: number) => {
      // Prioritize nearby frames (ahead and behind)
      const preloadRange = isMobile ? 12 : 24;
      const start = Math.max(0, centerFrame - 6);
      const end = Math.min(TOTAL_FRAMES - 1, centerFrame + preloadRange);

      for (let i = start; i <= end; i++) {
        if (!imageCacheRef.current.has(i)) {
          requestFrame(i);
        }
      }
    },
    [isMobile, requestFrame]
  );

  // ── DRAW FRAME ONTO CANVAS ───────────────────────────────────────────────
  const drawFrameToCanvas = useCallback(
    (frameIndex: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d", { alpha: false });
      if (!ctx) return;

      const cache = imageCacheRef.current;
      let img = cache.get(frameIndex);

      // Graceful fallback: find nearest available loaded frame
      if (!img) {
        let minDist = Infinity;
        let nearestIndex = -1;
        for (const [idx, loadedImg] of cache.entries()) {
          const dist = Math.abs(idx - frameIndex);
          if (dist < minDist) {
            minDist = dist;
            nearestIndex = idx;
            img = loadedImg;
          }
        }
      }

      if (!img || !img.complete || img.naturalWidth === 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const displayW = canvas.clientWidth;
      const displayH = canvas.clientHeight;

      if (displayW === 0 || displayH === 0) return;

      // Adjust backing buffer resolution to match display size * capped dpr
      const targetBufferW = Math.round(displayW * dpr);
      const targetBufferH = Math.round(displayH * dpr);

      if (canvas.width !== targetBufferW || canvas.height !== targetBufferH) {
        canvas.width = targetBufferW;
        canvas.height = targetBufferH;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      const naturalW = img.naturalWidth || FRAME_WIDTH;
      const naturalH = img.naturalHeight || FRAME_HEIGHT;

      if (isMobile) {
        // ── MOBILE PRESENTATION: IMMERSIVE CLOSE-UP ───────────────────────
        // Zoom in on the central pole area so the product is prominent & large
        // Crop extraneous lateral background while keeping top solar and mist visible
        const targetAspect = displayW / displayH; // portrait ratio (e.g. 0.46)
        let srcW = naturalH * targetAspect * 1.12;
        let srcH = naturalH;

        if (srcW > naturalW) {
          srcW = naturalW;
          srcH = naturalW / targetAspect;
        }

        const srcX = (naturalW - srcW) / 2;
        const srcY = (naturalH - srcH) / 2;

        ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, displayW, displayH);
      } else {
        // ── DESKTOP PRESENTATION: FULL PRODUCT COMPOSITION ────────────────
        // Fill canvas while maintaining 16:9 aspect ratio and centering the pole
        const canvasAspect = displayW / displayH;
        const imgAspect = naturalW / naturalH;

        let drawW = displayW;
        let drawH = displayH;
        let offsetX = 0;
        let offsetY = 0;

        if (canvasAspect > imgAspect) {
          drawW = displayW;
          drawH = displayW / imgAspect;
          offsetY = (displayH - drawH) / 2;
        } else {
          drawH = displayH;
          drawW = displayH * imgAspect;
          offsetX = (displayW - drawW) / 2;
        }

        ctx.drawImage(img, 0, 0, naturalW, naturalH, offsetX, offsetY, drawW, drawH);
      }

      ctx.restore();
      lastDrawnFrameRef.current = frameIndex;
    },
    [isMobile]
  );

  // ── SCROLL TRACKING & PROGRESS COMPUTATION ────────────────────────────────
  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const windowH = window.innerHeight;
    const scrollableDistance = el.offsetHeight - windowH;

    if (scrollableDistance <= 0) return;

    // Progress from 0 to 1 across the pinned scroll track
    const progress = Math.max(0, Math.min(1, -rect.top / scrollableDistance));
    const target = progress * (TOTAL_FRAMES - 1);
    targetFrameRef.current = target;

    // Compute active feature stage
    const currentRounded = Math.round(target);
    const stageIdx = STAGES.findIndex(
      (s) => currentRounded >= s.frameStart && currentRounded <= s.frameEnd
    );
    if (stageIdx !== -1) {
      setActiveStageIdx(stageIdx);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // ── SMOOTH ANIMATION LOOP (LERP & DAMPING) ────────────────────────────────
  useEffect(() => {
    let active = true;

    const loop = () => {
      if (!active) return;

      const target = targetFrameRef.current;
      const current = currentFrameRef.current;
      const diff = target - current;

      if (reducedMotion) {
        // Reduced motion: jump directly to nearest stage keyframe
        currentFrameRef.current = target;
      } else if (Math.abs(diff) < 0.04) {
        currentFrameRef.current = target;
      } else {
        // Organic smooth damping factor
        currentFrameRef.current += diff * 0.22;
      }

      const frameToDraw = Math.round(currentFrameRef.current);
      setCurrentFrameNum(frameToDraw + 1);

      if (frameToDraw !== lastDrawnFrameRef.current) {
        drawFrameToCanvas(frameToDraw);
      }

      // Proactively preload surrounding frames
      updatePreloadWindow(frameToDraw);

      rafIdRef.current = requestAnimationFrame(loop);
    };

    rafIdRef.current = requestAnimationFrame(loop);

    return () => {
      active = false;
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [drawFrameToCanvas, reducedMotion, updatePreloadWindow]);

  // ── REDRAW ON VIEWPORT RESIZE ─────────────────────────────────────────────
  useEffect(() => {
    const handleResize = () => {
      drawFrameToCanvas(Math.round(currentFrameRef.current));
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [drawFrameToCanvas]);

  // ── SMOOTH CLICK-TO-JUMP MILESTONE NAVIGATION ─────────────────────────────
  const jumpToStage = (idx: number) => {
    const el = containerRef.current;
    if (!el) return;

    const stage = STAGES[idx];
    if (!stage) return;

    const midFrame = Math.round((stage.frameStart + stage.frameEnd) / 2);
    const progress = midFrame / (TOTAL_FRAMES - 1);
    const scrollableDistance = el.offsetHeight - window.innerHeight;
    const targetScroll = el.offsetTop + progress * scrollableDistance;

    window.scrollTo({ top: targetScroll, behavior: "smooth" });
  };

  const activeStage = STAGES[activeStageIdx] || STAGES[0];

  return (
    <section
      ref={containerRef}
      id="features"
      className="relative bg-slate-950"
      /* Configurable scroll height: controls pacing of the 480-frame journey */
      style={{ height: `${SCROLL_DISTANCE_VH}vh` }}
    >
      {/* ── STICKY VIEWPORT: Pinned on screen throughout sequence ───────────── */}
      <div className="sticky top-0 h-screen w-full overflow-hidden select-none bg-slate-950">
        
        {/* ── HIGH-PERFORMANCE HTML5 CANVAS RENDERER ───────────────────────── */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block"
          style={{ willChange: "transform" }}
        />

        {/* Initial loading placeholder (disappears the millisecond Frame 1 is ready) */}
        {!initialLoaded && (
          <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center text-white z-20">
            <div className="w-10 h-10 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin mb-4" />
            <span className="text-xs font-mono tracking-widest uppercase text-slate-400">
              Loading AtmosPOLE™ Experience...
            </span>
          </div>
        )}

        {/* Subtle cinematic gradient vignette along borders */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/70 via-transparent to-black/50 z-10" />

        {/* ── TOP BAR: TELEMETRY & STAGE MILESTONES ────────────────────────── */}
        <div className="absolute top-0 inset-x-0 z-30 pt-4 sm:pt-6 px-4 sm:px-8 max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Live Status Pill */}
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-xl border border-white/15 text-white shadow-lg">
            <span
              className="w-2 h-2 rounded-full animate-ping shrink-0"
              style={{ backgroundColor: activeStage.accent }}
            />
            <span className="text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase">
              Interactive 3D Walkthrough
            </span>
            <span className="hidden sm:inline text-white/40">|</span>
            <span className="hidden sm:inline text-[10px] sm:text-xs font-mono text-emerald-400 font-semibold">
              Frame {currentFrameNum} / {TOTAL_FRAMES}
            </span>
          </div>

          {/* Quick-select milestone pills */}
          <div className="flex items-center gap-1 sm:gap-1.5 bg-black/60 backdrop-blur-xl p-1 rounded-full border border-white/15">
            {STAGES.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => jumpToStage(idx)}
                aria-label={`Jump to stage ${s.title}`}
                className={`transition-all duration-300 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-mono font-bold px-2 sm:px-3 py-1 ${
                  idx === activeStageIdx
                    ? "text-white shadow-md"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
                style={{
                  backgroundColor: idx === activeStageIdx ? activeStage.accent : "transparent",
                }}
              >
                {s.stepNum}
              </button>
            ))}
          </div>

        </div>

        {/* ── FLOATING FEATURE CARD (HTML OVERLAY ABOVE CANVAS) ─────────────── */}
        <div className="absolute z-30 bottom-6 sm:bottom-10 inset-x-4 sm:left-8 sm:right-auto max-w-lg">
          <div
            key={activeStage.id}
            className="p-5 sm:p-6 lg:p-7 rounded-3xl bg-black/75 backdrop-blur-2xl border border-white/20 shadow-2xl text-white transition-all duration-500 relative overflow-hidden"
          >
            {/* Top accent line */}
            <div
              className="absolute top-0 left-6 right-6 h-1 rounded-b-full transition-colors duration-500"
              style={{ backgroundColor: activeStage.accent }}
            />

            {/* Category tag & step counter */}
            <div className="flex items-center justify-between mb-2 sm:mb-2.5 pt-1">
              <span
                className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-mono font-bold tracking-wider uppercase bg-white/10"
                style={{ color: activeStage.accent }}
              >
                {activeStage.category}
              </span>
              <span className="text-[11px] sm:text-xs font-mono text-white/50">
                Stage {activeStage.stepNum} of 05
              </span>
            </div>

            {/* Title */}
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight leading-snug mb-2 sm:mb-3">
              {activeStage.title}
            </h3>

            {/* Description */}
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed mb-3 sm:mb-4">
              {activeStage.description}
            </p>

            {/* Highlight pill */}
            <div
              className="rounded-2xl px-3.5 py-2 flex items-start gap-2.5 border transition-colors mb-3 sm:mb-4"
              style={{
                backgroundColor: `${activeStage.accent}15`,
                borderColor: `${activeStage.accent}35`,
              }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                style={{ backgroundColor: activeStage.accent }}
              />
              <span className="text-xs sm:text-sm font-semibold text-white/95 leading-snug">
                {activeStage.highlightText}
              </span>
            </div>

            {/* Navigation & scrub prompt */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
              <button
                onClick={() => jumpToStage(Math.max(0, activeStageIdx - 1))}
                disabled={activeStageIdx === 0}
                className={`flex items-center gap-1 font-semibold px-2 py-1 rounded-md transition-colors ${
                  activeStageIdx === 0
                    ? "text-white/20 cursor-not-allowed"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M10 13l-5-5 5-5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Prev</span>
              </button>

              <span className="text-[10px] sm:text-[11px] font-mono text-white/50 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Scroll anywhere to navigate frames
              </span>

              <button
                onClick={() => jumpToStage(Math.min(STAGES.length - 1, activeStageIdx + 1))}
                disabled={activeStageIdx === STAGES.length - 1}
                className={`flex items-center gap-1 font-semibold px-2 py-1 rounded-md transition-colors ${
                  activeStageIdx === STAGES.length - 1
                    ? "text-white/20 cursor-not-allowed"
                    : "text-white hover:text-emerald-400 hover:bg-white/10"
                }`}
              >
                <span>Next</span>
                <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M6 3l5 5-5 5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* ── BOTTOM PROGRESS SCRUBBER BAR ─────────────────────────────────── */}
        <div className="absolute bottom-0 inset-x-0 h-1.5 bg-white/10 z-30">
          <div
            className="h-full transition-all duration-100 ease-out"
            style={{
              width: `${(currentFrameNum / TOTAL_FRAMES) * 100}%`,
              backgroundColor: activeStage.accent,
            }}
          />
        </div>

      </div>
    </section>
  );
}
