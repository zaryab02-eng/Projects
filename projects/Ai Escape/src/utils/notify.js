import toast from "react-hot-toast";

const DEFAULT_DURATION = 3200;

export const notify = {
  success(message, options = {}) {
    return toast.success(message, {
      duration: DEFAULT_DURATION,
      ...options,
    });
  },
  error(message, options = {}) {
    return toast.error(message, {
      duration: DEFAULT_DURATION,
      ...options,
    });
  },
  warning(message, options = {}) {
    return toast(message, {
      duration: DEFAULT_DURATION,
      ...options,
    });
  },
  info(message, options = {}) {
    return toast(message, {
      duration: DEFAULT_DURATION,
      ...options,
    });
  },
};

