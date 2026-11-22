// Lets the hero animation (and the gallery) wait until the opening loader has finished.
let ready = false;
const subs = new Set();

try {
  if (sessionStorage.getItem("natusz-seen")) ready = true;
} catch (e) {
  /* ignore */
}

export const isReady = () => ready;

export function markReady() {
  if (ready && subs.size === 0) return;
  ready = true;
  try {
    sessionStorage.setItem("natusz-seen", "1");
  } catch (e) {
    /* ignore */
  }
  const waiting = [...subs];
  subs.clear();
  // Run the waiting animations a moment LATER, outside the loader's own GSAP callback.
  // GSAP records every animation created inside a callback in the loader's "context",
  // and when the loader is removed that context is reverted, which hid the hero (and the gallery)
  // again on the very first visit. Running them in a fresh timer avoids that.
  setTimeout(() => {
    waiting.forEach((fn) => {
      try {
        fn();
      } catch (e) {
        console.error(e);
      }
    });
  }, 50);
}

export function onReady(cb) {
  if (ready) {
    cb();
    return () => {};
  }
  subs.add(cb);
  return () => subs.delete(cb);
}

// Safety net: if the loader ever fails to finish, show the page anyway after 8 seconds.
if (!ready && typeof window !== "undefined") {
  setTimeout(() => {
    if (!ready) markReady();
  }, 8000);
}
