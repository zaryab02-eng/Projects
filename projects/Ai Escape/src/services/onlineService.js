import { database } from "./firebase";
import { ref, onValue } from "firebase/database";

/**
 * Subscribe to total online players across all ACTIVE rooms.
 * A player is considered "online" only if they're in a room with status "waiting" or "playing".
 * Finished games, null status, and empty rooms are excluded from the count.
 */
export function subscribeToOnlinePlayers(callback) {
  const roomsRef = ref(database, "rooms");

  return onValue(roomsRef, (snapshot) => {
    if (!snapshot.exists()) {
      callback(0);
      return;
    }

    let count = 0;
    snapshot.forEach((roomSnap) => {
      const roomData = roomSnap.val();
      
      // Skip if roomData is null or undefined
      if (!roomData || typeof roomData !== "object") {
        return;
      }
      
      // Get status - must be a string
      const status = roomData.status;
      
      // Only count players in active rooms (waiting or playing)
      // Explicitly exclude: finished, null, undefined, empty string, or any other status
      if (status === "waiting" || status === "playing") {
        const players = roomSnap.child("players");
        if (players.exists()) {
          const playersObj = players.val();
          
          // Double-check playersObj is valid object (not null, not array, has keys)
          if (playersObj && typeof playersObj === "object" && !Array.isArray(playersObj)) {
            const playerKeys = Object.keys(playersObj);
            // Only count if there are actual player entries
            // Filter out any null/undefined entries
            const validPlayerCount = playerKeys.filter(key => {
              const player = playersObj[key];
              return player && typeof player === "object" && player.id;
            }).length;
            
            if (validPlayerCount > 0) {
              count += validPlayerCount;
            }
          }
        }
      }
    });

    // Ensure count is a valid number (0 or positive integer)
    const finalCount = Number.isInteger(count) && count >= 0 ? count : 0;
    callback(finalCount);
  });
}

