import { useEffect, useRef } from "react";
import { addPlayerWarning } from "../services/gameService";
import { notify } from "../utils/notify";

/**
 * Anti-cheat hook to detect suspicious behavior
 * Implements realistic web-based anti-cheat measures
 */
export function useAntiCheat(roomCode, playerId, isGameActive, roomData = null) {
  const tabSwitchCount = useRef(0);
  const hasWarned = useRef(false);
  const visibilityTimeoutRef = useRef(null);
  const lastSwitchProcessedRef = useRef(Date.now());

  useEffect(() => {
    if (!isGameActive || !roomCode || !playerId) return;
    
    // Check if player has completed all levels - if so, disable anti-cheat
    if (roomData?.players?.[playerId]) {
      const player = roomData.players[playerId];
      const totalLevels = roomData.totalLevels || 0;
      const completedLevels = player.completedLevels || 0;
      
      // If player completed all levels, don't enforce anti-cheat
      if (completedLevels >= totalLevels && totalLevels > 0) {
        return;
      }
    }

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

    // Core function to handle tab switch detection - STRICT MODE
    const processTabSwitch = async () => {
      const now = Date.now();
      const timeSinceLastProcessed = now - lastSwitchProcessedRef.current;
      
      // Only ignore extremely rapid changes (< 20ms) - these are likely browser internal events
      // This ensures the first legitimate tab switch is ALWAYS detected
      if (timeSinceLastProcessed < 20) {
        return;
      }

      // Clear any pending timeout
      if (visibilityTimeoutRef.current) {
        clearTimeout(visibilityTimeoutRef.current);
      }

      if (document.hidden) {
        // Minimal delay (20ms) - just enough to verify it's still hidden
        // This makes detection immediate and sensitive
        visibilityTimeoutRef.current = setTimeout(async () => {
          // Double-check that the page is still hidden
          if (document.hidden) {
            tabSwitchCount.current += 1;
            lastSwitchProcessedRef.current = Date.now();

            // Warn after first tab switch - ALWAYS
            if (tabSwitchCount.current === 1 && !hasWarned.current) {
              hasWarned.current = true;
              notify.warning("Tab switching detected. Please stay in the game tab.", {
                id: "antiCheat-tab-warning",
                duration: 4500,
              });
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
                  notify.error(
                    "Disqualified: too many tab switches detected. You’ve been removed from the game.",
                    { id: "antiCheat-disqualified", duration: 6000 }
                  );
                }
              } catch (error) {
                console.error("Error adding warning:", error);
              }
            }
          }
        }, 20); // 20ms delay - minimal to maintain maximum sensitivity
      } else {
        // Page became visible - update timestamp
        lastSwitchProcessedRef.current = now;
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
    // On mobile, blur event can fire before visibilitychange or when app is minimized
    const handleBlur = () => {
      // Immediately process if document is hidden or about to be hidden
      // Don't wait - be as sensitive as possible
      if (document.hidden || !document.hasFocus()) {
        processTabSwitch();
      }
    };

    // Also detect pagehide event (mobile browsers when app is minimized)
    const handlePageHide = () => {
      processTabSwitch();
    };

    // Add event listeners - multiple events for maximum detection
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("pagehide", handlePageHide);

    // Request fullscreen when game starts
    requestFullscreen();

    // Cleanup
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("pagehide", handlePageHide);
      if (visibilityTimeoutRef.current) {
        clearTimeout(visibilityTimeoutRef.current);
      }
    };
  }, [roomCode, playerId, isGameActive, roomData]);

  return {
    tabSwitchCount: tabSwitchCount.current,
  };
}
