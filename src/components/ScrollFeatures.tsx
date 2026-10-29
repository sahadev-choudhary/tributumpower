"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// ── CONFIGURATION ───────────────────────────────────────────────────────────
const TOTAL_FRAMES = 480;
const FRAME_WIDTH = 1280;
const FRAME_HEIGHT = 720;
const SCROLL_DISTANCE_VH = 400; // Physical scroll track height in vh
const MAX_CACHE_SIZE = 120; // Bounded in-memory frame cache
const CONCURRENT_DOWNLOADS = 8;

const getFrameUrl = (index: number): string => {
  const clamped = Math.max(0, Math.min(TOTAL_FRAMES - 1, index));
  const pad = String(clamped + 1).padStart(5, "0");
  return `/Pole Sequence/${pad}.jpg`;
};

export default function ScrollFeatures() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [hasVideo, setHasVideo] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [initialLoaded, setInitialLoaded] = useState<boolean>(false);

  // Playhead & caching refs
  const currentFrameRef = useRef<number>(0);
  const targetFrameRef = useRef<number>(0);
  const activeDownloadsRef = useRef<Set<number>>(new Set());
  const imageCacheRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const cacheOrderRef = useRef<number[]>([]);
  const lastDrawnFrameRef = useRef<number>(-1);
  const rafIdRef = useRef<number | null>(null);

  // ── DETECT VIEWPORT ───────────────────────────────────────────────────────
  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth < 1024 || window.innerHeight > window.innerWidth);
    };
    checkViewport();
    window.addEventListener("resize", checkViewport);
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  // ── CHECK IF HIGH-QUALITY VIDEO IS AVAILABLE ──────────────────────────────
  useEffect(() => {
    const video = document.createElement("video");
    video.src = "/video/pole-sequence.mp4";
    video.onloadedmetadata = () => {
      if (video.duration > 0) setHasVideo(true);
    };
    video.onerror = () => {
      // Check secondary candidate name
      const altVideo = document.createElement("video");
      altVideo.src = "/video/pole.mp4";
      altVideo.onloadedmetadata = () => {
        if (altVideo.duration > 0) setHasVideo(true);
      };
    };
  }, []);

  // ── LRU IMAGE LOADER (FOR FRAME SEQUENCE FALLBACK) ────────────────────────
  const requestFrame = useCallback((index: number): Promise<HTMLImageElement | null> => {
    const cache = imageCacheRef.current;
    if (cache.has(index)) {
      const order = cacheOrderRef.current;
      const idx = order.indexOf(index);
      if (idx > -1) order.splice(idx, 1);
      order.push(index);
      return Promise.resolve(cache.get(index)!);
    }

    if (activeDownloadsRef.current.has(index) || activeDownloadsRef.current.size >= CONCURRENT_DOWNLOADS) {
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

  // ── INITIAL PRELOAD (FIRST FRAME + KEYFRAMES) ─────────────────────────────
  useEffect(() => {
    if (hasVideo) return;

    const firstImg = new window.Image();
    firstImg.src = getFrameUrl(0);
    firstImg.onload = () => {
      imageCacheRef.current.set(0, firstImg);
      cacheOrderRef.current.push(0);
      setInitialLoaded(true);
    };

    // Preload keyframes across sequence
    for (let f = 0; f < TOTAL_FRAMES; f += 20) {
      if (f !== 0) requestFrame(f);
    }
  }, [hasVideo, requestFrame]);

  // ── PRELOAD SURROUNDING WINDOW ────────────────────────────────────────────
  const updatePreloadWindow = useCallback(
    (centerFrame: number) => {
      if (hasVideo) return;
      const preloadRange = isMobile ? 16 : 32;
      const start = Math.max(0, centerFrame - 8);
      const end = Math.min(TOTAL_FRAMES - 1, centerFrame + preloadRange);

      for (let i = start; i <= end; i++) {
        if (!imageCacheRef.current.has(i)) {
          requestFrame(i);
        }
      }
    },
    [hasVideo, isMobile, requestFrame]
  );

  // ── DRAW FRAME ONTO FULL-BLEED CANVAS ─────────────────────────────────────
  const drawFrameToCanvas = useCallback(
    (frameIndex: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d", { alpha: false });
      if (!ctx) return;

      const cache = imageCacheRef.current;
      let img = cache.get(frameIndex);

      if (!img) {
        let minDist = Infinity;
        for (const [idx, loadedImg] of cache.entries()) {
          const dist = Math.abs(idx - frameIndex);
          if (dist < minDist) {
            minDist = dist;
            img = loadedImg;
          }
        }
      }

      if (!img || !img.complete || img.naturalWidth === 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const displayW = canvas.clientWidth;
      const displayH = canvas.clientHeight;

      if (displayW === 0 || displayH === 0) return;

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
        // Mobile: Zoom in tighter on the central pole
        const targetAspect = displayW / displayH;
        let srcW = naturalH * targetAspect * 1.15;
        let srcH = naturalH;

        if (srcW > naturalW) {
          srcW = naturalW;
          srcH = naturalW / targetAspect;
        }

        const srcX = (naturalW - srcW) / 2;
        const srcY = (naturalH - srcH) / 2;

        ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, displayW, displayH);
      } else {
        // Desktop: Full composition cover
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

  // ── SCROLL SCRUBBING ──────────────────────────────────────────────────────
  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const windowH = window.innerHeight;
    const scrollableDistance = el.offsetHeight - windowH;

    if (scrollableDistance <= 0) return;

    const progress = Math.max(0, Math.min(1, -rect.top / scrollableDistance));
    targetFrameRef.current = progress * (TOTAL_FRAMES - 1);

    // If using video mode: scrub video.currentTime
    const video = videoRef.current;
    if (video && video.duration) {
      video.currentTime = progress * video.duration;
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // ── ANIMATION RAF LOOP ────────────────────────────────────────────────────
  useEffect(() => {
    if (hasVideo) return;

    let active = true;

    const loop = () => {
      if (!active) return;

      const target = targetFrameRef.current;
      const current = currentFrameRef.current;
      const diff = target - current;

      if (Math.abs(diff) < 0.04) {
        currentFrameRef.current = target;
      } else {
        currentFrameRef.current += diff * 0.24;
      }

      const frameToDraw = Math.round(currentFrameRef.current);
      if (frameToDraw !== lastDrawnFrameRef.current) {
        drawFrameToCanvas(frameToDraw);
      }

      updatePreloadWindow(frameToDraw);
      rafIdRef.current = requestAnimationFrame(loop);
    };

    rafIdRef.current = requestAnimationFrame(loop);

    return () => {
      active = false;
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [drawFrameToCanvas, hasVideo, updatePreloadWindow]);

  // ── REDRAW ON RESIZE ──────────────────────────────────────────────────────
  useEffect(() => {
    const handleResize = () => {
      if (!hasVideo) {
        drawFrameToCanvas(Math.round(currentFrameRef.current));
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [drawFrameToCanvas, hasVideo]);

  return (
    <section
      ref={containerRef}
      id="features"
      className="relative bg-slate-950"
      style={{ height: `${SCROLL_DISTANCE_VH}vh` }}
    >
      {/* ── STICKY VIEWPORT: PURE, FULL-SCREEN CINEMATIC CANVAS (ZERO TEXT BOXES) ── */}
      <div className="sticky top-0 h-screen w-full overflow-hidden select-none bg-slate-950">
        
        {/* VIDEO MODE (Automatically active when /video/pole-sequence.mp4 is present) */}
        {hasVideo ? (
          <video
            ref={videoRef}
            playsInline
            muted
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/video/pole-sequence.mp4" type="video/mp4" />
            <source src="/video/pole.mp4" type="video/mp4" />
          </video>
        ) : (
          /* CANVAS MODE: 100% Edge-to-Edge Frame Sequence */
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full block"
            style={{ willChange: "transform" }}
          />
        )}

        {/* Initial loading placeholder (disappears once Frame 1 is ready) */}
        {!hasVideo && !initialLoaded && (
          <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center text-white z-20">
            <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin mb-3" />
            <span className="text-xs font-mono tracking-widest uppercase text-slate-400">
              Loading AtmosPOLE™ Experience...
            </span>
          </div>
        )}

      </div>
    </section>
  );
}
