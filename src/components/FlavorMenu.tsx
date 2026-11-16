import React from 'react';
import { FlavorId, FLAVORS } from '../types/flavor';

interface FlavorMenuProps {
  activeFlavor: FlavorId;
  onSelectFlavor: (flavor: FlavorId) => void;
  scrollProgress: number;
}

export const FlavorMenu: React.FC<FlavorMenuProps> = ({
  activeFlavor,
  onSelectFlavor,
  scrollProgress,
}) => {
  const flavorList: FlavorId[] = ['chocolate', 'strawberry', 'cookies'];

  return (
    <div
      className="fixed bottom-5 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 w-[94%] max-w-md sm:max-w-lg transition-all duration-300"
      style={{
        transform: `translate(-50%, ${scrollProgress > 0.95 ? '20px' : '0px'})`,
        opacity: Math.max(0, 1 - Math.max(0, scrollProgress - 0.88) * 8),
        pointerEvents: scrollProgress > 0.95 ? 'none' : 'auto',
      }}
    >
      <div className="relative p-1.5 sm:p-2 rounded-full backdrop-blur-2xl bg-black/60 border border-white/20 shadow-2xl shadow-black/80 flex items-center justify-between gap-1 sm:gap-2">
        {flavorList.map((flavorKey) => {
          const item = FLAVORS[flavorKey];
          const isActive = activeFlavor === flavorKey;

          return (
            <button
              key={flavorKey}
              onClick={() => onSelectFlavor(flavorKey)}
              className={`relative flex-1 py-2 sm:py-2.5 px-2 sm:px-3 rounded-full flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer min-h-[44px] ${
                isActive
                  ? 'text-white shadow-md'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5'
              }`}
              style={{
                backgroundColor: isActive ? item.accentColor : 'transparent',
                color: isActive ? '#000000' : undefined,
              }}
              aria-label={`Select ${item.name} Flavor`}
              aria-pressed={isActive}
            >
              <span className="text-base sm:text-lg leading-none shrink-0" role="img" aria-label={item.name}>
                {item.emoji}
              </span>
              <span className={`font-display tracking-wide whitespace-nowrap truncate font-bold text-xs sm:text-sm ${isActive ? 'text-black font-extrabold' : ''}`}>
                {item.shortLabel}
              </span>
              {isActive && (
                <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-black/80 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Subtle indicator hint */}
      <div className="text-center mt-2 hidden sm:block">
        <span className="text-[11px] uppercase tracking-widest text-neutral-400 font-medium opacity-80">
          Switch Flavor · Scroll to Animate
        </span>
      </div>
    </div>
  );
};
