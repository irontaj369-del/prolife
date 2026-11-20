import React, { useEffect, useRef, useState } from 'react';
import { FlavorId, FLAVORS } from '../types/flavor';
import {
  FrameDrawable,
  getBestAvailableFrame,
  getFrameDimensions,
  isFrameReady,
  loadFrame,
  queueLoader,
} from '../utils/frameLoader';

interface ScrollCanvasProps {
  activeFlavor: FlavorId;
  scrollProgressRef: React.MutableRefObject<number>;
  isTransitioning: boolean;
}

export const ScrollCanvas: React.FC<ScrollCanvasProps> = ({
  activeFlavor,
  scrollProgressRef,
  isTransitioning,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const currentFrameRef = useRef<number>(0);
  const lastDrawnSourceRef = useRef<FrameDrawable | null>(null);
  const lastCanvasSizeRef = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  const viewportRef = useRef<{ displayW: number; displayH: number; dpr: number }>({
    displayW: typeof window !== 'undefined' ? window.innerWidth : 1280,
    displayH: typeof window !== 'undefined' ? window.innerHeight : 720,
    dpr: 1,
  });
  const [initialLoaded, setInitialLoaded] = useState(false);

  const flavorConfig = FLAVORS[activeFlavor];
  const totalFrames = flavorConfig.frameCount;

  // Keep viewport metrics cached on resize (avoids layout reads inside RAF)
  useEffect(() => {
    const updateViewport = () => {
      const displayW = window.innerWidth;
      const displayH = window.innerHeight;
      const isMobile = displayW < 768;
      const maxDpr = isMobile ? 1.5 : 2;
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      viewportRef.current = { displayW, displayH, dpr };
    };

    updateViewport();
    window.addEventListener('resize', updateViewport, { passive: true });
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  // Preload initial frame & focus queue loader when flavor switches
  useEffect(() => {
    let isMounted = true;
    lastDrawnSourceRef.current = null;

    const currentIdx = Math.min(
      totalFrames - 1,
      Math.max(0, Math.round(scrollProgressRef.current * (totalFrames - 1)))
    );

    loadFrame(activeFlavor, currentIdx)
      .then(() => {
        if (isMounted) setInitialLoaded(true);
      })
      .catch(() => {});

    if (currentIdx !== 0) {
      loadFrame(activeFlavor, 0).catch(() => {});
    }

    queueLoader.setFocus(activeFlavor, currentIdx);

    return () => {
      isMounted = false;
    };
  }, [activeFlavor, totalFrames, scrollProgressRef]);

  // Continuous delta-time normalized render loop (draws ONLY when frame or size changes)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
    if (!ctx) return;

    let running = true;
    let rafId: number | null = null;
    let lastTime = performance.now();

    const render = (now: number) => {
      if (!running) return;

      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      // Read scroll target directly from ref (zero React re-render delay)
      const targetFrame = Math.min(
        totalFrames - 1,
        Math.max(0, Math.round(scrollProgressRef.current * (totalFrames - 1)))
      );

      // Keep preloader focused near current scroll position (internally throttled)
      queueLoader.setFocus(activeFlavor, targetFrame);

      // Frame-rate independent exponential smoothing (~0.2 at 60fps, identical feel at 120fps)
      const diff = targetFrame - currentFrameRef.current;
      if (Math.abs(diff) < 0.05) {
        currentFrameRef.current = targetFrame;
      } else {
        const lerpAlpha = 1 - Math.exp(-14 * dt);
        currentFrameRef.current += diff * lerpAlpha;
      }

      const frameIndex = Math.min(
        totalFrames - 1,
        Math.max(0, Math.round(currentFrameRef.current))
      );

      const frame = getBestAvailableFrame(activeFlavor, frameIndex);

      if (isFrameReady(frame)) {
        const { displayW, displayH, dpr } = viewportRef.current;
        const targetCanvasW = Math.floor(displayW * dpr);
        const targetCanvasH = Math.floor(displayH * dpr);

        const sizeChanged =
          lastCanvasSizeRef.current.w !== targetCanvasW ||
          lastCanvasSizeRef.current.h !== targetCanvasH;

        if (sizeChanged) {
          canvas.width = targetCanvasW;
          canvas.height = targetCanvasH;
          lastCanvasSizeRef.current = { w: targetCanvasW, h: targetCanvasH };
        }

        // Only draw if the decoded bitmap changed or viewport resized
        if (frame !== lastDrawnSourceRef.current || sizeChanged) {
          lastDrawnSourceRef.current = frame;

          const { width: srcW, height: srcH } = getFrameDimensions(frame);
          const isMobile = displayW < 768;
          const baseScale = Math.max(displayW / srcW, displayH / srcH);
          const zoomFactor = isMobile ? 1.25 : 1.02;
          const scale = baseScale * zoomFactor;

          const renderW = srcW * scale;
          const renderH = srcH * scale;
          const offsetX = (displayW - renderW) / 2;
          const offsetY = (displayH - renderH) / 2;

          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = isMobile ? 'medium' : 'high';
          ctx.drawImage(frame, offsetX, offsetY, renderW, renderH);
        }
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      running = false;
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [activeFlavor, totalFrames, scrollProgressRef]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none">
      {/* Dynamic Ambient Background Glow matched to flavor */}
      <div
        className="absolute inset-0 transition-opacity duration-700 ease-out pointer-events-none"
        style={{
          background: flavorConfig.ambientGradient,
          opacity: 1,
        }}
      />

      {/* Main High-Performance GPU-Backed Canvas with crisp brightness/vibrancy boost */}
      <canvas
        ref={canvasRef}
        className={`w-full h-full bg-[#1a0d07] transition-opacity duration-200 ${
          isTransitioning ? 'opacity-50' : 'opacity-100'
        }`}
        style={{
          filter: 'brightness(1.18) contrast(1.06) saturate(1.1)',
        }}
      />

      {/* Fallback image layer while canvas initializes */}
      {!initialLoaded && (
        <img
          src={flavorConfig.initialLocalFrame}
          alt={flavorConfig.name}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            filter: 'brightness(1.18) contrast(1.06) saturate(1.1)',
          }}
        />
      )}

      {/* Luminous screen-blend studio fill to lift dark frame corners & edges naturally */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-screen transition-all duration-500"
        style={{
          background: `radial-gradient(ellipse 115% 105% at 50% 45%, rgba(${flavorConfig.accentRgb}, 0.12) 0%, rgba(${flavorConfig.accentRgb}, 0.22) 60%, rgba(${flavorConfig.accentRgb}, 0.30) 100%)`,
        }}
      />

      {/* Subtle studio center highlight + very soft bottom legibility feather */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 42%, rgba(255,255,255,0.06) 0%, transparent 65%)',
        }}
      />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
    </div>
  );
};
