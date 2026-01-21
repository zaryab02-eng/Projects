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
    let debugInfo = { totalRooms: 0, activeRooms: 0, finishedRooms: 0, otherStatus: 0 };
    
    snapshot.forEach((roomSnap) => {
      const roomData = roomSnap.val();
      debugInfo.totalRooms++;
      
      // Skip if roomData is null or undefined
      if (!roomData || typeof roomData !== "object") {
        return;
      }
      
      // Get status - must be a string and exactly match
      // Use strict equality check and type checking
      const status = String(roomData.status || "").trim();
      
      // STRICT CHECK: Only count if status is exactly "waiting" or "playing"
      // Explicitly exclude everything else including "finished", null, undefined, empty string
      if (status !== "waiting" && status !== "playing") {
        if (status === "finished") {
          debugInfo.finishedRooms++;
        } else if (status === "") {
          debugInfo.otherStatus++; // Missing status
        } else {
          debugInfo.otherStatus++; // Other status value
        }
        return; // Skip this room
      }
      
      // Status is "waiting" or "playing" - but check if room is stale/old
      // Exclude rooms that are older than 2 hours (likely abandoned/stale)
      const now = Date.now();
      const createdAt = roomData.createdAt || 0;
      const lastActivity = roomData.lastProgressAt || roomData.startTime || createdAt;
      const roomAge = now - Math.max(createdAt, lastActivity);
      
      // If room is older than 2 hours (7200000 ms), consider it stale and exclude
      const MAX_ROOM_AGE_MS = 2 * 60 * 60 * 1000; // 2 hours
      if (roomAge > MAX_ROOM_AGE_MS) {
        debugInfo.otherStatus++; // Count as stale
        return; // Skip stale rooms
      }
      
      // For "playing" rooms, also check if game has ended (endTime passed)
      if (status === "playing" && roomData.endTime) {
        const endTime = Number(roomData.endTime);
        if (endTime > 0 && now > endTime) {
          // Game time has expired, room should be finished
          debugInfo.otherStatus++; // Count as expired
          return; // Skip expired games
        }
      }
      
      // Status is "waiting" or "playing" and room is recent - count players
      debugInfo.activeRooms++;
      const players = roomSnap.child("players");
      
      if (!players.exists()) {
        return; // No players in this room
      }
      
      const playersObj = players.val();
      
      // Double-check playersObj is valid object (not null, not array)
      if (!playersObj || typeof playersObj !== "object" || Array.isArray(playersObj)) {
        return;
      }
      
      const playerKeys = Object.keys(playersObj);
      if (playerKeys.length === 0) {
        return; // Empty players object
      }
      
      // Filter out any null/undefined/invalid player entries
      const validPlayerCount = playerKeys.filter(key => {
        const player = playersObj[key];
        // Player must be an object with an id property
        return player && 
               typeof player === "object" && 
               !Array.isArray(player) &&
               player.id &&
               typeof player.id === "string";
      }).length;
      
      if (validPlayerCount > 0) {
        count += validPlayerCount;
      }
    });

    // Debug logging (remove in production if needed)
    if (debugInfo.totalRooms > 0) {
      console.log("[Online Players Debug]", {
        totalRooms: debugInfo.totalRooms,
        activeRooms: debugInfo.activeRooms,
        finishedRooms: debugInfo.finishedRooms,
        otherStatus: debugInfo.otherStatus,
        playerCount: count
      });
    }

    // Ensure count is a valid number (0 or positive integer)
    const finalCount = Number.isInteger(count) && count >= 0 ? count : 0;
    callback(finalCount);
  });
}

