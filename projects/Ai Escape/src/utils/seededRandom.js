// Tiny deterministic PRNG helpers (no deps)
// Used to keep multiplayer minigame content identical across clients.

export function hashStringToUint32(str) {
  // FNV-1a 32-bit
  let h = 2166136261;
  const s = String(str || "");
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function mulberry32(seedUint32) {
  let a = (seedUint32 >>> 0) || 1;
  return function rand() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function seededInt(rand, min, max) {
  const lo = Number(min);
  const hi = Number(max);
  const r = typeof rand === "function" ? rand() : Math.random();
  return Math.floor(r * (hi - lo + 1)) + lo;
}

