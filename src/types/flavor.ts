export type FlavorId = 'chocolate' | 'strawberry' | 'cookies';

export interface FlavorConfig {
  id: FlavorId;
  name: string;
  tagline: string;
  subtitle: string;
  shortLabel: string;
  emoji: string;
  accentColor: string;
  accentRgb: string;
  glowColor: string;
  ambientGradient: string;
  supabaseFolder: string;
  frameCount: number;
  initialLocalFrame: string;
  finalLocalFrame: string;
  specs: {
    protein: string;
    calories: string;
    sugar: string;
    bcaa: string;
  };
  highlights: string[];
}

export const FLAVORS: Record<FlavorId, FlavorConfig> = {
  chocolate: {
    id: 'chocolate',
    name: 'Chocolate',
    tagline: 'Deep Belgian Cocoa & Silky Cream',
    subtitle: 'Best Flavored Protein Drinks',
    shortLabel: 'Chocolate',
    emoji: '🍫',
    accentColor: '#c8874a',
    accentRgb: '200, 135, 74',
    glowColor: 'rgba(168, 85, 34, 0.45)',
    ambientGradient: 'radial-gradient(circle at 50% 48%, rgba(158, 86, 40, 0.78) 0%, rgba(78, 36, 16, 0.95) 65%, #2a1208 100%)',
    supabaseFolder: 'ezgif-split',
    frameCount: 190,
    initialLocalFrame: '/initial_frames/chocolate_000.webp',
    finalLocalFrame: '/initial_frames/chocolate_189.webp',
    specs: {
      protein: '26g',
      calories: '180 kcal',
      sugar: '0g Added',
      bcaa: '5.5g'
    },
    highlights: ['Real Dutch Cocoa', 'Micro-Filtered Whey', 'Zero Chalky Aftertaste']
  },
  strawberry: {
    id: 'strawberry',
    name: 'Strawberry',
    tagline: 'Sun-Ripened Berries & Fresh Sweet Milk',
    subtitle: 'Best Flavored Protein Drinks',
    shortLabel: 'Strawberry',
    emoji: '🍓',
    accentColor: '#fb7185',
    accentRgb: '251, 113, 133',
    glowColor: 'rgba(244, 63, 94, 0.45)',
    ambientGradient: 'radial-gradient(circle at 50% 48%, rgba(190, 42, 82, 0.78) 0%, rgba(102, 16, 44, 0.95) 65%, #380919 100%)',
    supabaseFolder: 'ezgif-split%20(1)',
    frameCount: 190,
    initialLocalFrame: '/initial_frames/strawberry_000.webp',
    finalLocalFrame: '/initial_frames/strawberry_189.webp',
    specs: {
      protein: '26g',
      calories: '175 kcal',
      sugar: '0g Added',
      bcaa: '5.4g'
    },
    highlights: ['Real Strawberry Puree', 'Velvety Smooth', 'Electrolyte Infused']
  },
  cookies: {
    id: 'cookies',
    name: 'Cookies & Cream',
    tagline: 'Crushed Dark Biscuit & Sweet Cream',
    subtitle: 'Best Flavored Protein Drinks',
    shortLabel: 'Cookies & Cream',
    emoji: '🍪',
    accentColor: '#e0a96d',
    accentRgb: '224, 169, 109',
    glowColor: 'rgba(217, 169, 109, 0.45)',
    ambientGradient: 'radial-gradient(circle at 50% 48%, rgba(148, 106, 72, 0.78) 0%, rgba(74, 52, 36, 0.95) 65%, #261a12 100%)',
    supabaseFolder: 'ezgif-split%20(2)',
    frameCount: 190,
    initialLocalFrame: '/initial_frames/cookies_000.webp',
    finalLocalFrame: '/initial_frames/cookies_189.webp',
    specs: {
      protein: '26g',
      calories: '185 kcal',
      sugar: '0g Added',
      bcaa: '5.6g'
    },
    highlights: ['Dark Cookie Crunch', 'Madagascar Vanilla', 'Ultra Creamy Texture']
  }
};
