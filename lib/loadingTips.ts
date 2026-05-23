export interface LoadingTip {
  title: string;
  description: string;
  badge: "AI Ability" | "Pro Tip" | "Workflow" | "Unique Edge";
}

export const LOADING_TIPS: LoadingTip[] = [
  {
    title: "Fluid Storyboard Dragger",
    description: "Simply drag any scene card on the timeline to shuffle clip order instantly. The timeline automatically calculates real-time scene continuity, duration offsets, and transition layers in the background.",
    badge: "Workflow"
  },
  {
    title: "Gemini Generative Prompting",
    description: "Type your script ideas in standard, conversational English. The system automatically extracts spatial markers, complex camera paths, and custom timecode intervals without requiring legacy prompt syntax.",
    badge: "AI Ability"
  },
  {
    title: "Deep Quick Modifier Conductor",
    description: "Selecting between 5 and 10 quick modifiers tells the generative engine exactly how to sequence contrasting camera work, editing, and sound filters for premium coherence.",
    badge: "Unique Edge"
  },
  {
    title: "Precision Timecode Scrubbing",
    description: "Hover over the timeline ruler or the interactive monitor to scrub frame-by-frame. Observe your storyboard layouts adjust to keyframes in real-time.",
    badge: "Pro Tip"
  },
  {
    title: "Colorgrading Uniformity",
    description: "Apply modern styles like 'Cyberpunk Neon' or 'Cinematic Noir'. Our lighting layer processes individual clips to preserve consistent shadow levels across your entire montage.",
    badge: "Unique Edge"
  }
];
