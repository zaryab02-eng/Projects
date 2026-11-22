// Lets the hero animation wait until the opening loader has finished.
let ready = false;
const subs = new Set();

try {
  if (sessionStorage.getItem("natusz-seen")) ready = true;
} catch (e) {
  /* ignore */
}

export const isReady = () => ready;

export function markReady() {
  ready = true;
  try {
    sessionStorage.setItem("natusz-seen", "1");
  } catch (e) {
    /* ignore */
  }
  subs.forEach((fn) => fn());
  subs.clear();
}

export function onReady(cb) {
  if (ready) {
    cb();
    return () => {};
  }
  subs.add(cb);
  return () => subs.delete(cb);
}
