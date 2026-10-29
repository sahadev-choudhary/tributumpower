"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// ── CONFIGURATION ───────────────────────────────────────────────────────────
const SCROLL_DISTANCE_VH = 380; // Calibrated scroll track height in vh
const VIDEO_SRC = "/video/pole-sequence.mp4";
const POSTER_SRC = "/Pole Sequence/00001.jpg";
const FALLBACK_DURATION = 20.01;

export default function ScrollFeatures() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [progress, setProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(FALLBACK_DURATION);

  // Playhead interpolation refs
  const targetTimeRef = useRef<number>(0);
  const currentTimeRef = useRef<number>(0);
  const isSeekingRef = useRef<boolean>(false);
  const lastSeekTimeRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);

  // ── INITIALIZE & PRIME VIDEO ──────────────────────────────────────────────
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "true");

    try {
      video.load();
    } catch {
      // Ignore if early load is restricted
    }

    const onLoadedMetadata = () => {
      if (video.duration && !isNaN(video.duration) && video.duration > 0) {
        setDuration(video.duration);
      }
    };

    const onSeeked = () => {
      isSeekingRef.current = false;
    };

    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("seeked", onSeeked);

    if (video.readyState >= 1) {
      onLoadedMetadata();
    }

    // Prime decoder pipeline on mobile (safe play/pause cycle)
    const primeDecoder = () => {
      if (!video) return;
      video.muted = true;
      const promise = video.play();
      if (promise !== undefined) {
        promise.then(() => video.pause()).catch(() => {});
      }
    };

    primeDecoder();

    const handleFirstTouch = () => {
      primeDecoder();
      window.removeEventListener("touchstart", handleFirstTouch);
      window.removeEventListener("scroll", handleFirstTouch);
    };

    window.addEventListener("touchstart", handleFirstTouch, { passive: true });
    window.addEventListener("scroll", handleFirstTouch, { passive: true });

    return () => {
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("seeked", onSeeked);
      window.removeEventListener("touchstart", handleFirstTouch);
      window.removeEventListener("scroll", handleFirstTouch);
    };
  }, []);

  // ── SCROLL PROGRESS TRACKING ──────────────────────────────────────────────
  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const windowH = window.innerHeight;
    const scrollableDistance = el.offsetHeight - windowH;

    if (scrollableDistance <= 0) return;

    // Progress from 0 to 1
    const currentProgress = Math.max(0, Math.min(1, -rect.top / scrollableDistance));
    setProgress(currentProgress);

    const safeDuration = duration > 0 ? duration : FALLBACK_DURATION;
    // Cap strictly at safeDuration - 0.1 so video NEVER triggers the terminal 'ended' lock on iOS
    targetTimeRef.current = currentProgress * (safeDuration - 0.1);
  }, [duration]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // ── BUTTER-SMOOTH BIDIRECTIONAL RAF SCRUBBING LOOP ─────────────────────────
  useEffect(() => {
    let active = true;

    const loop = () => {
      if (!active) return;

      const video = videoRef.current;
      if (video) {
        const target = targetTimeRef.current;
        const current = currentTimeRef.current;
        const diff = target - current;

        // Smooth damping (lerp) towards target scroll position
        if (Math.abs(diff) < 0.008) {
          currentTimeRef.current = target;
        } else {
          currentTimeRef.current += diff * 0.22;
        }

        const now = performance.now();
        // Watchdog: release seek lock if hardware seek took > 120ms or event dropped
        if (isSeekingRef.current && (now - lastSeekTimeRef.current > 120)) {
          isSeekingRef.current = false;
        }

        // Apply seek to video playhead when not seeking
        if (!isSeekingRef.current && Math.abs(video.currentTime - currentTimeRef.current) > 0.02) {
          isSeekingRef.current = true;
          lastSeekTimeRef.current = now;
          video.currentTime = currentTimeRef.current;
        }
      }

      rafIdRef.current = requestAnimationFrame(loop);
    };

    rafIdRef.current = requestAnimationFrame(loop);

    return () => {
      active = false;
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      id="features"
      className="relative bg-slate-950"
      /* Calibrated scroll track: ensures cinematic pacing through the sequence */
      style={{ height: `${SCROLL_DISTANCE_VH}vh` }}
    >
      {/* ── STICKY VIEWPORT: Pinned edge-to-edge full screen ─────────────────── */}
      <div className="sticky top-0 h-screen w-full overflow-hidden select-none bg-slate-950 flex items-center justify-center">
        
        {/* ── HIGH-DEFINITION CINEMATIC VIDEO (SCRUBBED VIA SCROLL) ─────────── */}
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          poster={POSTER_SRC}
          playsInline
          muted
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          /* Desktop: Full composition; Mobile: Zoomed in on pole for immersive close-up */
          className="w-full h-full object-cover object-center scale-[1.28] sm:scale-100 transition-transform duration-500 will-change-transform"
        />

        {/* Subtle cinematic gradient vignette along top & bottom edges */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/60 z-10" />

        {/* ── MINIMAL TELEMETRY HUD (Top-Left, positioned safely below navbar) ─ */}
        <div className="absolute top-20 left-5 sm:top-24 sm:left-8 z-20 pointer-events-none">
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white/90 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase">
              AtmosPOLE™ Inspection
            </span>
            <span className="text-white/30">|</span>
            <span className="text-[10px] sm:text-xs font-mono text-emerald-400 font-semibold">
              {Math.round(progress * 100)}%
            </span>
          </div>
        </div>

        {/* ── SCROLL PROMPT (Fades out once user starts scrolling) ──────────── */}
        <div
          className={`absolute bottom-8 z-20 pointer-events-none flex flex-col items-center gap-2 text-white/70 transition-opacity duration-500 ${
            progress > 0.05 ? "opacity-0" : "opacity-100 animate-bounce"
          }`}
        >
          <span className="text-[10px] font-mono tracking-widest uppercase text-white/60">
            Scroll to explore in 360°
          </span>
          <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 16 16" fill="none">
            <path
              d="M3 6l5 5 5-5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* ── RAZOR-THIN EMERALD PROGRESS LINE (Bottom Edge) ────────────────── */}
        <div className="absolute bottom-0 inset-x-0 h-1 bg-white/10 z-20 pointer-events-none">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-75 ease-out shadow-[0_0_10px_rgba(16,185,129,0.5)]"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

      </div>
    </section>
  );
}
