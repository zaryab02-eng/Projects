let done = false;
export const isHydrated = () => done;
export const markHydrated = () => {
  done = true;
};
