import React from 'react';
import { FlavorId, FLAVORS } from '../types/flavor';
import { ChevronDown, Sparkles } from 'lucide-react';

interface HeroOverlayProps {
  activeFlavor: FlavorId;
  onSelectFlavor: (flavor: FlavorId) => void;
  scrollProgress: number; // 0 to 1
  isAutoPlaying: boolean;
  onToggleAutoPlay: () => void;
}

export const HeroOverlay: React.FC<HeroOverlayProps> = ({
  activeFlavor,
  onSelectFlavor,
  scrollProgress,
  isAutoPlaying,
  onToggleAutoPlay,
}) => {
  const current = FLAVORS[activeFlavor];
  const flavorList: FlavorId[] = ['chocolate', 'strawberry', 'cookies'];

  // The initial hero title & subtitle fade out
  // immediately as soon as someone starts scrolling (fully gone within the first 2-3% of scroll)
  const initialOpacity = Math.max(0, Math.min(1, 1 - scrollProgress * 35));
  const initialTranslateY = scrollProgress * -80;
  const initialScale = 1 - scrollProgress * 0.12;

  // Climax specs only when approaching settled can in hero
  const settledOpacity = Math.max(0, Math.min(1, (scrollProgress - 0.72) * 3.5));
  const settledTranslateY = Math.max(0, (1 - scrollProgress) * 30);

  // Bottom flavor selection bar at end line of hero section
  // Softly fades out as user transitions to light sections
  const bottomBarOpacity = Math.max(0, 1 - Math.max(0, scrollProgress - 0.88) * 8);

  return (
    <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-4 sm:p-8 lg:p-10 select-none overflow-hidden">
      {/* Top spacing - clean with no header in hero section */}
      <div className="h-6 sm:h-10" />

      {/* ========================================================================= */}
      {/* CENTER STAGE: Bold PRO LIFE Title + Subheading                            */}
      {/* Fades out immediately as soon as someone starts scrolling                 */}
      {/* ========================================================================= */}
      <div
        className="relative my-auto flex flex-col items-center justify-center text-center px-4 transition-all duration-200 ease-out"
        style={{
          opacity: initialOpacity,
          transform: `translateY(${initialTranslateY}px) scale(${initialScale})`,
          visibility: initialOpacity <= 0.01 ? 'hidden' : 'visible',
          pointerEvents: initialOpacity <= 0.05 ? 'none' : 'auto',
        }}
      >
        {/* Subtle Category Kicker */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 mb-3 sm:mb-4 text-xs font-semibold tracking-wider uppercase text-neutral-300">
          <span
            className="w-2 h-2 rounded-full transition-colors duration-300"
            style={{ backgroundColor: current.accentColor }}
          />
          <span className="font-display">{current.name} Edition</span>
        </div>

        {/* Refined, Tasteful Bold Title */}
        <h1 className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-[5.5rem] font-black tracking-tight text-white drop-shadow-[0_10px_35px_rgba(0,0,0,0.9)] leading-none">
          PRO LIFE
        </h1>

        {/* Subheading: Best Flavored Protein Drinks */}
        <p className="mt-2.5 sm:mt-3 text-base sm:text-xl md:text-2xl font-medium tracking-tight text-neutral-200 max-w-lg text-balance drop-shadow-md">
          Best Flavored Protein Drinks
        </p>

        {/* Flavor Tagline Note */}
        <p className="mt-1 sm:mt-1.5 text-xs sm:text-sm font-medium tracking-wide text-white/60">
          {current.tagline}
        </p>

        {/* Subtle Scroll Cue */}
        <div className="mt-6 sm:mt-8 flex flex-col items-center gap-1 text-neutral-400 animate-bounce">
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-white/70">
            Scroll to unleash 3D
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-white/70" />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CLIMAX PRODUCT SPECS OVERLAY (Settled Can pose)                          */}
      {/* ========================================================================= */}
      <div
        className="absolute inset-x-4 sm:inset-x-12 top-20 bottom-24 flex flex-col justify-between pointer-events-none transition-all duration-300"
        style={{
          opacity: settledOpacity,
          transform: `translateY(${settledTranslateY}px)`,
          visibility: settledOpacity <= 0.01 ? 'hidden' : 'visible',
        }}
      >
        {/* Left Side Nutrition Pill Callouts */}
        <div className="hidden lg:flex flex-col gap-3 max-w-xs self-start mt-8">
          <div className="p-4 rounded-2xl bg-black/60 backdrop-blur-md border border-white/15 shadow-xl">
            <div className="text-3xl font-black font-display text-white">
              {current.specs.protein}
            </div>
            <div className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
              Cold Micro-Filtered Whey
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-black/60 backdrop-blur-md border border-white/15 shadow-xl">
            <div className="text-3xl font-black font-display text-white">
              {current.specs.sugar}
            </div>
            <div className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
              Zero Chalky Aftertaste
            </div>
          </div>
        </div>

        {/* Right Side Flavor Notes */}
        <div className="hidden lg:flex flex-col gap-3 max-w-xs self-end mt-8 text-right">
          <div className="p-4 rounded-2xl bg-black/60 backdrop-blur-md border border-white/15 shadow-xl text-left">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4" style={{ color: current.accentColor }} />
              <div className="text-xs font-bold uppercase tracking-wider text-white">
                Gourmet Tasting Notes
              </div>
            </div>
            <div className="text-sm font-medium text-neutral-300">
              {current.highlights.join(' · ')}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* END LINE OF HERO SECTION: Perfectly Centered Flavor Selection             */}
      {/* Pinned mathematically at dead center (50% viewport width)                 */}
      {/* ========================================================================= */}
      <div
        className="relative w-full flex items-center justify-between pb-3 sm:pb-6 pointer-events-auto transition-opacity duration-300 min-h-[48px]"
        style={{
          opacity: bottomBarOpacity,
          visibility: scrollProgress > 0.98 ? 'hidden' : 'visible',
          pointerEvents: bottomBarOpacity <= 0.05 ? 'none' : 'auto',
        }}
      >
        {/* Left: Mini Scrub Progress on desktop (docked left, does not push center) */}
        <div className="hidden md:flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-[11px] text-neutral-400 shrink-0">
          <span className="font-mono tabular-nums text-white font-medium">
            {Math.round(scrollProgress * 100)}%
          </span>
          <div className="w-16 h-1 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-75 rounded-full"
              style={{
                width: `${Math.round(scrollProgress * 100)}%`,
                backgroundColor: current.accentColor,
              }}
            />
          </div>
          <span className="uppercase text-[9px] tracking-wider text-neutral-400">
            {scrollProgress < 0.2 ? 'Burst' : scrollProgress < 0.7 ? '3D Active' : 'Settled'}
          </span>
        </div>

        {/* Center: Perfectly Dead-Centered Flavor Selector (exact 50% screen width on PC & mobile) */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center p-1 rounded-full bg-neutral-950/80 backdrop-blur-2xl border border-white/20 shadow-2xl shadow-black/80 gap-1 select-none no-scrollbar pointer-events-auto"
          role="radiogroup"
          aria-label="Select Flavor"
        >
          {flavorList.map((flavorKey) => {
            const item = FLAVORS[flavorKey];
            const isActive = activeFlavor === flavorKey;

            return (
              <button
                key={flavorKey}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectFlavor(flavorKey);
                }}
                className={`relative px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full flex items-center gap-1.5 text-[11px] sm:text-xs font-bold transition-all duration-300 cursor-pointer whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'text-black shadow-md scale-102'
                    : 'text-neutral-400 hover:text-white hover:bg-white/10'
                }`}
                style={{
                  backgroundColor: isActive ? item.accentColor : 'transparent',
                  boxShadow: isActive ? `0 0 16px -2px ${item.glowColor}` : 'none',
                }}
                role="radio"
                aria-checked={isActive}
              >
                <span className="text-xs sm:text-sm leading-none shrink-0" role="img" aria-label={item.name}>
                  {item.emoji}
                </span>
                <span className="font-display tracking-tight font-extrabold">
                  <span className="inline sm:hidden">
                    {flavorKey === 'chocolate' ? 'Choc' : flavorKey === 'strawberry' ? 'Berry' : 'Cookies'}
                  </span>
                  <span className="hidden sm:inline">
                    {item.shortLabel}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Right: Auto Play Toggle on desktop (docked right, does not push center) */}
        <div className="hidden md:flex items-center ml-auto shrink-0">
          <button
            onClick={onToggleAutoPlay}
            className="px-2.5 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/15 text-neutral-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
            aria-label={isAutoPlaying ? 'Pause Animation' : 'Auto Play Animation'}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isAutoPlaying ? 'animate-ping' : ''
              }`}
              style={{ backgroundColor: current.accentColor }}
            />
            <span>{isAutoPlaying ? 'Pause' : 'Auto Play'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
