import { useState, useEffect, useRef, useCallback } from 'react';
import { FlavorId } from './types/flavor';
import { Navbar } from './components/Navbar';
import { ScrollCanvas } from './components/ScrollCanvas';
import { HeroOverlay } from './components/HeroOverlay';
import { LightSections } from './components/LightSections';
import { warmUpInitialFrames } from './utils/frameLoader';

export default function App() {
  // Read initial flavor from URL query (?flavor=...) or hash (#...), default to chocolate
  const getInitialFlavor = (): FlavorId => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const q = params.get('flavor')?.toLowerCase();
      if (q === 'strawberry' || q === 'cookies' || q === 'chocolate') {
        return q as FlavorId;
      }
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (hash === 'strawberry' || hash === 'cookies' || hash === 'chocolate') {
        return hash as FlavorId;
      }
    }
    return 'chocolate';
  };

  const [activeFlavor, setActiveFlavor] = useState<FlavorId>(getInitialFlavor);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [isLightSection, setIsLightSection] = useState<boolean>(false);

  const heroRef = useRef<HTMLDivElement | null>(null);
  const scrollProgressRef = useRef<number>(0);
  const autoPlayRafRef = useRef<number | null>(null);

  // Warm up initial frames on mount
  useEffect(() => {
    warmUpInitialFrames();
  }, []);

  // Sync flavor changes in-place without moving or jumping the scroll position up or down
  const handleSelectFlavor = useCallback(
    (flavor: FlavorId) => {
      if (flavor === activeFlavor) return;

      setIsAutoPlaying(false);
      setIsTransitioning(true);
      setActiveFlavor(flavor);

      try {
        const url = new URL(window.location.href);
        url.searchParams.set('flavor', flavor);
        window.history.pushState({}, '', url.toString());
      } catch {
        // Fallback
      }

      setTimeout(() => {
        setIsTransitioning(false);
      }, 160);
    },
    [activeFlavor]
  );

  // Listen to browser Back/Forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const f = getInitialFlavor();
      if (f !== activeFlavor) {
        handleSelectFlavor(f);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [activeFlavor, handleSelectFlavor]);

  // Handle scroll calculation:
  // 1) Updates scrollProgressRef synchronously for zero-latency ScrollCanvas
  // 2) Throttles React UI state updates via requestAnimationFrame to prevent scroll jank
  useEffect(() => {
    let rafPending = false;
    let lastCommittedProgress = -1;
    let lastLightState = false;

    const syncScroll = () => {
      rafPending = false;
      const hero = heroRef.current;
      if (!hero) return;

      const heroRect = hero.getBoundingClientRect();
      const maxHeroScroll = hero.offsetHeight - window.innerHeight;
      if (maxHeroScroll <= 0) return;

      const scrolledInHero = Math.max(0, -heroRect.top);
      const progress = Math.min(1, Math.max(0, scrolledInHero / maxHeroScroll));
      scrollProgressRef.current = progress;

      const light = heroRect.bottom <= 70;
      if (light !== lastLightState) {
        lastLightState = light;
        setIsLightSection(light);
      }

      // Quantize UI overlay progress updates slightly when nearly unchanged to save renders
      if (Math.abs(progress - lastCommittedProgress) >= 0.002 || progress === 0 || progress === 1) {
        if (progress !== lastCommittedProgress) {
          lastCommittedProgress = progress;
          setScrollProgress(progress);
        }
      }
    };

    const handleScroll = () => {
      // Update canvas target ref immediately on scroll without waiting for RAF
      const hero = heroRef.current;
      if (hero) {
        const heroRect = hero.getBoundingClientRect();
        const maxHeroScroll = hero.offsetHeight - window.innerHeight;
        if (maxHeroScroll > 0) {
          const scrolledInHero = Math.max(0, -heroRect.top);
          scrollProgressRef.current = Math.min(1, Math.max(0, scrolledInHero / maxHeroScroll));
        }
      }

      if (!rafPending) {
        rafPending = true;
        requestAnimationFrame(syncScroll);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    syncScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-play scroll assistant inside hero
  useEffect(() => {
    if (!isAutoPlaying) {
      if (autoPlayRafRef.current) cancelAnimationFrame(autoPlayRafRef.current);
      return;
    }

    let direction = 1;

    const step = () => {
      const hero = heroRef.current;
      if (!hero) return;

      const maxHeroScroll = hero.offsetHeight - window.innerHeight;
      let nextScroll = window.scrollY + 10 * direction;

      if (nextScroll >= maxHeroScroll) {
        direction = -1;
        nextScroll = maxHeroScroll;
      } else if (nextScroll <= 0) {
        direction = 1;
        nextScroll = 0;
      }

      window.scrollTo({ top: nextScroll, behavior: 'auto' });
      autoPlayRafRef.current = requestAnimationFrame(step);
    };

    autoPlayRafRef.current = requestAnimationFrame(step);

    return () => {
      if (autoPlayRafRef.current) cancelAnimationFrame(autoPlayRafRef.current);
    };
  }, [isAutoPlaying]);

  const handleToggleAutoPlay = useCallback(() => {
    setIsAutoPlaying((prev) => !prev);
  }, []);

  const handleScrollToHero = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Navbar appears smoothly ONLY after the hero section ends
  const showNavbar = isLightSection || scrollProgress >= 0.99;

  return (
    <div className="relative w-full bg-[#080403] text-white selection:bg-amber-500/20">
      {/* Top Navbar appears ONLY after hero section ends */}
      <Navbar
        activeFlavor={activeFlavor}
        onSelectFlavor={handleSelectFlavor}
        isVisible={showNavbar}
      />

      {/* ========================================================================= */}
      {/* HERO SCROLL SECTION (260vh track for smooth 190-frame video animation)   */}
      {/* ========================================================================= */}
      <section
        ref={heroRef}
        id="hero-track"
        className="relative w-full"
        style={{
          height: '260vh',
        }}
      >
        {/* Sticky Fullscreen Frame for the Hero Animation */}
        <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between">
          {/* Scroll-driven Canvas animation layer */}
          <ScrollCanvas
            activeFlavor={activeFlavor}
            scrollProgressRef={scrollProgressRef}
            isTransitioning={isTransitioning}
          />

          {/* Hero text & Middle Flavor Selector (fades out as soon as scroll starts) */}
          <HeroOverlay
            activeFlavor={activeFlavor}
            onSelectFlavor={handleSelectFlavor}
            scrollProgress={scrollProgress}
            isAutoPlaying={isAutoPlaying}
            onToggleAutoPlay={handleToggleAutoPlay}
          />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* LIGHT BACKGROUND SECTIONS (Inspired by reference aesthetic)               */}
      {/* Product, Flavors, Ingredients, Testimonials, CTA, and Footer              */}
      {/* ========================================================================= */}
      <LightSections
        activeFlavor={activeFlavor}
        onSelectFlavor={handleSelectFlavor}
        onScrollToHero={handleScrollToHero}
      />
    </div>
  );
}
