import React, { useState } from 'react';
import { FlavorId, FLAVORS } from '../types/flavor';
import {
  Sparkles,
  Check,
  Star,
  ArrowRight,
  ShieldCheck,
  Percent,
  Clock,
  Truck,
  Plus,
  Minus,
  ShoppingBag,
} from 'lucide-react';

interface LightSectionsProps {
  activeFlavor: FlavorId;
  onSelectFlavor: (flavor: FlavorId) => void;
  onScrollToHero: () => void;
}

export const LightSections: React.FC<LightSectionsProps> = ({
  activeFlavor,
  onSelectFlavor,
  onScrollToHero,
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  const handleQuickAdd = (productName: string) => {
    setAddedNotice(`Added ${productName} to your cart!`);
    setTimeout(() => setAddedNotice(null), 3000);
  };

  const currentConfig = FLAVORS[activeFlavor];

  const faqs = [
    {
      q: 'Why does PRO LIFE taste so much better than traditional protein drinks?',
      a: 'Traditional shakes use cheap whey concentrate blended with artificial thickeners and chemical sweeteners, resulting in a chalky, artificial taste. PRO LIFE uses cold hydro-microfiltered whey isolate emulsified with real culinary ingredients—like Dutch cocoa powder, sun-ripened strawberry puree, and dark cocoa biscuit crumble.',
    },
    {
      q: 'How many grams of protein and sugar are in each can?',
      a: 'Each 330ml can packs 26 grams of complete, fast-digesting protein with 0g of added sugar, only 175-185 calories, and 5.4g+ naturally occurring branched-chain amino acids (BCAAs).',
    },
    {
      q: 'Is it suitable for lactose-sensitive individuals?',
      a: 'Yes! Our cold-filtration process removes virtually all lactose and fat, and we add natural lactase enzymes so you experience smooth digestion with zero stomach heaviness or bloat.',
    },
    {
      q: 'What is the 30-Day Taste Guarantee?',
      a: 'If you do not agree that PRO LIFE is the most delicious protein drink you have ever tasted, simply message our team within 30 days and we will refund your entire first case—no awkward questions asked.',
    },
  ];

  return (
    <div className="relative w-full bg-[#FAF8F5] text-neutral-900 overflow-hidden font-sans">
      {/* Toast Alert for Cart Actions */}
      {addedNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/20 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold">{addedNotice}</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-20 sm:space-y-32">
        {/* ========================================================================= */}
        {/* SECTION 1: HERO FEATURE BANNER ("Enjoy classic Flavours")                */}
        {/* Fully fits the image into the card container with no black borders       */}
        {/* ========================================================================= */}
        <section className="space-y-6 sm:space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-headline text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-900 leading-[1.1]">
              Enjoy classic Flavours
            </h2>
            <p className="mt-3 text-sm sm:text-base text-neutral-600 font-medium">
              Real culinary craftsmanship meets pure sports performance nutrition.
            </p>
          </div>

          {/* Full-bleed showcase card where image fits box perfectly */}
          <div className="relative rounded-[2.5rem] overflow-hidden min-h-[460px] sm:min-h-[540px] shadow-2xl border border-neutral-300/80 group bg-neutral-950">
            {/* Background image filling 100% of the box */}
            <img
              src={currentConfig.finalLocalFrame}
              alt={currentConfig.name}
              className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
            {/* Cinematic gradient overlay for pristine contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/40 pointer-events-none" />

            {/* Content overlay */}
            <div className="relative z-10 p-6 sm:p-12 lg:p-16 flex flex-col justify-between h-full min-h-[460px] sm:min-h-[540px]">
              <div className="flex items-center justify-between gap-4">
                <div className="px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs font-bold font-headline uppercase tracking-wider text-white">
                  {currentConfig.name} Edition
                </div>
                <button
                  onClick={onScrollToHero}
                  className="px-4 py-2 rounded-full bg-white hover:bg-neutral-100 text-neutral-900 font-headline text-xs font-bold shadow-lg transition-transform active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <span>Replay 3D Scroll</span>
                  <span>↗</span>
                </button>
              </div>

              <div className="space-y-3 max-w-xl">
                <div className="text-xs font-bold uppercase tracking-widest text-amber-400 font-headline">
                  Gourmet Sports Recovery
                </div>
                <h3 className="font-headline text-3xl sm:text-5xl font-black text-white leading-tight drop-shadow-md">
                  Pure indulgence. <br /> Zero compromise.
                </h3>
                <p className="text-sm sm:text-base text-neutral-200 max-w-lg font-medium leading-relaxed">
                  Cold micro-filtered whey isolate infused with real cocoa, berries, and Madagascar vanilla. Engineered for fast recovery with zero chalky finish.
                </p>
                <div className="flex flex-wrap gap-2 pt-2 text-xs font-bold text-white">
                  <span className="px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20">
                    26g Whey Isolate
                  </span>
                  <span className="px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20">
                    0g Added Sugar
                  </span>
                  <span className="px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20">
                    Lactose Friendly
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 2: VALUE SUBSCRIPTION OFFER ("Save 15% with endless")            */}
        {/* Left image box is full-bleed and fits perfectly                          */}
        {/* ========================================================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left: Product Can Box that fully fills with the image */}
          <div className="lg:col-span-5 relative rounded-[2.5rem] overflow-hidden min-h-[420px] sm:min-h-[480px] shadow-xl border border-neutral-300/80 group bg-neutral-950">
            <img
              src="/initial_frames/strawberry_189.png"
              alt="PRO LIFE Wild Strawberry"
              className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30 pointer-events-none" />

            <div className="relative z-10 p-6 flex flex-col justify-between h-full min-h-[420px] sm:min-h-[480px]">
              <div className="self-start px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-bold font-headline">
                🍓 Wild Strawberry · 330ml
              </div>

              <div className="p-4 rounded-2xl bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-between">
                <div>
                  <div className="font-bold font-headline text-sm text-white">Daily Routine Pack</div>
                  <div className="text-white/70 text-xs">12 Cans Delivered Monthly</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-neutral-400 line-through">₹399</div>
                  <div className="font-extrabold text-amber-400 font-headline text-base">₹299</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Value Proposition Content */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="font-headline text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-900 leading-[1.1]">
              Save 15% with <br className="hidden sm:inline" />
              endless routine
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed max-w-lg">
              Never run dry on daily recovery. Subscribe to your personalized flavor rotation for a silky, rich protein ritual delivered right to your door with zero hassle.
            </p>

            {/* 3 Icon Feature Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-sm flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Percent className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-neutral-800 leading-tight">
                  Save 15% on every order
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-sm flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-neutral-800 leading-tight">
                  Early access to new drops
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-sm flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Truck className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-neutral-800 leading-tight">
                  Free express shipping always
                </span>
              </div>
            </div>

            <div className="pt-3 flex flex-wrap items-center gap-4">
              <button
                onClick={() => handleQuickAdd('12-Pack Subscription')}
                className="px-8 py-3.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white font-headline text-sm font-bold tracking-wide transition-all shadow-lg active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <span>Start Subscription · ₹299/case</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <span className="text-xs text-neutral-500 font-medium">
                Cancel or swap flavors anytime
              </span>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 3: POPULAR PRODUCTS (3-Column Flavor Cards)                      */}
        {/* Dedicated image window fills 100% of its frame                           */}
        {/* ========================================================================= */}
        <section className="space-y-8 sm:space-y-10">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="font-headline text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-900">
              Popular products
            </h2>
            <p className="mt-2 text-sm text-neutral-600 font-medium">
              Explore our core line of gourmet protein refreshments.
            </p>
          </div>

          {/* 3-Column Pillowy Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Chocolate Card */}
            <div className="group rounded-[2.5rem] bg-white p-4 sm:p-5 border border-neutral-200/90 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
              {/* Image box filled 100% */}
              <div className="relative w-full h-64 sm:h-72 rounded-[2rem] overflow-hidden bg-neutral-950 shadow-inner">
                <img
                  src="/initial_frames/chocolate_189.png"
                  alt="PRO LIFE Dutch Chocolate"
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-108"
                />
                <div className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-bold text-white border border-white/20">
                  🍫 Dutch Chocolate
                </div>
                <div className="absolute top-3.5 right-3.5 px-2.5 py-1 rounded-full bg-amber-500 text-[11px] font-bold text-black font-headline">
                  26g Protein
                </div>
                <button
                  onClick={() => {
                    onSelectFlavor('chocolate');
                    onScrollToHero();
                  }}
                  className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-white/90 hover:bg-white text-neutral-900 font-headline text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer opacity-90 group-hover:opacity-100"
                >
                  3D View ↗
                </button>
              </div>

              <div className="p-3 pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-headline font-bold text-base text-neutral-900">
                      Dutch Chocolate
                    </h3>
                    <div className="text-xs text-neutral-500">12 × 330ml Case</div>
                  </div>
                  <span className="font-headline font-extrabold text-lg text-neutral-900">
                    ₹299
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1 text-amber-500 text-xs">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="text-neutral-900 font-bold ml-1">4.9</span>
                    <span className="text-neutral-400">(580)</span>
                  </div>
                  <button
                    onClick={() => handleQuickAdd('Dutch Chocolate Case')}
                    className="px-4 py-2 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white font-headline text-xs font-bold transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Strawberry Card */}
            <div className="group rounded-[2.5rem] bg-white p-4 sm:p-5 border border-neutral-200/90 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
              {/* Image box filled 100% */}
              <div className="relative w-full h-64 sm:h-72 rounded-[2rem] overflow-hidden bg-neutral-950 shadow-inner">
                <img
                  src="/initial_frames/strawberry_189.png"
                  alt="PRO LIFE Wild Strawberry"
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-108"
                />
                <div className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-bold text-white border border-white/20">
                  🍓 Wild Strawberry
                </div>
                <div className="absolute top-3.5 right-3.5 px-2.5 py-1 rounded-full bg-rose-500 text-[11px] font-bold text-white font-headline">
                  26g Protein
                </div>
                <button
                  onClick={() => {
                    onSelectFlavor('strawberry');
                    onScrollToHero();
                  }}
                  className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-white/90 hover:bg-white text-neutral-900 font-headline text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer opacity-90 group-hover:opacity-100"
                >
                  3D View ↗
                </button>
              </div>

              <div className="p-3 pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-headline font-bold text-base text-neutral-900">
                      Wild Strawberry
                    </h3>
                    <div className="text-xs text-neutral-500">12 × 330ml Case</div>
                  </div>
                  <span className="font-headline font-extrabold text-lg text-neutral-900">
                    ₹299
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1 text-amber-500 text-xs">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="text-neutral-900 font-bold ml-1">5.0</span>
                    <span className="text-neutral-400">(420)</span>
                  </div>
                  <button
                    onClick={() => handleQuickAdd('Wild Strawberry Case')}
                    className="px-4 py-2 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white font-headline text-xs font-bold transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Cookies & Cream Card */}
            <div className="group rounded-[2.5rem] bg-white p-4 sm:p-5 border border-neutral-200/90 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
              {/* Image box filled 100% */}
              <div className="relative w-full h-64 sm:h-72 rounded-[2rem] overflow-hidden bg-neutral-950 shadow-inner">
                <img
                  src="/initial_frames/cookies_189.png"
                  alt="PRO LIFE Cookies and Cream"
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-108"
                />
                <div className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-bold text-white border border-white/20">
                  🍪 Cookies & Cream
                </div>
                <div className="absolute top-3.5 right-3.5 px-2.5 py-1 rounded-full bg-amber-400 text-[11px] font-bold text-black font-headline">
                  26g Protein
                </div>
                <button
                  onClick={() => {
                    onSelectFlavor('cookies');
                    onScrollToHero();
                  }}
                  className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-white/90 hover:bg-white text-neutral-900 font-headline text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer opacity-90 group-hover:opacity-100"
                >
                  3D View ↗
                </button>
              </div>

              <div className="p-3 pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-headline font-bold text-base text-neutral-900">
                      Cookies & Cream
                    </h3>
                    <div className="text-xs text-neutral-500">12 × 330ml Case</div>
                  </div>
                  <span className="font-headline font-extrabold text-lg text-neutral-900">
                    ₹299
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1 text-amber-500 text-xs">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="text-neutral-900 font-bold ml-1">4.9</span>
                    <span className="text-neutral-400">(610)</span>
                  </div>
                  <button
                    onClick={() => handleQuickAdd('Cookies & Cream Case')}
                    className="px-4 py-2 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white font-headline text-xs font-bold transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 4: TRY THE SAMPLER (Discovery Pack)                              */}
        {/* Large featured card where the image fills 100% of the box                */}
        {/* ========================================================================= */}
        <section className="space-y-6 sm:space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="font-headline text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 leading-tight">
              Try the sampler
            </h2>
            <p className="mt-2 text-sm text-neutral-600 font-medium">
              Cannot decide? Experience all three award-winning flavors in one discovery bundle.
            </p>
          </div>

          <div className="relative rounded-[2.5rem] overflow-hidden min-h-[380px] sm:min-h-[460px] shadow-2xl border border-neutral-300/80 group bg-neutral-950">
            <img
              src="/initial_frames/cookies_189.png"
              alt="PRO LIFE Discovery Sampler"
              className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/35 pointer-events-none" />

            <div className="relative z-10 p-6 sm:p-12 flex flex-col justify-between h-full min-h-[380px] sm:min-h-[460px]">
              <div className="flex items-center justify-between">
                <span className="px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold font-headline uppercase tracking-wider">
                  Discovery 6-Pack Bundle
                </span>
                <span className="font-headline font-extrabold text-2xl text-amber-400">
                  ₹299
                </span>
              </div>

              <div className="max-w-xl space-y-3">
                <h3 className="font-headline text-2xl sm:text-4xl font-black text-white leading-tight">
                  All 3 signature flavors in one discovery pack
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal">
                  Includes 2 × Dutch Chocolate, 2 × Wild Strawberry, and 2 × Cookies & Cream with free cold-pack delivery.
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => handleQuickAdd('Signature 6-Pack Sampler')}
                    className="px-7 py-3 rounded-full bg-white hover:bg-neutral-100 text-neutral-900 font-headline text-xs font-bold tracking-wide uppercase transition-all shadow-xl active:scale-95 cursor-pointer flex items-center gap-2"
                  >
                    <span>Order Sampler Pack · ₹299</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs text-neutral-300">
                    Free shipping · 30-Day Guarantee
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 5: BEST SELLERS PACK & CRAFTSMANSHIP                             */}
        {/* Split container with edge-to-edge media window                           */}
        {/* ========================================================================= */}
        <section className="relative rounded-[2.5rem] bg-[#FFF9EE] p-6 sm:p-10 lg:p-12 border border-amber-200/80 overflow-hidden shadow-xl shadow-amber-900/5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Text & Actions */}
            <div className="lg:col-span-7 space-y-5">
              <span className="text-xs font-bold font-headline uppercase tracking-widest text-amber-700">
                Most Popular Choice
              </span>
              <h2 className="font-headline text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 leading-tight">
                Best sellers pack
              </h2>
              <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-normal">
                These are our best sellers for a reason. From nostalgic rich chocolate to refreshing berry blends, it is an elevated journey for your taste buds every time you crack open a cold can.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => handleQuickAdd('Best Sellers 24-Pack')}
                  className="px-7 py-3 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white font-headline text-xs font-bold tracking-wider uppercase transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  Buy Now · ₹299
                </button>
                <button
                  onClick={() => {
                    const el = document.getElementById('ingredients-details');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-xs font-bold text-neutral-900 hover:underline tracking-wide cursor-pointer py-2"
                >
                  View Ingredients & Macros ↓
                </button>
              </div>
            </div>

            {/* Right Column: Full-bleed product visual box */}
            <div className="lg:col-span-5 relative w-full h-64 sm:h-80 lg:h-72 rounded-3xl overflow-hidden shadow-xl border border-neutral-300/60 group bg-neutral-950">
              <img
                src="/initial_frames/chocolate_189.png"
                alt="PRO LIFE Best Sellers Pack"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-bold font-headline">
                24-Pack Custom Case
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 6: INGREDIENTS TRANSPARENCY & COMPARISON                         */}
        {/* ========================================================================= */}
        <section id="ingredients-details" className="space-y-8 scroll-mt-24">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="font-headline text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900">
              Clean ingredients. <br />
              Uncompromising standards.
            </h2>
            <p className="mt-2 text-sm text-neutral-600 font-medium">
              See how PRO LIFE compares against generic shelf-stable protein shakes.
            </p>
          </div>

          <div className="overflow-hidden rounded-3xl bg-white border border-neutral-200 shadow-md">
            <div className="grid grid-cols-3 p-4 sm:p-6 bg-neutral-100/70 border-b border-neutral-200 text-xs font-headline font-bold text-neutral-800 uppercase tracking-wider">
              <div>Metric / Spec</div>
              <div className="text-center text-amber-700 font-black">PRO LIFE</div>
              <div className="text-center text-neutral-500">Generic Shakes</div>
            </div>

            <div className="divide-y divide-neutral-200 text-xs sm:text-sm">
              <div className="grid grid-cols-3 p-4 sm:p-5 items-center">
                <div className="font-semibold text-neutral-900">Protein Source</div>
                <div className="text-center font-bold text-emerald-600">Pure Whey Isolate</div>
                <div className="text-center text-neutral-500">Whey Concentrate / Soy</div>
              </div>

              <div className="grid grid-cols-3 p-4 sm:p-5 items-center">
                <div className="font-semibold text-neutral-900">Protein Per Can</div>
                <div className="text-center font-bold font-headline text-neutral-900">26 Grams</div>
                <div className="text-center text-neutral-500">14 - 18 Grams</div>
              </div>

              <div className="grid grid-cols-3 p-4 sm:p-5 items-center">
                <div className="font-semibold text-neutral-900">Added Sugar</div>
                <div className="text-center font-bold text-emerald-600">0 Grams</div>
                <div className="text-center text-neutral-500">8 - 14 Grams</div>
              </div>

              <div className="grid grid-cols-3 p-4 sm:p-5 items-center">
                <div className="font-semibold text-neutral-900">Flavor Method</div>
                <div className="text-center font-bold text-neutral-900">Real Fruit / Cocoa Puree</div>
                <div className="text-center text-neutral-500">Artificial Syrups & Flavors</div>
              </div>

              <div className="grid grid-cols-3 p-4 sm:p-5 items-center">
                <div className="font-semibold text-neutral-900">Digestibility</div>
                <div className="text-center font-bold text-emerald-600">Lactose-Free & Light</div>
                <div className="text-center text-neutral-500">Bloating & Chalk Finish</div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 7: ATHLETE & COMMUNITY REVIEWS                                   */}
        {/* ========================================================================= */}
        <section className="space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="font-headline text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900">
              Loved by athletes & creators
            </h2>
            <p className="mt-2 text-sm text-neutral-600 font-medium">
              Over 1,600 verified five-star ratings across all three flavors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-neutral-200/90 shadow-sm space-y-4">
              <div className="flex items-center gap-1 text-amber-500 text-xs">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-sm text-neutral-700 italic leading-relaxed">
                &ldquo;I have tried every protein drink on the market for 10 years. Nothing compares to Pro Life Dutch Chocolate. It tastes like melted artisanal gelato with 26g of pure protein.&rdquo;
              </p>
              <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-neutral-900 block">Marcus Vance</span>
                  <span className="text-neutral-500">Strength & Conditioning Coach</span>
                </div>
                <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full text-[11px]">
                  Verified
                </span>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-neutral-200/90 shadow-sm space-y-4">
              <div className="flex items-center gap-1 text-amber-500 text-xs">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-sm text-neutral-700 italic leading-relaxed">
                &ldquo;Wild Strawberry is unbelievable over ice after a 15-mile run. Crisp, light, zero gut distress, and refreshes you instantly.&rdquo;
              </p>
              <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-neutral-900 block">Elena Chen</span>
                  <span className="text-neutral-500">Marathon Runner</span>
                </div>
                <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full text-[11px]">
                  Verified
                </span>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-neutral-200/90 shadow-sm space-y-4">
              <div className="flex items-center gap-1 text-amber-500 text-xs">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-sm text-neutral-700 italic leading-relaxed">
                &ldquo;Cookies & Cream genuinely tastes like dessert. 0g sugar and only 185 calories feels like a cheat code for macro tracking.&rdquo;
              </p>
              <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-neutral-900 block">David Kim</span>
                  <span className="text-neutral-500">CrossFit Athlete</span>
                </div>
                <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full text-[11px]">
                  Verified
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 8: FAQ ACCORDION                                                 */}
        {/* ========================================================================= */}
        <section className="max-w-3xl mx-auto space-y-6">
          <div className="text-center">
            <h2 className="font-headline text-3xl font-extrabold tracking-tight text-neutral-900">
              Frequently asked questions
            </h2>
          </div>

          <div className="divide-y divide-neutral-200 rounded-3xl bg-white border border-neutral-200 overflow-hidden shadow-sm">
            {faqs.map((item, idx) => (
              <div key={idx} className="p-5 sm:p-6 transition-colors">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between gap-4 text-left font-headline font-bold text-base text-neutral-900 cursor-pointer"
                >
                  <span>{item.q}</span>
                  <span className="p-1 rounded-full bg-neutral-100 shrink-0">
                    {openFaq === idx ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </span>
                </button>
                {openFaq === idx && (
                  <p className="mt-3 text-sm text-neutral-600 leading-relaxed font-normal">
                    {item.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 9: CALL TO ACTION BANNER                                         */}
        {/* ========================================================================= */}
        <section className="rounded-[2.5rem] bg-neutral-900 text-white p-8 sm:p-14 lg:p-16 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="w-72 h-72 rounded-full bg-amber-500/15 blur-3xl absolute -top-12 -left-12 pointer-events-none" />
          <div className="w-72 h-72 rounded-full bg-rose-500/15 blur-3xl absolute -bottom-12 -right-12 pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="font-headline text-xs font-bold uppercase tracking-widest text-amber-400">
              Elevate Your Daily Nutrition
            </span>
            <h2 className="font-headline text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Ready to taste the future of protein?
            </h2>
            <p className="text-sm sm:text-base text-neutral-300 max-w-lg mx-auto">
              Join thousands who have upgraded their recovery. Try a 12-pack today with our 30-Day Zero-Risk Taste Guarantee.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => handleQuickAdd('12-Pack Case')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white hover:bg-neutral-100 text-neutral-900 font-headline text-sm font-bold tracking-wide transition-all shadow-xl active:scale-95 cursor-pointer"
              >
                Order Case · ₹299
              </button>
              <button
                onClick={onScrollToHero}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/15 text-white font-headline text-sm font-bold tracking-wide transition-all border border-white/20 active:scale-95 cursor-pointer"
              >
                Replay 3D Hero ↗
              </button>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 10: MODERN LIGHT FOOTER                                          */}
        {/* ========================================================================= */}
        <footer className="pt-12 pb-8 border-t border-neutral-300/60 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="font-headline text-2xl font-black tracking-tight text-neutral-900">
                PRO LIFE
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed">
                The world&apos;s best-tasting protein drinks. Pure cold-microfiltered whey isolate, zero added sugar, and 100% authentic flavor.
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="font-headline font-bold text-neutral-900 uppercase tracking-wider mb-2">
                Flavors
              </div>
              <div>
                <button
                  onClick={() => {
                    onSelectFlavor('chocolate');
                    onScrollToHero();
                  }}
                  className="text-neutral-600 hover:text-neutral-900 cursor-pointer"
                >
                  Dutch Chocolate
                </button>
              </div>
              <div>
                <button
                  onClick={() => {
                    onSelectFlavor('strawberry');
                    onScrollToHero();
                  }}
                  className="text-neutral-600 hover:text-neutral-900 cursor-pointer"
                >
                  Wild Strawberry
                </button>
              </div>
              <div>
                <button
                  onClick={() => {
                    onSelectFlavor('cookies');
                    onScrollToHero();
                  }}
                  className="text-neutral-600 hover:text-neutral-900 cursor-pointer"
                >
                  Cookies & Cream
                </button>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="font-headline font-bold text-neutral-900 uppercase tracking-wider mb-2">
                Brand & Science
              </div>
              <div><span className="text-neutral-600">Micro-Filtration</span></div>
              <div><span className="text-neutral-600">Informed-Sport Certified</span></div>
              <div><span className="text-neutral-600">Sustainability & Aluminum</span></div>
              <div><span className="text-neutral-600">Wholesale & Gym Partners</span></div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="font-headline font-bold text-neutral-900 uppercase tracking-wider">
                Stay In The Loop
              </div>
              <p className="text-neutral-500">
                Get 10% off your first case and VIP access to limited seasonal flavors.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 rounded-xl bg-white border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
                <button
                  onClick={() => alert('Subscribed to PRO LIFE VIP drops!')}
                  className="px-4 py-2 rounded-xl bg-neutral-900 text-white font-bold text-xs hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Join
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-neutral-200 text-xs text-neutral-500">
            <div>
              &copy; {new Date().getFullYear()} PRO LIFE Beverage Corp. All rights reserved.
            </div>
            <div className="flex items-center gap-6">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Shipping & Returns</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
