/**
 * Color utility functions for tournament broadcast aesthetics.
 */

/**
 * Strips alpha channel from 8-digit hex colors (e.g. #EF44E6FF -> #EF44E6)
 * and normalizes 3, 4, 6, and 8-digit hex inputs.
 */
export function normalizeHexColor(hex: string): string {
  if (!hex) return "#3b82f6";
  let clean = hex.trim();
  if (clean.startsWith("#")) clean = clean.slice(1);
  if (clean.length === 8) {
    clean = clean.slice(0, 6);
  } else if (clean.length === 3 || clean.length === 4) {
    clean = `${clean[0]}${clean[0]}${clean[1]}${clean[1]}${clean[2]}${clean[2]}`;
  } else if (clean.length !== 6) {
    return "#3b82f6";
  }
  return `#${clean.toLowerCase()}`;
}

/**
 * Converts a hex color string to HSL [h (0-360), s (0-1), l (0-1)]
 */
export function hexToHsl(hex: string): [number, number, number] {
  const clean = normalizeHexColor(hex).replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h *= 60;
  }

  return [h, s, l];
}

/**
 * Converts HSL to 6-digit hex string
 */
export function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(1, s));
  l = Math.max(0, Math.min(1, l));

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0;
  let g = 0;
  let b = 0;

  if (0 <= h && h < 60) {
    r = c; g = x; b = 0;
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x;
  }

  const toHex = (n: number) => {
    const hex = Math.round((n + m) * 255).toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * FIX 14: Derives a vibrant "ambient/electric" version of a color for glows, gradients, and energy effects.
 * Leaves the raw user color intact for swatches/labels, but makes ambient lighting pop with
 * high-contrast saturation and electric neon spectrum anchor shifts.
 */
export function getAmbientColor(hex: string): string {
  try {
    const [h, s, l] = hexToHsl(hex);

    // 1. Maximize saturation for electric glow
    const boostedS = Math.min(1.0, Math.max(0.95, s * 1.25));

    // 2. Lock lightness to punchy neon range
    const glowingL = Math.max(0.52, Math.min(0.60, l));

    // 3. Shift hue firmly toward electric neon spectrum anchors
    let shiftedH = h;
    if (h >= 190 && h <= 250) {
      // Blues shift toward electric cyan-blue (anchor ~198°)
      shiftedH = 198;
    } else if ((h >= 335 && h <= 360) || (h >= 0 && h <= 25)) {
      // Flat reds shift toward electric neon crimson/magenta (anchor ~344°)
      shiftedH = 344;
    } else if (h >= 80 && h <= 165) {
      // Greens shift toward electric neon emerald/mint (anchor ~155°)
      shiftedH = 155;
    } else if (h >= 26 && h <= 79) {
      // Oranges/yellows shift toward electric tournament gold (anchor ~45°)
      shiftedH = 45;
    } else if (h >= 251 && h <= 334) {
      // Purples shift toward electric neon violet (anchor ~285°)
      shiftedH = 285;
    }

    return hslToHex(shiftedH, boostedS, glowingL);
  } catch {
    return normalizeHexColor(hex);
  }
}

/**
 * FIX 21: Dynamically derives the corner designation from the actual team color hue.
 * Eliminates swapped/hardcoded corner labels (e.g. blue panel showing "RED CORNER").
 */
export function getCornerLabel(hex: string, fallback: string = "BLUE CORNER"): string {
  try {
    const [h] = hexToHsl(hex);
    if ((h >= 330 && h <= 360) || (h >= 0 && h <= 25)) {
      return "RED CORNER";
    }
    if (h >= 180 && h <= 260) {
      return "BLUE CORNER";
    }
    if (h >= 75 && h <= 175) {
      return "GREEN CORNER";
    }
    if (h >= 26 && h <= 74) {
      return "GOLD CORNER";
    }
    if (h >= 261 && h <= 329) {
      return "PURPLE CORNER";
    }
    return fallback;
  } catch {
    return fallback;
  }
}
