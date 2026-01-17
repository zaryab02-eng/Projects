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
  const isProcessingSwitchRef = useRef(false);

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

    // Core function to handle tab switch detection
    const processTabSwitch = async () => {
      // Prevent duplicate processing
      if (isProcessingSwitchRef.current) {
        return;
      }

      const now = Date.now();
      const timeSinceLastChange = now - lastVisibilityChangeRef.current;
      
      // Only ignore very rapid changes (< 100ms) which are likely browser/video initialization flickers
      // This allows legitimate tab switches to be detected immediately
      if (timeSinceLastChange < 100) {
        return;
      }

      // Clear any pending timeout
      if (visibilityTimeoutRef.current) {
        clearTimeout(visibilityTimeoutRef.current);
      }

      if (document.hidden) {
        isProcessingSwitchRef.current = true;
        
        // Very short delay (50ms) to verify this is a real tab switch
        // This filters out brief flickers while still being responsive to real switches
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
          
          // Reset processing flag after a short delay to allow new detections
          setTimeout(() => {
            isProcessingSwitchRef.current = false;
          }, 200);
        }, 50); // 50ms delay - very short to maintain responsiveness
      } else {
        // Page became visible - update timestamp and reset processing flag
        lastVisibilityChangeRef.current = now;
        isProcessingSwitchRef.current = false;
      }
    };

    // Detect tab visibility changes (player switching tabs)
    const handleVisibilityChange = () => {
      processTabSwitch();
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

    // Detect window blur (especially important for mobile devices)
    // On mobile, blur event can fire before visibilitychange
    const handleBlur = () => {
      // Trigger the same processing function
      // The function itself will check if document is hidden
      processTabSwitch();
    };

    // Add event listeners
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    window.addEventListener("blur", handleBlur);

    // Request fullscreen when game starts
    requestFullscreen();

    // Cleanup
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      window.removeEventListener("blur", handleBlur);
      if (visibilityTimeoutRef.current) {
        clearTimeout(visibilityTimeoutRef.current);
      }
    };
  }, [roomCode, playerId, isGameActive]);

  return {
    tabSwitchCount: tabSwitchCount.current,
  };
}
