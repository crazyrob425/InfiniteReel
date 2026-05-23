export interface SuggestionItem {
  id: string;
  label: string;
  type: 'keyword' | 'mod' | 'idea' | 'camera' | 'style' | 'lipsync' | 'transition' | 'lighting' | 'motion' | 'vfx';
  description?: string;
}

export const SUGGESTIONS: SuggestionItem[] = [
  // Camera Movements
  { id: 'cam-pan', label: 'Pan Left to Right', type: 'camera', description: 'Smooth horizontal movement' },
  { id: 'cam-tilt', label: 'Tilt Up', type: 'camera', description: 'Vertical rotation' },
  { id: 'cam-dolly', label: 'Dolly In', type: 'camera', description: 'Move camera physically closer' },
  { id: 'cam-zoom', label: 'Slow Zoom', type: 'camera', description: 'Focus on a detail' },
  { id: 'cam-drone', label: 'Drone Flyover', type: 'camera', description: 'Aerial sweeping shot' },
  { id: 'cam-tracking', label: 'Tracking Shot', type: 'camera', description: 'Follow the subject closely' },
  { id: 'cam-crane', label: 'Crane Shot', type: 'camera', description: 'Sweeping upward movement' },
  { id: 'cam-dutch', label: 'Dutch Angle', type: 'camera', description: 'Tilted horizon for tension' },
  { id: 'cam-pov', label: 'First Person POV', type: 'camera', description: 'From the perspective of the subject' },
  { id: 'cam-orbit', label: '360 Orbit', type: 'camera', description: 'Rotate fully around the subject' },
  { id: 'cam-handheld', label: 'Handheld Camera', type: 'camera', description: 'Slightly shaky, documentary feel' },
  { id: 'cam-crash zoom', label: 'Crash Zoom', type: 'camera', description: 'Rapid zoom to highlight action' },
  { id: 'cam-pullback', label: 'Pull Back', type: 'camera', description: 'Widen out to reveal surroundings' },
  
  // Lighting & Mood
  { id: 'light-golden', label: 'Golden Hour', type: 'lighting', description: 'Warm, low-angle sunlight' },
  { id: 'light-neon', label: 'Neon Glow', type: 'lighting', description: 'Vibrant cyberpunk lighting' },
  { id: 'light-volumetric', label: 'Volumetric Fog', type: 'lighting', description: 'Light rays through mist' },
  { id: 'light-moody', label: 'Moody Shadows', type: 'lighting', description: 'High contrast, noir feel' },
  { id: 'light-soft', label: 'Soft Diffused', type: 'lighting', description: 'Gentle, even lighting' },
  { id: 'light-cinematic', label: 'Cinematic Lighting', type: 'lighting', description: 'Three-point studio lighting' },
  { id: 'light-lensflare', label: 'Lens Flares', type: 'lighting', description: 'Anamorphic lens light artifacts' },
  { id: 'light-backlit', label: 'Backlit Silhouette', type: 'lighting', description: 'Subject in shadow with bright background' },
  { id: 'light-rim', label: 'Rim Lighting', type: 'lighting', description: 'Outline of light separating subject from background' },
  { id: 'light-glow', label: 'Ethereal Glow', type: 'lighting', description: 'Soft, magical aura' },
  { id: 'light-strobe', label: 'Strobe Lights', type: 'lighting', description: 'Flashing, energetic club lighting' },
  { id: 'light-borelial', label: 'Aurora Borealis', type: 'lighting', description: 'Northern lights glow' },

  // Visual Modifiers (Mods)
  { id: 'mod-4k', label: '4k Resolution', type: 'mod', description: 'Ultra high detail' },
  { id: 'mod-masterpiece', label: 'Masterpiece', type: 'mod', description: 'Highest aesthetic quality' },
  { id: 'mod-photorealistic', label: 'Photorealistic', type: 'mod', description: 'Indistinguishable from reality' },
  { id: 'mod-hyper-detailed', label: 'Hyper-Detailed', type: 'mod', description: 'Focus on intricate textures' },
  { id: 'mod-dynamic', label: 'Dynamic Action', type: 'mod', description: 'Fast-paced movement and energy' },
  { id: 'mod-vhs', label: 'VHS Vintage', type: 'mod', description: 'Retro analog tape aesthetic' },
  { id: 'mod-film', label: '35mm Film', type: 'mod', description: 'Classic cinematic film grain' },
  { id: 'mod-anime', label: 'Studio Anime', type: 'mod', description: 'High quality anime style' },
  { id: 'mod-clay', label: 'Claymation', type: 'mod', description: 'Stop motion clay aesthetic' },
  { id: 'mod-3d', label: 'Unreal Engine 5', type: 'mod', description: 'High-end 3D render' },
  { id: 'mod-watercolor', label: 'Watercolor Painting', type: 'mod', description: 'Fluid, artistic brush strokes' },
  { id: 'mod-glitch', label: 'Glitch Art', type: 'mod', description: 'Digital distortion and displacement' },
  { id: 'mod-polaroid', label: 'Polaroid Look', type: 'mod', description: 'Instant camera colors and border' },
  { id: 'mod-noir', label: 'Film Noir', type: 'mod', description: 'Black and white, high contrast' },

  // Lip Sync
  { id: 'sync-singing', label: 'Expressive Singing Lip Sync', type: 'lipsync', description: 'Wide mouth movements, matched to vocals' },
  { id: 'sync-speaking', label: 'Natural Speaking Lip Sync', type: 'lipsync', description: 'Subtle, conversational mouth movements' },
  { id: 'sync-shouting', label: 'Aggressive Shouting Sync', type: 'lipsync', description: 'High energy, wide jaw movements' },
  { id: 'sync-whispering', label: 'Whispering Sync', type: 'lipsync', description: 'Minimal jaw movement, breathy texture' },
  { id: 'sync-rapping', label: 'Fast Rap Lip Sync', type: 'lipsync', description: 'Rapid, precise rhythmic articulation' },
  { id: 'sync-chorus', label: 'Group Chorus Sync', type: 'lipsync', description: 'Multiple characters singing in unison' },

  // Transitions
  { id: 'trans-seamless', label: 'Seamless Match Cut', type: 'transition', description: 'Visual continuity between clips' },
  { id: 'trans-glitch', label: 'Digital Glitch Mosh', type: 'transition', description: 'Data-moshing transition' },
  { id: 'trans-morph', label: 'AI Deep Morph', type: 'transition', description: 'Smooth ai-generated morphing between subjects' },
  { id: 'trans-whip', label: 'Whip Pan Transition', type: 'transition', description: 'Fast blur pan connecting shots' },
  { id: 'trans-zoom-trans', label: 'Infinite Zoom Cut', type: 'transition', description: 'Zoom through an object into the next scene' },
  { id: 'trans-fade-black', label: 'Fade to Black', type: 'transition', description: 'Classic cinematic fade' },
  { id: 'trans-fade-white', label: 'Flash to White', type: 'transition', description: 'Overexposure flash transition' },
  { id: 'trans-luma', label: 'Luma Fade', type: 'transition', description: 'Transition based on brightness thresholds' },
  { id: 'trans-wipe', label: 'Clock Wipe', type: 'transition', description: 'Classic circular progression wipe' },

  // VFX
  { id: 'vfx-sparks', label: 'Embers & Sparks', type: 'vfx', description: 'Floating fire particles' },
  { id: 'vfx-rain', label: 'Cinematic Rain', type: 'vfx', description: 'Heavy, moody rain droplets' },
  { id: 'vfx-snow', label: 'Falling Snow', type: 'vfx', description: 'Gentle, atmospheric snowfall' },
  { id: 'vfx-dust', label: 'Dust Motes', type: 'vfx', description: 'Particles floating in light rays' },
  { id: 'vfx-lightning', label: 'Lightning Flashes', type: 'vfx', description: 'Sudden electric bursts' },
  { id: 'vfx-fire', label: 'Raging Fire', type: 'vfx', description: 'Intense background flames' },
  { id: 'vfx-magic', label: 'Magic Energy Aura', type: 'vfx', description: 'Glowing magical effects' },

  // Motion & Tempo
  { id: 'motion-slomo', label: 'Extreme Slow Motion', type: 'motion', description: 'Bullet time style slowdown' },
  { id: 'motion-timelapse', label: 'Hyper Time-lapse', type: 'motion', description: 'Extremely sped up passage of time' },
  { id: 'motion-stopmo', label: 'Stop Motion Jitter', type: 'motion', description: 'Reduced frame rate for a hand-animated feel' },
  { id: 'motion-reverse', label: 'Reverse Footage', type: 'motion', description: 'Time flowing backward' },
  { id: 'motion-boomerang', label: 'Boomerang Loop', type: 'motion', description: 'Play forward then backward repeatedly' },
  { id: 'motion-beatsync', label: 'Beat Sync Cuts', type: 'motion', description: 'Hard cuts exactly on audio peaks/bpm' },

  // Concepts/Ideas
  { id: 'idea-journey', label: 'A Journey Through Time', type: 'idea', description: 'Evolving landscapes over eras' },
  { id: 'idea-nature', label: 'Nature Reclamation', type: 'idea', description: 'Plants growing over abandoned cities' },
  { id: 'idea-cyber', label: 'Cybernetic Evolution', type: 'idea', description: 'Human merging with machine' },
  { id: 'idea-ocean', label: 'Abyssal Exploration', type: 'idea', description: 'Deep sea bioluminescent creatures' },
  { id: 'idea-space', label: 'Nebula Birth', type: 'idea', description: 'Cosmic gasses forming a star' },
  // ... MORE CONCEPTS
  { id: 'idea-multiverse', label: 'Multiverse Shatter', type: 'idea', description: 'Reality fracturing into multiple dimensions' },
  { id: 'idea-steampunk', label: 'Steampunk Metropolis', type: 'idea', description: 'Brass, steam, and clockwork cityscapes' },
  { id: 'idea-biotech', label: 'Biotech Fusion', type: 'idea', description: 'Organic plant life merging with electronics' },
  { id: 'idea-postapoc', label: 'Post-Apocalyptic Wasteland', type: 'idea', description: 'Deserted ruins of a fallen civilization' },
  { id: 'idea-micro', label: 'Microscopic World', type: 'idea', description: 'Cellular level, floating atoms and proteins' },
  { id: 'idea-fantasy', label: 'High Fantasy Realm', type: 'idea', description: 'Castles, dragons, and ethereal magic' },
  { id: 'idea-abstract', label: 'Abstract Geometry', type: 'idea', description: 'Floating impossible shapes and illusions' },
  { id: 'idea-synthwave', label: 'Retro Synthwave Grid', type: 'idea', description: '80s cyber grid, sunset, and vector lines' },

  // Expand Transitions
  { id: 'trans-iris', label: 'Iris Wipe', type: 'transition', description: 'Classic circle closing into the next scene' },
  { id: 'trans-lightleak', label: 'Light Leak Transition', type: 'transition', description: 'Analog film light burn crossing frames' },
  { id: 'trans-tvstatic', label: 'TV Static Cut', type: 'transition', description: 'CRT television turning off/on' },
  { id: 'trans-zoomblur', label: 'Zoom Blur Cut', type: 'transition', description: 'Radial blur speeding into the next shot' },
  { id: 'trans-spin', label: 'Camera Spin Cut', type: 'transition', description: 'Fast 180 degree rotation into next clip' },
  { id: 'trans-dissolve', label: 'Cross Dissolve', type: 'transition', description: 'Slow fading bleed between images' },
  { id: 'trans-ink', label: 'Ink Drop Reveal', type: 'transition', description: 'Spreading water color ink over the frame' },
  { id: 'trans-smash', label: 'Glass Smash', type: 'transition', description: 'Screen breaking to reveal what is behind' },
  { id: 'trans-swipe', label: 'Directional Swipe', type: 'transition', description: 'Hard edge line moving across the screen' },
  { id: 'trans-luma-key', label: 'Luma Key Bleed', type: 'transition', description: 'Highlights burning through the frame first' },

  // Expand Cameras
  { id: 'cam-snell', label: 'SnorriCam / Body Mount', type: 'camera', description: 'Camera attached to the actor moving with them' },
  { id: 'cam-macro', label: 'Extreme Macro', type: 'camera', description: 'Microscopic detail taking up the frame' },
  { id: 'cam-fisheye', label: 'Fisheye Lens', type: 'camera', description: 'Distorted, ultra-wide angle view' },
  { id: 'cam-vertigo', label: 'Vertigo / Dolly Zoom', type: 'camera', description: 'Zoom in while panning back for spatial distortion' },
  { id: 'cam-low', label: 'Low Angle Hero Shot', type: 'camera', description: 'Looking up at the subject, making them appear powerful' },
  { id: 'cam-high', label: 'High Angle / God View', type: 'camera', description: 'Looking straight down from far above' },
  { id: 'cam-gimbal', label: 'Smooth Gimbal Follow', type: 'camera', description: 'Fluid, stabilization tracking shot' },
  { id: 'cam-whip', label: 'Whip Pan', type: 'camera', description: 'Rapid blur pan to another subject' },
  { id: 'cam-rack', label: 'Rack Focus', type: 'camera', description: 'Shifting focus from foreground to background' },
  { id: 'cam-split', label: 'Split Diopter', type: 'camera', description: 'Both foreground and background in sharp focus' },
  { id: 'cam-fpv', label: 'FPV Drone Dive', type: 'camera', description: 'High speed acrobatic diving shot' },

  // Expand Lighting
  { id: 'light-chiaroscuro', label: 'Chiaroscuro', type: 'lighting', description: 'Renaissance painting high-contrast light and dark' },
  { id: 'light-bouncing', label: 'Bounced Light', type: 'lighting', description: 'Soft, indirect natural lighting' },
  { id: 'light-under', label: 'Underlighting', type: 'lighting', description: 'Spooky, light coming from the floor up' },
  { id: 'light-dappled', label: 'Dappled Sunlight', type: 'lighting', description: 'Light filtered through tree leaves' },
  { id: 'light-gobo', label: 'Window Gobo Shadows', type: 'lighting', description: 'Shadows of blinds or window frames across the scene' },
  { id: 'light-starlight', label: 'Starlight Illumination', type: 'lighting', description: 'Very dim, cold, magical nocturnal light' },
  { id: 'light-biolum', label: 'Bioluminescent Ambient', type: 'lighting', description: 'Glowing organic light from flora/fauna' },
  { id: 'light-fire', label: 'Firelight Flicker', type: 'lighting', description: 'Warm, moving, unstable lighting' },
  { id: 'light-laser', label: 'Laser Grid', type: 'lighting', description: 'Rave-style sharp laser beams crossing the smoke' },
  { id: 'light-flash', label: 'Paparazzi Flashes', type: 'lighting', description: 'Chaotic, bright, immediate bursts of light' },

  // Expand VFX
  { id: 'vfx-hologram', label: 'Holographic Projection', type: 'vfx', description: 'Translucent glowing blue scanlines' },
  { id: 'vfx-portal', label: 'Dimensional Portal', type: 'vfx', description: 'Swirling glowing gateway' },
  { id: 'vfx-chromatic', label: 'Chromatic Aberration', type: 'vfx', description: 'Color fringing on the edges of the lens' },
  { id: 'vfx-bloom', label: 'Optical Bloom', type: 'vfx', description: 'Bright highlights glowing softly' },
  { id: 'vfx-shockwave', label: 'Energy Shockwave', type: 'vfx', description: 'Expanding ring of distortion' },
  { id: 'vfx-timewarp', label: 'Time Warp Trails', type: 'vfx', description: 'Subject leaving motion-blur echoes behind them' },
  { id: 'vfx-pixelate', label: '8-Bit Pixelation', type: 'vfx', description: 'Retro chunky digital squares' },
  { id: 'vfx-wireframe', label: '3D Wireframe', type: 'vfx', description: 'Geometry grid lines showing instead of textures' },
  { id: 'vfx-lensdirt', label: 'Lens Dirt / Smudges', type: 'vfx', description: 'Realistic imperfections on the camera glass' },
  { id: 'vfx-halftone', label: 'Comic Halftone dots', type: 'vfx', description: 'Pop-art style printed dots' },
  { id: 'vfx-filmdamage', label: 'Scratched Film Print', type: 'vfx', description: 'Dust, hair, and vertical scratches' },

  // Expand Mods
  { id: 'mod-gopro', label: 'GoPro Action Cam', type: 'mod', description: 'Ultra-wide, slightly distorted, high energy' },
  { id: 'mod-cctv', label: 'CCTV Security Camera', type: 'mod', description: 'Low frame rate, high contrast b&w, timestamp' },
  { id: 'mod-thermal', label: 'Thermal Imaging', type: 'mod', description: 'Predator vision, heat signatures' },
  { id: 'mod-nightvision', label: 'Night Vision Goggles', type: 'mod', description: 'Green phosphorus glow, grainy' },
  { id: 'mod-infrared', label: 'Infrared Photography', type: 'mod', description: 'White foliage, dark skies, surreal' },
  { id: 'mod-8mm', label: 'Super 8mm Vintage', type: 'mod', description: 'Nostalgic, warm, high grain home movie' },
  { id: 'mod-cyberpunk', label: 'Cyberpunk Aesthetic', type: 'mod', description: 'High tech, low life, neon, rain, grime' },
  { id: 'mod-vaporwave', label: 'Vaporwave', type: 'mod', description: 'Pastel colors, retro tech, greek statues' },
  { id: 'mod-gothic', label: 'Dark Gothic', type: 'mod', description: 'Ornate, dark, moody, bats and gargoyles' },
  { id: 'mod-origami', label: 'Papercraft / Origami', type: 'mod', description: 'Everything made of folded paper' },
  { id: 'mod-lego', label: 'Brick Toy Animation', type: 'mod', description: 'Stop motion using plastic interlocking bricks' },
  { id: 'mod-oil', label: 'Oil Painting on Canvas', type: 'mod', description: 'Thick impasto brush strokes' },
  { id: 'mod-sketch', label: 'Pencil Sketch', type: 'mod', description: 'Rough graphite lines on paper' },
  { id: 'mod-cinemascope', label: 'Cinemascope Anamorphic', type: 'mod', description: 'Ultra widescreen 2.35:1 aspect ratio' },
  { id: 'mod-vray', label: 'V-Ray Render', type: 'mod', description: 'Architectural visualization realism' },

  // Expand Motion
  { id: 'motion-shaky', label: 'Nervous Shaky Cam', type: 'motion', description: 'Anxiety inducing, high motion blur' },
  { id: 'motion-frozen', label: 'Time Stood Still', type: 'motion', description: 'Subject moving but the world is frozen' },
  { id: 'motion-stutter', label: 'Stutter Frames', type: 'motion', description: 'Skipping frames intentionally for aggressive feel' },
  { id: 'motion-smooth', label: 'Butter Smooth 60fps', type: 'motion', description: 'High frame rate, hyper-real fluidity' },
  { id: 'motion-ramp', label: 'Speed Ramping', type: 'motion', description: 'Fast motion slowing down suddenly on impact' },

  // Expand Lip Sync
  { id: 'sync-scream', label: 'Horror Scream Sync', type: 'lipsync', description: 'Extremely wide mouth, vibrating' },
  { id: 'sync-robot', label: 'Robotic Articulation', type: 'lipsync', description: 'Staccato, unnatural segmented mouth movements' },
  { id: 'sync-opera', label: 'Operatic Vibrato Sync', type: 'lipsync', description: 'Tall open mouth, subtle jaw vibration' },
  { id: 'sync-mumble', label: 'Muttering / Mumbling', type: 'lipsync', description: 'Barely open lips, fast subtle movements' },
  
  // More Camera
  { id: 'cam-snapper', label: 'Fast Snap Zoom', type: 'camera', description: 'Like a 70s功夫 movie zoom in' },
  { id: 'cam-slider', label: 'Slider Push', type: 'camera', description: 'Ultra smooth linear push forward' },
  { id: 'cam-barrel', label: 'Barrel Roll', type: 'camera', description: 'Camera rotates 360 along Z axis' },
  { id: 'cam-jello', label: 'Action Shake', type: 'camera', description: 'Heavy vibration as if from an explosion' },
  
  // More Lighting
  { id: 'light-giallo', label: 'Giallo Red/Blue', type: 'lighting', description: 'Intense 70s Italian horror lighting' },
  { id: 'light-dusk', label: 'Purple Dusk', type: 'lighting', description: 'Deep purple twilight sky lighting' },
  { id: 'light-candle', label: 'Candlelight', type: 'lighting', description: 'Very warm, soft, localized glowing light' },
  { id: 'light-sunflare', label: 'Blinding Sun Flare', type: 'lighting', description: 'Washed out highlights from looking at the sun' },

  // More VFX
  { id: 'vfx-bokeh', label: 'Cinematic Bokeh', type: 'vfx', description: 'Large out of focus light circles in background' },
  { id: 'vfx-glitter', label: 'Airborne Glitter', type: 'vfx', description: 'Sparkling motes falling slowly' },
  { id: 'vfx-laser-eyes', label: 'Glowing Eyes', type: 'vfx', description: 'Supernatural glowing eye flare' },
  { id: 'vfx-matrix', label: 'Digital Rain', type: 'vfx', description: 'Falling green code letters' },

  // More Mods
  { id: 'mod-tiltshift', label: 'Tilt-Shift Miniature', type: 'mod', description: 'Makes real life look like tiny toys' },
  { id: 'mod-cinestill', label: 'CineStill 800T', type: 'mod', description: 'Halation highlights, greenish shadows' },
  { id: 'mod-kodak', label: 'Kodachrome', type: 'mod', description: 'Classic 70s vibrant film stock' },
  { id: 'mod-lofi', label: 'Lo-Fi Anime', type: 'mod', description: 'Muted colors, grainy 90s aesthetic' },
  { id: 'mod-risograph', label: 'Risograph Print', type: 'mod', description: 'Misaligned color layers and textures' },

  // More Concepts
  { id: 'idea-liminal', label: 'Liminal Spaces', type: 'idea', description: 'Creepy, empty transitional spaces like hallways' },
  { id: 'idea-solarpunk', label: 'Solarpunk Utopia', type: 'idea', description: 'Bright, green, eco-friendly futuristic technology' },
  { id: 'idea-y2k', label: 'Y2K Cyber', type: 'idea', description: 'Early 2000s silver tech, blobs, and blue LEDs' }
];
