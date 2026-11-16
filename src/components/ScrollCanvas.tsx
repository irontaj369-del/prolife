import React, { useEffect, useRef, useState } from 'react';
import { FlavorId, FLAVORS } from '../types/flavor';
import { getBestAvailableFrame, queueLoader, loadFrame } from '../utils/frameLoader';

interface ScrollCanvasProps {
  activeFlavor: FlavorId;
  scrollProgress: number; // 0 to 1
  isTransitioning: boolean;
}

export const ScrollCanvas: React.FC<ScrollCanvasProps> = ({
  activeFlavor,
  scrollProgress,
  isTransitioning,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const currentFrameRef = useRef<number>(0);
  const targetFrameRef = useRef<number>(0);
  const animationFrameIdRef = useRef<number | null>(null);
  const [initialLoaded, setInitialLoaded] = useState(false);

  const flavorConfig = FLAVORS[activeFlavor];
  const totalFrames = flavorConfig.frameCount;

  // Preload and draw initial frame immediately
  useEffect(() => {
    let isMounted = true;

    // Load initial local frame 0
    loadFrame(activeFlavor, 0)
      .then(() => {
        if (isMounted) {
          setInitialLoaded(true);
        }
      })
      .catch(() => {});

    // Focus priority loader on current frame
    queueLoader.setFocus(activeFlavor, 0);

    return () => {
      isMounted = false;
    };
  }, [activeFlavor]);

  // Update target frame based on scroll progress
  useEffect(() => {
    const rawTarget = Math.min(
      totalFrames - 1,
      Math.max(0, Math.round(scrollProgress * (totalFrames - 1)))
    );
    targetFrameRef.current = rawTarget;

    // Direct preloader queue focus to this neighborhood
    queueLoader.setFocus(activeFlavor, rawTarget);
  }, [scrollProgress, totalFrames, activeFlavor]);

  // Continuous smooth render loop using requestAnimationFrame
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let running = true;

    const render = () => {
      if (!running) return;

      // Lerp frame smoothing: lerp factor ~0.18 for butter-smooth scrubbing
      const diff = targetFrameRef.current - currentFrameRef.current;
      if (Math.abs(diff) < 0.05) {
        currentFrameRef.current = targetFrameRef.current;
      } else {
        currentFrameRef.current += diff * 0.18;
      }

      const frameIndex = Math.min(
        totalFrames - 1,
        Math.max(0, Math.round(currentFrameRef.current))
      );

      // Get image
      const img = getBestAvailableFrame(activeFlavor, frameIndex);

      if (img && img.complete && img.naturalWidth > 0) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const displayW = window.innerWidth;
        const displayH = window.innerHeight;

        const targetCanvasW = Math.floor(displayW * dpr);
        const targetCanvasH = Math.floor(displayH * dpr);

        if (canvas.width !== targetCanvasW || canvas.height !== targetCanvasH) {
          canvas.width = targetCanvasW;
          canvas.height = targetCanvasH;
        }

        ctx.save();
        ctx.scale(dpr, dpr);

        // Responsive Zoom Calculation
        // On mobile, zoom in so it covers 100% of viewport height & looks prominent
        const isMobile = displayW < 768;
        const baseScale = Math.max(displayW / img.naturalWidth, displayH / img.naturalHeight);
        const zoomFactor = isMobile ? 1.25 : 1.02;
        const scale = baseScale * zoomFactor;

        const renderW = img.naturalWidth * scale;
        const renderH = img.naturalHeight * scale;

        const offsetX = (displayW - renderW) / 2;
        const offsetY = (displayH - renderH) / 2;

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Background clear
        ctx.fillStyle = '#060303';
        ctx.fillRect(0, 0, displayW, displayH);

        // Draw image frame
        ctx.drawImage(img, offsetX, offsetY, renderW, renderH);

        ctx.restore();
      }

      animationFrameIdRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      running = false;
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [activeFlavor, totalFrames]);

  // Window resize listener
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none">
      {/* Dynamic Ambient Background Glow matched to flavor */}
      <div
        className="absolute inset-0 transition-opacity duration-700 ease-out pointer-events-none"
        style={{
          background: flavorConfig.ambientGradient,
          opacity: 0.85,
        }}
      />

      {/* Main High-Performance Canvas */}
      <canvas
        ref={canvasRef}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isTransitioning ? 'opacity-40 scale-102' : 'opacity-100 scale-100'
        }`}
        style={{
          filter: 'contrast(1.04) brightness(1.02)',
        }}
      />

      {/* Fallback image layer while canvas initializes */}
      {!initialLoaded && (
        <img
          src={flavorConfig.initialLocalFrame}
          alt={flavorConfig.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Soft vignette scrim overlay to protect text contrast and give cinematic polish */}
      <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/80 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />
    </div>
  );
};
