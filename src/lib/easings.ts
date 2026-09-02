// Cubic-bezier and spring configurations for precise animation control

// Anticipation: Pre-motion pull-back
export const anticipate = [0.36, 0, 0.66, -0.56] as const;

// Impact In: Extremely fast snap for the clash moment
export const impactIn = [0.87, 0, 0.13, 1] as const;

// Overshoot Settle: Elements bounce slightly past target and settle
export const overshootSettle = {
  type: "spring",
  stiffness: 260,
  damping: 14,
  mass: 1,
} as const;

// Smooth Glide: Slide-ins, feels fast-start-slow-end
export const smoothGlide = [0.22, 1, 0.36, 1] as const;

// Elastic Pop: VS badge pop-in
export const elasticPop = {
  type: "spring",
  stiffness: 400,
  damping: 10,
} as const;
