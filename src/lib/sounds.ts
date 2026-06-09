let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

function playTone(
  freq: number,
  duration: number,
  type: OscillatorType = "sine",
  volume = 0.08
) {
  const ctx = getCtx();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);

  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + duration);
}

/** Subtle shimmer for card reveal */
export function playFlipSound() {
  playTone(800, 0.12, "sine", 0.06);
  setTimeout(() => playTone(1200, 0.08, "sine", 0.04), 60);
}

/** Soft chime for draw */
export function playDrawSound() {
  playTone(600, 0.15, "triangle", 0.07);
  setTimeout(() => playTone(900, 0.12, "triangle", 0.05), 100);
}

/** Completion bell */
export function playCompleteSound() {
  playTone(523, 0.2, "sine", 0.08);
  setTimeout(() => playTone(659, 0.2, "sine", 0.08), 150);
  setTimeout(() => playTone(784, 0.3, "sine", 0.08), 300);
}
