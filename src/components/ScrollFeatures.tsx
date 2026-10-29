"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// ── CONFIGURATION ───────────────────────────────────────────────────────────
const SCROLL_DISTANCE_VH = 400; // Physical scroll track height in vh
const VIDEO_SRC = "/video/pole-sequence.mp4";

export default function ScrollFeatures() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [progress, setProgress] = useState<number>(0);
  const [videoReady, setVideoReady] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(20);

  // Playhead interpolation refs
  const targetTimeRef = useRef<number>(0);
  const currentTimeRef = useRef<number>(0);
  const isSeekingRef = useRef<boolean>(false);
  const rafIdRef = useRef<number | null>(null);

  // ── LOAD & PREPARE VIDEO ──────────────────────────────────────────────────
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.pause();

    const handleLoadedMetadata = () => {
      if (video.duration && !isNaN(video.duration)) {
        setDuration(video.duration);
      }
      setVideoReady(true);
      video.pause();
      video.currentTime = 0;
    };

    const handleSeeked = () => {
      isSeekingRef.current = false;
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("seeked", handleSeeked);

    // If already loaded from cache
    if (video.readyState >= 1) {
      handleLoadedMetadata();
    }

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("seeked", handleSeeked);
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

    // Progress from 0 (entry) to 1 (exit)
    const currentProgress = Math.max(0, Math.min(1, -rect.top / scrollableDistance));
    setProgress(currentProgress);

    // Compute target video timestamp
    targetTimeRef.current = currentProgress * duration;
  }, [duration]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // ── BUTTER-SMOOTH RAF SCRUBBING LOOP ──────────────────────────────────────
  // Uses linear damping (lerp) + seek lock to ensure high-FPS smooth playback
  useEffect(() => {
    let active = true;

    const loop = () => {
      if (!active) return;

      const video = videoRef.current;
      if (video && videoReady && duration > 0) {
        const target = targetTimeRef.current;
        const current = currentTimeRef.current;
        const diff = target - current;

        // Smooth damping towards target scroll position
        if (Math.abs(diff) < 0.01) {
          currentTimeRef.current = target;
        } else {
          currentTimeRef.current += diff * 0.22;
        }

        // Apply to video element when ready to accept next frame
        if (!isSeekingRef.current && Math.abs(video.currentTime - currentTimeRef.current) > 0.02) {
          isSeekingRef.current = true;
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
  }, [duration, videoReady]);

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
          playsInline
          muted
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          /* Desktop: Full composition; Mobile: Zoomed in on pole for immersive close-up */
          className="w-full h-full object-cover object-center scale-[1.28] sm:scale-100 transition-transform duration-500 will-change-transform"
        />

        {/* Loading Spinner until video metadata is loaded */}
        {!videoReady && (
          <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center text-white z-20">
            <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin mb-3" />
            <span className="text-xs font-mono tracking-widest uppercase text-slate-400">
              Loading AtmosPOLE™ Experience...
            </span>
          </div>
        )}

        {/* Subtle cinematic gradient vignette along top & bottom edges */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/60 z-10" />

        {/* ── MINIMAL TELEMETRY HUD (Top-Left) ─────────────────────────────── */}
        <div className="absolute top-5 left-5 sm:top-7 sm:left-8 z-20 pointer-events-none">
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/90 shadow-lg">
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
