export interface VideoStyle {
  id: string;
  name: string;
  color: string;
  gradient: string;
  description: string;
  filterClass: string;
}

export const VIDEO_STYLES: VideoStyle[] = [
  {
    id: 'cinematic-noir',
    name: 'Cinematic Noir',
    color: 'from-neutral-900 to-neutral-700',
    gradient: 'linear-gradient(to bottom right, #171717, #404040)',
    description: 'Crisp high-contrast monochrome with deep dramatic shadows.',
    filterClass: 'grayscale contrast-125 brightness-90',
  },
  {
    id: 'cyberpunk-neon',
    name: 'Cyberpunk Neon',
    color: 'from-violet-900 via-fuchsia-900 to-cyan-900',
    gradient: 'linear-gradient(to bottom right, #4c1d95, #701a75, #164e63)',
    description: 'Saturated ultraviolet highlights paired with futuristic neon haze.',
    filterClass: 'hue-rotate-15 contrast-110 saturate-150',
  },
  {
    id: 'warm-vintage',
    name: 'Warm Vintage',
    color: 'from-amber-950 via-amber-900 to-yellow-950',
    gradient: 'linear-gradient(to bottom right, #451a03, #78350f, #422006)',
    description: 'Cozy golden tones, aged film grains, and warm nostaligic glow.',
    filterClass: 'sepia contrast-95 saturate-110 brightness-105',
  },
  {
    id: 'editorial-fade',
    name: 'Editorial Fade',
    color: 'from-emerald-950 to-stone-900',
    gradient: 'linear-gradient(to bottom right, #022c22, #1c1917)',
    description: 'Subdued earthy colors, soft contrast, and matte shadows.',
    filterClass: 'saturate-75 contrast-90 brightness-100 sepia-10',
  },
  {
    id: 'scifi-hologram',
    name: 'Sci-Fi Hologram',
    color: 'from-blue-950 via-teal-900 to-neutral-950',
    gradient: 'linear-gradient(to bottom right, #172554, #134e4a, #0a0a0a)',
    description: 'Cool scanline static, technical teal overlays, and electric currents.',
    filterClass: 'hue-rotate-180 contrast-115 brightness-110 saturate-125 saturate-200',
  },
];
