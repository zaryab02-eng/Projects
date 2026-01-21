import { database } from "./firebase";
import { ref, onValue } from "firebase/database";

/**
 * Subscribe to total online players across all rooms.
 * A player is considered "online" if they exist under any rooms/<code>/players node.
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
      const players = roomSnap.child("players");
      if (players.exists()) {
        count += Object.keys(players.val() || {}).length;
      }
    });

    callback(count);
  });
}

