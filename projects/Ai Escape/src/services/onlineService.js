import { database } from "./firebase";
import { ref, onValue } from "firebase/database";

/**
 * Subscribe to total online players across all ACTIVE rooms.
 * A player is considered "online" only if they're in a room with status "waiting" or "playing".
 * Finished games are excluded from the count.
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
      const status = roomData?.status;
      
      // Only count players in active rooms (waiting or playing)
      // Exclude finished games
      if (status === "waiting" || status === "playing") {
        const players = roomSnap.child("players");
        if (players.exists()) {
          const playersObj = players.val() || {};
          count += Object.keys(playersObj).length;
        }
      }
    });

    callback(count);
  });
}

