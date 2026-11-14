// Shared image helpers: decode (EXIF rotation fixed), downscale safely for
// huge photos, crop and encode to small JPEG data URLs.
// Presets: "avatar" (square ~160px) and "document" (aspect kept, ~1400px).
export const PRESETS = {
  avatar: {
    shape: "circle",
    size: 160,
    quality: 0.7,
    workMax: 1024,
    maxBytes: 40 * 1024,
  },
  document: {
    shape: "rect",
    maxSide: 1400,
    quality: 0.75,
    workMax: 2400,
    maxBytes: 700 * 1024,
  },
};

function makeCanvas(w, h) {
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.round(w));
  c.height = Math.max(1, Math.round(h));
  return c;
}

const srcSize = (s) => ({
  w: s.naturalWidth || s.width,
  h: s.naturalHeight || s.height,
});

/** Draws a region of `src` into a new canvas, halving step by step so very
 * large images stay sharp and never need one giant resample. */
function drawScaled(src, sx, sy, sw, sh, outW, outH) {
  let cur = src;
  let cx = sx;
  let cy = sy;
  let cw = sw;
  let ch = sh;
  while (cw > outW * 2 && ch > outH * 2) {
    const nw = Math.round(cw / 2);
    const nh = Math.round(ch / 2);
    const c = makeCanvas(nw, nh);
    const ctx = c.getContext("2d");
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(cur, cx, cy, cw, ch, 0, 0, nw, nh);
    cur = c;
    cx = 0;
    cy = 0;
    cw = nw;
    ch = nh;
  }
  const out = makeCanvas(outW, outH);
  const ctx = out.getContext("2d");
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, out.width, out.height);
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(cur, cx, cy, cw, ch, 0, 0, out.width, out.height);
  return out;
}

/** Decodes a File (rotation from EXIF applied) into a canvas whose longest
 * side is at most `maxSide`. */
async function decodeToCanvas(file, maxSide) {
  let src = null;
  let cleanup = () => {};

  if (typeof createImageBitmap === "function") {
    try {
      src = await createImageBitmap(file, { imageOrientation: "from-image" });
    } catch {
      try {
        src = await createImageBitmap(file);
      } catch {
        src = null;
      }
    }
    if (src) cleanup = () => src.close?.();
  }

  if (!src) {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.decoding = "async";
    img.src = url;
    try {
      await img.decode();
    } catch (error) {
      URL.revokeObjectURL(url);
      throw error;
    }
    src = img;
    cleanup = () => URL.revokeObjectURL(url);
  }

  try {
    const { w, h } = srcSize(src);
    const scale = Math.min(1, maxSide / Math.max(w, h));
    return drawScaled(
      src,
      0,
      0,
      w,
      h,
      Math.max(1, Math.round(w * scale)),
      Math.max(1, Math.round(h * scale)),
    );
  } finally {
    cleanup();
  }
}

/** Working-size canvas used by the crop sheet. */
export function loadImageForCrop(file, presetName) {
  return decodeToCanvas(file, PRESETS[presetName].workMax);
}

/** Crops {sx,sy,sw,sh} (in source pixels) and encodes it with the preset. */
export function renderCrop(source, crop, presetName) {
  const p = PRESETS[presetName];
  let outW;
  let outH;
  if (p.shape === "circle") {
    outW = p.size;
    outH = p.size;
  } else {
    const scale = Math.min(1, p.maxSide / Math.max(crop.sw, crop.sh));
    outW = Math.max(1, Math.round(crop.sw * scale));
    outH = Math.max(1, Math.round(crop.sh * scale));
  }

  let canvas = drawScaled(
    source,
    crop.sx,
    crop.sy,
    crop.sw,
    crop.sh,
    outW,
    outH,
  );
  let quality = p.quality;
  let url = canvas.toDataURL("image/jpeg", quality);
  const limitChars = Math.ceil(p.maxBytes * 1.37);

  // Safety net so a document can never approach Firestore's 1 MiB limit.
  let tries = 0;
  while (url.length > limitChars && tries < 6) {
    tries += 1;
    if (quality > 0.5) {
      quality -= 0.1;
    } else {
      canvas = drawScaled(
        canvas,
        0,
        0,
        canvas.width,
        canvas.height,
        Math.round(canvas.width * 0.85),
        Math.round(canvas.height * 0.85),
      );
    }
    url = canvas.toDataURL("image/jpeg", quality);
  }
  return url;
}

/** One-step helper: File -> JPEG data URL (center crop for avatar, whole
 * image for document). */
export async function processImage(file, presetName) {
  const p = PRESETS[presetName];
  const src = await loadImageForCrop(file, presetName);
  let crop;
  if (p.shape === "circle") {
    const s = Math.min(src.width, src.height);
    crop = {
      sx: (src.width - s) / 2,
      sy: (src.height - s) / 2,
      sw: s,
      sh: s,
    };
  } else {
    crop = { sx: 0, sy: 0, sw: src.width, sh: src.height };
  }
  return renderCrop(src, crop, presetName);
}
