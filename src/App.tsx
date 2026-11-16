import { useState, useEffect, useRef, useCallback } from 'react';
import { FlavorId, FLAVORS } from './types/flavor';
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
  const autoPlayRafRef = useRef<number | null>(null);

  // Warm up initial frames on mount
  useEffect(() => {
    warmUpInitialFrames();
  }, []);

  // Sync flavor changes in-place without moving or jumping the scroll position up or down
  const handleSelectFlavor = useCallback(
    (flavor: FlavorId) => {
      if (flavor === activeFlavor) return;

      // Stop any running auto-play
      setIsAutoPlaying(false);

      // Brief fluid transition
      setIsTransitioning(true);

      // Update active flavor without moving the page up or down
      setActiveFlavor(flavor);

      // Update URL search parameter
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

  // Handle scroll calculation for hero scrub progress & light section detection
  useEffect(() => {
    const handleScroll = () => {
      const hero = heroRef.current;
      if (!hero) return;

      const heroRect = hero.getBoundingClientRect();
      const heroHeight = hero.offsetHeight;
      const windowH = window.innerHeight;
      const maxHeroScroll = heroHeight - windowH;

      if (maxHeroScroll <= 0) {
        setScrollProgress(0);
        return;
      }

      // Amount scrolled inside hero container
      const scrolledInHero = Math.max(0, -heroRect.top);
      const progress = Math.min(1, Math.max(0, scrolledInHero / maxHeroScroll));
      setScrollProgress(progress);

      // Show navbar only after hero section ends (when entering light sections)
      setIsLightSection(heroRect.bottom <= 70);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

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
            scrollProgress={scrollProgress}
            isTransitioning={isTransitioning}
          />

          {/* Hero text & Middle Flavor Selector (fades out as soon as scroll starts) */}
          <HeroOverlay
            activeFlavor={activeFlavor}
            onSelectFlavor={handleSelectFlavor}
            scrollProgress={scrollProgress}
            isAutoPlaying={isAutoPlaying}
            onToggleAutoPlay={() => setIsAutoPlaying((prev) => !prev)}
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
        onScrollToHero={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      />
    </div>
  );
}
