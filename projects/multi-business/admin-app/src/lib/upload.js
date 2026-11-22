// Photos are shrunk on the phone first (so uploads are quick and the website stays fast),
// then uploaded to Cloudinary using an unsigned upload preset.

export async function compressImage(file, maxSize = 1600) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  canvas.getContext("2d").drawImage(bitmap, 0, 0, w, h);
  // PNGs may have a transparent background (nice for product shots), keep those as PNG
  const type = file.type === "image/png" ? "image/png" : "image/jpeg";
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, type, 0.84));
  return blob || file;
}

export async function uploadImage(file, { maxSize = 1600, folder = "natusz" } = {}) {
  const cloud = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  if (!cloud || !preset) throw new Error("Cloudinary is not set up yet (see README).");

  const blob = await compressImage(file, maxSize);
  const body = new FormData();
  body.append("file", blob);
  body.append("upload_preset", preset);
  body.append("folder", folder);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, {
    method: "POST",
    body,
  });
  const data = await res.json();
  if (!res.ok || !data.secure_url) {
    throw new Error(data?.error?.message || "Photo upload failed");
  }
  return data.secure_url;
}
