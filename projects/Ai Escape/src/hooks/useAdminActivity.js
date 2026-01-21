import { useEffect, useRef } from "react";
import { ref, update, serverTimestamp } from "firebase/database";
import { database } from "../services/firebase";

/**
 * Hook to track admin activity in multiplayer rooms
 * Updates adminLastActivity timestamp every 30 seconds to keep admin "active"
 * Only for multiplayer mode (not solo)
 */
export function useAdminActivity(roomCode, isAdmin, isMultiplayer) {
  const intervalRef = useRef(null);
  const lastUpdateRef = useRef(0);

  useEffect(() => {
    // Only track admin activity in multiplayer mode
    if (!isAdmin || !isMultiplayer || !roomCode) {
      return;
    }

    // Update admin activity immediately
    const updateAdminActivity = async () => {
      try {
        const roomRef = ref(database, `rooms/${roomCode}`);
        await update(roomRef, {
          adminLastActivity: serverTimestamp(),
          adminLastActivityMs: Date.now(),
        });
        lastUpdateRef.current = Date.now();
      } catch (err) {
        console.error("Error updating admin activity:", err);
      }
    };

    // Initial update
    updateAdminActivity();

    // Update every 30 seconds to keep admin active
    intervalRef.current = setInterval(() => {
      updateAdminActivity();
    }, 30000); // 30 seconds

    // Also update on user interaction (mouse move, click, etc.)
    const handleUserActivity = () => {
      const now = Date.now();
      // Throttle to once per 10 seconds
      if (now - lastUpdateRef.current > 10000) {
        updateAdminActivity();
      }
    };

    // Listen for user activity
    window.addEventListener("mousemove", handleUserActivity);
    window.addEventListener("click", handleUserActivity);
    window.addEventListener("keydown", handleUserActivity);
    window.addEventListener("scroll", handleUserActivity);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("click", handleUserActivity);
      window.removeEventListener("keydown", handleUserActivity);
      window.removeEventListener("scroll", handleUserActivity);
    };
  }, [roomCode, isAdmin, isMultiplayer]);
}
