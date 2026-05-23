export interface QuickMod {
  id: string;
  label: string;
  category: string;
  description: string;
}

export const QUICK_MODS: QuickMod[] = [
  // Setup & Intro
  { id: 'mod-1', label: 'In Media Res Start', category: 'Intro Beat', description: 'Begin directly inside the action to hook the audience.' },
  { id: 'mod-2', label: 'Atmospheric Fog', category: 'Intro Beat', description: 'Immersive low mist and stark, silhouetted forms.' },
  { id: 'mod-3', label: 'Crane Zoom-In', category: 'Camera Action', description: 'Cinematic symmetrical dive shifting from high to low angle.' },
  { id: 'mod-4', label: 'Anamorphic Flare', category: 'Visual Flair', description: 'Horizontal cinematic streaks across light sources.' },
  
  // Mid Narrative
  { id: 'mod-5', label: 'Dramatic Match Cut', category: 'Editing Action', description: 'Juxtapose geometric symmetry across transition limits.' },
  { id: 'mod-6', label: 'Rising Synths Swell', category: 'Audio Plan', description: 'Frequencies rising steadily in time with editing blocks.' },
  { id: 'mod-7', label: 'Whip Pan Transition', category: 'Camera Action', description: 'Ultra-fast blurred sweep linking distinct sets recursively.' },
  { id: 'mod-8', label: 'Kinetic Dolly Zoom', category: 'Camera Action', description: 'Descent into perspective warp while locking subject scale.' },

  // peak climax
  { id: 'mod-9', label: 'Oversaturated Surge', category: 'Visual Flair', description: 'Saturate chromatic bands to denote active overload.' },
  { id: 'mod-10', label: 'Slow-Motion Shatter', category: 'Pacing Beat', description: 'Dilate critical fractions of seconds to emphasize impact.' },
  { id: 'mod-11', label: 'Sub-Frame Stutter', category: 'Editing Action', description: 'Eerie frame duplicates mimicking temporal turbulence.' },
  { id: 'mod-12', label: 'Digital Artifact Haze', category: 'Visual Flair', description: 'Simulated chromatic aberration and bitstream drops.' },

  // resolution
  { id: 'mod-13', label: 'Ascending Crane Drifting', category: 'Camera Action', description: 'Floating vertical retreat to expand the ultimate frame.' },
  { id: 'mod-14', label: 'Fading Warm Horizon', category: 'Visual Flair', description: 'Glow transitions washing out into soft golden light.' },
  { id: 'mod-15', label: 'Reverberant Trail', category: 'Audio Plan', description: 'Sound filters leaving lingering echoes in silent fields.' },
  { id: 'mod-16', label: 'Defocus Dissolve', category: 'Editing Action', description: 'Smooth fading while slowly blurring the lens elements.' }
];
