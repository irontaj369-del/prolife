import React, { useState } from 'react';
import { FlavorId, FLAVORS } from '../types/flavor';
import { Sparkles, X, Menu, ShieldCheck, Zap, Droplets, ChevronRight } from 'lucide-react';

interface NavbarProps {
  activeFlavor: FlavorId;
  onSelectFlavor: (flavor: FlavorId) => void;
  isVisible: boolean;
}

export const Navbar: React.FC<NavbarProps> = React.memo(({ activeFlavor, onSelectFlavor, isVisible }) => {
  const [modalType, setModalType] = useState<'nutrition' | 'formula' | 'story' | 'order' | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const current = FLAVORS[activeFlavor];

  const handleNavClick = (action: () => void) => {
    action();
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 h-16 sm:h-20 flex items-center justify-between gap-4 sm:gap-8 px-4 sm:px-8 lg:px-12 backdrop-blur-xl bg-[#FAF8F5]/92 border-b border-neutral-200/80 text-neutral-900 shadow-sm transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isVisible
            ? 'translate-y-0 opacity-100 pointer-events-auto'
            : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="group flex items-center gap-2 cursor-pointer text-left focus:outline-none shrink-0"
          aria-label="PRO LIFE Home"
        >
          <span className="font-headline text-xl sm:text-2xl font-black tracking-tight text-neutral-900 transition-transform group-hover:scale-105">
            PRO LIFE
          </span>
          <span
            className="w-2 h-2 rounded-full transition-colors duration-300 shadow-sm"
            style={{ backgroundColor: current.accentColor }}
          />
          <span className="hidden sm:inline-block text-[11px] font-bold text-neutral-400 font-headline uppercase tracking-wider pl-1">
            {current.shortLabel}
          </span>
        </button>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-headline font-bold uppercase tracking-wider text-neutral-600">
          <button
            onClick={() => {
              const el = document.getElementById('ingredients-details');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
              else setModalType('formula');
            }}
            className="hover:text-neutral-900 transition-colors cursor-pointer py-1 whitespace-nowrap shrink-0"
          >
            Formula
          </button>
          <button
            onClick={() => setModalType('nutrition')}
            className="hover:text-neutral-900 transition-colors cursor-pointer py-1 whitespace-nowrap shrink-0"
          >
            Nutrition
          </button>
          <button
            onClick={() => setModalType('story')}
            className="hover:text-neutral-900 transition-colors cursor-pointer py-1 whitespace-nowrap shrink-0"
          >
            Craftsmanship
          </button>
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="hover:text-neutral-900 transition-colors cursor-pointer py-1 whitespace-nowrap shrink-0 flex items-center gap-1 text-amber-700"
          >
            <span>Back to 3D Hero</span>
            <span className="text-[10px]">↑</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action + Mobile Hamburger */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => setModalType('order')}
            className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-headline font-bold uppercase tracking-wider text-white bg-neutral-900 hover:bg-neutral-800 transition-all duration-300 transform active:scale-95 shadow-md hover:shadow-lg whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Taste Now</span>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-xl text-neutral-700 hover:text-neutral-900 hover:bg-neutral-200/50 transition-colors cursor-pointer"
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Dropdown Menu */}
      {isVisible && mobileMenuOpen && (
        <div className="fixed inset-x-0 top-16 z-30 md:hidden bg-[#FAF8F5]/98 backdrop-blur-2xl border-b border-neutral-300/80 shadow-2xl p-5 space-y-4 animate-in slide-in-from-top-4 duration-300">
          <div className="space-y-1">
            <button
              onClick={() =>
                handleNavClick(() => {
                  const el = document.getElementById('ingredients-details');
                  el?.scrollIntoView({ behavior: 'smooth' });
                })
              }
              className="w-full text-left py-2.5 px-3 rounded-xl font-headline font-bold text-sm text-neutral-800 hover:bg-neutral-100 flex items-center justify-between"
            >
              <span>Formula & Science</span>
              <ChevronRight className="w-4 h-4 text-neutral-400" />
            </button>
            <button
              onClick={() => handleNavClick(() => setModalType('nutrition'))}
              className="w-full text-left py-2.5 px-3 rounded-xl font-headline font-bold text-sm text-neutral-800 hover:bg-neutral-100 flex items-center justify-between"
            >
              <span>Nutrition Facts</span>
              <ChevronRight className="w-4 h-4 text-neutral-400" />
            </button>
            <button
              onClick={() => handleNavClick(() => setModalType('story'))}
              className="w-full text-left py-2.5 px-3 rounded-xl font-headline font-bold text-sm text-neutral-800 hover:bg-neutral-100 flex items-center justify-between"
            >
              <span>Craftsmanship</span>
              <ChevronRight className="w-4 h-4 text-neutral-400" />
            </button>
            <button
              onClick={() =>
                handleNavClick(() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                })
              }
              className="w-full text-left py-2.5 px-3 rounded-xl font-headline font-bold text-sm text-amber-800 hover:bg-amber-50 flex items-center justify-between"
            >
              <span>Replay 3D Hero Scroll</span>
              <span className="text-xs font-bold font-mono">↑ 0%</span>
            </button>
          </div>

          <div className="pt-2 border-t border-neutral-200">
            <div className="text-[11px] font-bold font-headline uppercase tracking-wider text-neutral-400 mb-2">
              Select Flavor
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['chocolate', 'strawberry', 'cookies'] as FlavorId[]).map((f) => (
                <button
                  key={f}
                  onClick={() => {
                    onSelectFlavor(f);
                    setMobileMenuOpen(false);
                  }}
                  className={`py-2 px-2 rounded-xl text-xs font-bold text-center border cursor-pointer ${
                    activeFlavor === f
                      ? 'bg-neutral-900 text-white border-neutral-900'
                      : 'bg-white text-neutral-700 border-neutral-200'
                  }`}
                >
                  {FLAVORS[f].shortLabel}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Info & Purchase Modals */}
      {modalType && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200"
          onClick={() => setModalType(null)}
        >
          <div
            className="relative w-full max-w-lg bg-neutral-900 border border-white/15 rounded-3xl p-6 sm:p-8 text-white shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-xl">{current.emoji}</span>
                <h3 className="font-headline text-lg font-bold">
                  {modalType === 'nutrition' && `${current.name} · Nutritional Breakdown`}
                  {modalType === 'formula' && 'Pro Life Micro-Filtration Formula'}
                  {modalType === 'story' && 'The Pro Life Philosophy'}
                  {modalType === 'order' && `Order Pro Life · ${current.name}`}
                </h3>
              </div>
              <button
                onClick={() => setModalType(null)}
                className="p-1.5 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="mt-5 space-y-4 text-sm text-neutral-300">
              {modalType === 'nutrition' && (
                <>
                  <p className="text-xs text-neutral-400">
                    Engineered for high bioavailability, ultra-clean digestion, and authentic gourmet flavor with zero chalky residue.
                  </p>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                      <div className="text-2xl font-black font-headline text-white">{current.specs.protein}</div>
                      <div className="text-xs text-neutral-400">Pure Whey Isolate</div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                      <div className="text-2xl font-black font-headline text-white">{current.specs.sugar}</div>
                      <div className="text-xs text-neutral-400">Sugar Content</div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                      <div className="text-2xl font-black font-headline text-white">{current.specs.calories}</div>
                      <div className="text-xs text-neutral-400">Calories per Can</div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                      <div className="text-2xl font-black font-headline text-white">{current.specs.bcaa}</div>
                      <div className="text-xs text-neutral-400">Naturally Occurring BCAAs</div>
                    </div>
                  </div>
                  <div className="pt-2 text-xs text-neutral-400">
                    <span className="font-semibold text-white">Ingredients:</span> Ultra-filtered skim milk, whey protein isolate, natural flavor extracts, organic cocoa/fruit essences, sea salt, lactase enzyme.
                  </div>
                </>
              )}

              {modalType === 'formula' && (
                <>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <Droplets className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-white text-sm">Cold Hydro-Microfiltration</h4>
                        <p className="text-xs text-neutral-400 mt-0.5">
                          Proteins remain 100% undenatured and biologically active, delivering rapid recovery without gut distress.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Zap className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-white text-sm">Real Flavor Emulsion</h4>
                        <p className="text-xs text-neutral-400 mt-0.5">
                          Never artificial syrups. We use micro-milled Belgian cocoa, sun-ripened strawberry puree, and roasted cacao cookie crumble.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <ShieldCheck className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-white text-sm">Informed-Sport Certified</h4>
                        <p className="text-xs text-neutral-400 mt-0.5">
                          Every single production batch undergoes rigorous third-party testing for purity, heavy metals, and banned substances.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {modalType === 'story' && (
                <>
                  <p>
                    Most protein drinks taste like chalk dissolved in water. We refused to accept that standard.
                  </p>
                  <p>
                    <strong className="text-white font-headline">PRO LIFE</strong> was born from a single pursuit: crafting the world&apos;s best-tasting high-protein drink that feels like an artisanal treat, powered by 26g of pure micro-filtered whey isolate.
                  </p>
                  <p className="text-xs text-neutral-400">
                    Smooth, creamy, refreshing, and ready to elevate your daily performance.
                  </p>
                </>
              )}

              {modalType === 'order' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white font-headline text-base">Pro Life 12-Pack Case</div>
                      <div className="text-xs text-neutral-400">Flavor: {current.name} (330ml × 12)</div>
                    </div>
                    <div className="text-xl font-bold font-headline text-white">₹299</div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Select Flavor</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['chocolate', 'strawberry', 'cookies'] as FlavorId[]).map((f) => (
                        <button
                          key={f}
                          onClick={() => onSelectFlavor(f)}
                          className={`p-2.5 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
                            activeFlavor === f
                              ? 'border-white text-white bg-white/15'
                              : 'border-white/10 text-neutral-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          {FLAVORS[f].shortLabel}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      alert(`Thank you for choosing PRO LIFE ${current.name}! Your order has been placed.`);
                      setModalType(null);
                    }}
                    className="w-full py-3.5 rounded-full font-bold font-headline uppercase tracking-wider text-black transition-all transform hover:brightness-110 active:scale-95 cursor-pointer mt-4"
                    style={{ backgroundColor: current.accentColor }}
                  >
                    Confirm Order · Free Shipping
                  </button>
                  <p className="text-center text-[11px] text-neutral-500">
                    30-Day Taste Guarantee · Zero Risk Return
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
});

