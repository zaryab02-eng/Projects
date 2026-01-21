import { useEffect, useRef } from "react";

/**
 * Hook to detect tab visibility changes and implement grace timer
 * For solo mode only - terminates game if player leaves tab/app
 */
export function useTabVisibility(onTerminate, gracePeriodMs = 7500) {
  const graceTimerRef = useRef(null);
  const isVisibleRef = useRef(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      const isVisible = !document.hidden;

      if (!isVisible) {
        // Tab/app became hidden - start grace timer (or terminate immediately if 0)
        isVisibleRef.current = false;
        
        // Clear any existing timer
        if (graceTimerRef.current) {
          clearTimeout(graceTimerRef.current);
        }

        // If grace period is 0, terminate immediately
        if (gracePeriodMs === 0) {
          if (onTerminate) {
            onTerminate();
          }
        } else {
          // Start new grace timer
          graceTimerRef.current = setTimeout(() => {
            // Grace period expired - terminate game
            if (onTerminate) {
              onTerminate();
            }
          }, gracePeriodMs);
        }
      } else {
        // Tab/app became visible again - cancel grace timer
        isVisibleRef.current = true;
        
        if (graceTimerRef.current) {
          clearTimeout(graceTimerRef.current);
          graceTimerRef.current = null;
        }
      }
    };

    // Listen for visibility changes
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Use pagehide instead of beforeunload - more reliable and gives more time
    // pagehide fires reliably when the page is being unloaded (close, refresh, navigate)
    const handlePageHide = (event) => {
      // Try to save progress - pagehide gives more time than beforeunload
      if (onTerminate) {
        // Fire synchronously - the handler should handle async operations
        onTerminate();
      }
    };

    window.addEventListener("pagehide", handlePageHide);
    
    // Also keep beforeunload as fallback for older browsers
    const handleBeforeUnload = () => {
      if (onTerminate) {
        onTerminate();
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      
      if (graceTimerRef.current) {
        clearTimeout(graceTimerRef.current);
      }
    };
  }, [onTerminate, gracePeriodMs]);

  return {
    isVisible: isVisibleRef.current,
  };
}
