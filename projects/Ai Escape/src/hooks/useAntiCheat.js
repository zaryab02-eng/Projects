import { useEffect, useRef } from "react";
import { addPlayerWarning } from "../services/gameService";

/**
 * Anti-cheat hook to detect suspicious behavior
 * Implements realistic web-based anti-cheat measures
 */
export function useAntiCheat(roomCode, playerId, isGameActive) {
  const tabSwitchCount = useRef(0);
  const hasWarned = useRef(false);
  const visibilityTimeoutRef = useRef(null);
  const lastVisibilityChangeRef = useRef(Date.now());

  useEffect(() => {
    if (!isGameActive || !roomCode || !playerId) return;

    // Disable right-click
    const handleContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    // Disable certain keyboard shortcuts
    const handleKeyDown = (e) => {
      // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
      if (
        e.keyCode === 123 || // F12
        (e.ctrlKey && e.shiftKey && e.keyCode === 73) || // Ctrl+Shift+I
        (e.ctrlKey && e.shiftKey && e.keyCode === 74) || // Ctrl+Shift+J
        (e.ctrlKey && e.keyCode === 85) // Ctrl+U
      ) {
        e.preventDefault();
        return false;
      }
    };

    // Detect tab visibility changes (player switching tabs)
    // Added debouncing and false positive detection for video-related issues
    const handleVisibilityChange = async () => {
      const now = Date.now();
      const timeSinceLastChange = now - lastVisibilityChangeRef.current;
      
      // Ignore rapid visibility changes (likely false positives from video or browser behavior)
      // If visibility changes happen within 500ms, it's likely not a real tab switch
      if (timeSinceLastChange < 500) {
        return;
      }

      // Clear any pending timeout
      if (visibilityTimeoutRef.current) {
        clearTimeout(visibilityTimeoutRef.current);
      }

      if (document.hidden) {
        // Add a small delay to verify this is a real tab switch
        // If the page becomes visible again quickly, it was likely a false positive
        visibilityTimeoutRef.current = setTimeout(async () => {
          // Double-check that the page is still hidden after the delay
          if (document.hidden) {
            tabSwitchCount.current += 1;
            lastVisibilityChangeRef.current = Date.now();

            // Warn after first tab switch
            if (tabSwitchCount.current === 1 && !hasWarned.current) {
              hasWarned.current = true;
              alert(
                "⚠️ Warning: Tab switching detected! Do not switch tabs during the game.",
              );
            }

            // Add warning to database
            if (tabSwitchCount.current <= 2) {
              try {
                const warnings = await addPlayerWarning(
                  roomCode,
                  playerId,
                  `Tab switch detected (${tabSwitchCount.current})`,
                );

                if (warnings >= 2) {
                  alert(
                    "🚫 DISQUALIFIED: Too many tab switches detected. You have been removed from the game.",
                  );
                }
              } catch (error) {
                console.error("Error adding warning:", error);
              }
            }
          }
        }, 300); // 300ms delay to filter out false positives
      } else {
        // Page became visible - update timestamp
        lastVisibilityChangeRef.current = now;
      }
    };

    // Request fullscreen on game start
    const requestFullscreen = () => {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch((err) => {
          console.log("Fullscreen request failed:", err);
        });
      }
    };

    // Detect fullscreen exit
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && isGameActive) {
        // Alert user but don't penalize (fullscreen can exit accidentally)
        console.warn("Fullscreen exited during game");
      }
    };

    // Add event listeners
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    // Request fullscreen when game starts
    requestFullscreen();

    // Cleanup
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      if (visibilityTimeoutRef.current) {
        clearTimeout(visibilityTimeoutRef.current);
      }
    };
  }, [roomCode, playerId, isGameActive]);

  return {
    tabSwitchCount: tabSwitchCount.current,
  };
}
