"use client";

/**
 * Procedurally synthesized sound effects using the Web Audio API.
 * Requires ZERO external sound files, preventing 416 Range Not Satisfiable errors.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!audioCtx) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        audioCtx = new AudioCtxClass();
      }
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  } catch (e) {
    console.warn("Web Audio API not supported or context blocked", e);
    return null;
  }
}

/**
 * Procedural Whoosh: Short filtered noise burst with a rising pitch sweep
 */
export const playWhoosh = () => {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const t = ctx.currentTime;

    // Noise buffer
    const bufferSize = Math.floor(ctx.sampleRate * 0.3); // 300ms
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    // Filter automation
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(200, t);
    filter.frequency.exponentialRampToValueAtTime(1400, t + 0.22);
    filter.Q.setValueAtTime(3, t);

    // Gain envelope
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.3, t + 0.12);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

    // Sub-layer tone
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(120, t);
    osc.frequency.exponentialRampToValueAtTime(320, t + 0.22);
    const oscGain = ctx.createGain();
    oscGain.gain.setValueAtTime(0.12, t);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);

    noise.start(t);
    noise.stop(t + 0.3);
    osc.start(t);
    osc.stop(t + 0.3);
  } catch (e) {
    console.warn("Failed to play whoosh sound", e);
  }
};

/**
 * Procedural Impact: Low sine/square thump with fast attack/decay, layered with a short noise burst
 */
export const playImpact = () => {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const t = ctx.currentTime;

    // 1. Low Bass Thump (130Hz -> 28Hz)
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(130, t);
    osc.frequency.exponentialRampToValueAtTime(28, t + 0.45);

    const oscGain = ctx.createGain();
    oscGain.gain.setValueAtTime(0.75, t);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.45);

    // 2. High-Frequency "Crack" / Transient Noise Burst
    const bufferSize = Math.floor(ctx.sampleRate * 0.12); // 120ms
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.02));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "highpass";
    noiseFilter.frequency.setValueAtTime(1000, t);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.45, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    noise.start(t);
    noise.stop(t + 0.12);
  } catch (e) {
    console.warn("Failed to play impact sound", e);
  }
};

/**
 * Procedural Buzzer: Square wave at ~480Hz with a sharp on/off envelope
 */
export const playBuzzer = () => {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = "square";
    osc.frequency.setValueAtTime(480, t);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.25, t);
    gain.gain.setValueAtTime(0.25, t + 0.25);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.3);
  } catch (e) {
    console.warn("Failed to play buzzer sound", e);
  }
};

let ambientOsc: OscillatorNode | null = null;
let ambientGain: GainNode | null = null;

export const startAmbientHum = () => {
  const ctx = getAudioContext();
  if (!ctx || ambientOsc) return;
  try {
    ambientOsc = ctx.createOscillator();
    ambientOsc.type = "sine";
    ambientOsc.frequency.setValueAtTime(55, ctx.currentTime);

    ambientGain = ctx.createGain();
    ambientGain.gain.setValueAtTime(0.015, ctx.currentTime);

    ambientOsc.connect(ambientGain);
    ambientGain.connect(ctx.destination);

    ambientOsc.start();
  } catch (e) {
    console.warn("Failed to start ambient hum", e);
  }
};

export const stopAmbientHum = () => {
  if (ambientOsc) {
    try {
      ambientOsc.stop();
      ambientOsc.disconnect();
    } catch {}
    ambientOsc = null;
  }
};

export const playSound = (name: string) => {
  switch (name) {
    case "whoosh":
      playWhoosh();
      break;
    case "impact":
      playImpact();
      break;
    case "buzzer":
      playBuzzer();
      break;
    case "ambient-hum":
      startAmbientHum();
      break;
    default:
      console.warn(`Unknown sound effect: ${name}`);
  }
};
