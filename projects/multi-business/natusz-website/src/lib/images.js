// Photos uploaded from the admin app live on Cloudinary. This asks Cloudinary for a
// smaller, web-optimised version (right size, modern format) so pages load fast.
export function optimizeUrl(url, width = 1000) {
  if (!url || !url.includes("res.cloudinary.com") || !url.includes("/upload/")) return url;
  return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`);
}
