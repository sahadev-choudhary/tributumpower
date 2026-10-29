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
  const lastSeekTimestampRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);

  // Helper to safely seek the video playhead backwards and forwards
  const applySeek = useCallback((targetTime: number) => {
    const video = videoRef.current;
    if (!video) return;

    const safeDuration = duration > 0 ? duration : FALLBACK_DURATION;
    // Clamp target to avoid the 'ended' state lock on iOS Safari (0 to duration - 0.05)
    const clampedTime = Math.max(0, Math.min(safeDuration - 0.05, targetTime));

    isSeekingRef.current = true;
    lastSeekTimestampRef.current = performance.now();
    try {
      video.currentTime = clampedTime;
    } catch {
      isSeekingRef.current = false;
    }
  }, [duration]);

  // ── INITIALIZE & PRIME VIDEO (ESPECIALLY FOR MOBILE / iOS SAFARI) ──────────
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Explicitly configure DOM attributes required by iOS WebKit & Android Chrome
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "true");

    try {
      video.load();
    } catch {
      // Ignore if browser restricts early load
    }

    const onLoadedMetadata = () => {
      if (video.duration && !isNaN(video.duration) && video.duration > 0) {
        setDuration(video.duration);
      }
    };

    const onSeeked = () => {
      isSeekingRef.current = false;

      // Check if user continued scrolling while hardware seek was in progress
      const currentVideoTime = video.currentTime;
      const target = targetTimeRef.current;
      if (Math.abs(currentVideoTime - target) > 0.03) {
        applySeek(target);
      }
    };

    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("seeked", onSeeked);

    if (video.readyState >= 1) {
      onLoadedMetadata();
    }

    // Prime the mobile video decoder pipeline (iOS requires a play/pause cycle)
    const primeVideoDecoder = () => {
      if (!video) return;
      video.muted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            video.pause();
          })
          .catch(() => {
            // Autoplay policy fallback
          });
      }
    };

    primeVideoDecoder();

    // Prime on first mobile user touch or scroll gesture
    const handleFirstTouch = () => {
      primeVideoDecoder();
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
  }, [applySeek]);

  // ── SCROLL PROGRESS TRACKING (BIDIRECTIONAL FOR FORWARD & REVERSE SCROLL) ──
  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const windowH = window.innerHeight;
    const scrollableDistance = el.offsetHeight - windowH;

    if (scrollableDistance <= 0) return;

    // Progress: strictly 0 (top of section) to 1 (bottom of section)
    const currentProgress = Math.max(0, Math.min(1, -rect.top / scrollableDistance));
    setProgress(currentProgress);

    const safeDuration = duration > 0 ? duration : FALLBACK_DURATION;
    // Map directly to seconds
    targetTimeRef.current = currentProgress * (safeDuration - 0.05);
  }, [duration]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("touchmove", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("touchmove", handleScroll);
    };
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

        // Smooth damping towards target scroll position (responsive in both directions)
        if (Math.abs(diff) < 0.01) {
          currentTimeRef.current = target;
        } else {
          // Responsive 0.4 damping factor prevents lag when scrolling up or down quickly
          currentTimeRef.current += diff * 0.4;
        }

        const now = performance.now();
        // Hardware Seek Watchdog: if seek has taken > 90ms or event dropped, release lock
        if (isSeekingRef.current && (now - lastSeekTimestampRef.current > 90)) {
          isSeekingRef.current = false;
        }

        // Apply seek to video playhead whenever playhead deviates from current damped target
        if (!isSeekingRef.current && Math.abs(video.currentTime - currentTimeRef.current) > 0.02) {
          applySeek(currentTimeRef.current);
        }
      }

      rafIdRef.current = requestAnimationFrame(loop);
    };

    rafIdRef.current = requestAnimationFrame(loop);

    return () => {
      active = false;
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [applySeek]);

  return (
    <section
      ref={containerRef}
      id="features"
      className="relative bg-slate-950"
      /* Physical scroll height locks the section on screen across all device viewports */
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

        {/* ── MINIMAL TELEMETRY HUD (Top-Left, positioned cleanly below navbar) ─ */}
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
