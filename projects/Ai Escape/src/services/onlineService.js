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
      
      // Status is "waiting" or "playing" - check for REAL-TIME activity
      const now = Date.now();
      
      // For "waiting" rooms, check if room is too old (stale waiting rooms)
      // If a room has been waiting for more than 15 minutes, it's likely abandoned
      if (status === "waiting") {
        const createdAt = Number(roomData.createdAt || 0);
        const MAX_WAITING_AGE_MS = 15 * 60 * 1000; // 15 minutes
        if (createdAt > 0 && (now - createdAt) > MAX_WAITING_AGE_MS) {
          debugInfo.otherStatus++; // Stale waiting room
          return; // Skip stale waiting rooms
        }
      }
      
      // For "playing" rooms, check if game has ended (endTime passed)
      if (status === "playing" && roomData.endTime) {
        const endTime = Number(roomData.endTime);
        if (endTime > 0 && now > endTime) {
          // Game time has expired, room should be finished
          debugInfo.otherStatus++; // Count as expired
          return; // Skip expired games
        }
      }
      
      // Check players for REAL-TIME activity
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
      
      // REAL-TIME: Only count players with VERY recent activity (within last 90 seconds)
      // A player is "online" only if they've had activity in the last 90 seconds
      // This ensures truly real-time counting without glitches
      const MAX_INACTIVITY_MS = 90 * 1000; // 90 seconds (1.5 minutes) - STRICT real-time
      
      let activePlayerCount = 0;
      playerKeys.forEach(key => {
        const player = playersObj[key];
        
        // Player must be valid object with id
        if (!player || 
            typeof player !== "object" || 
            Array.isArray(player) ||
            !player.id ||
            typeof player.id !== "string") {
          return; // Skip invalid player
        }
        
        // Skip disqualified players (they're not really "online")
        if (player.disqualified) {
          return;
        }
        
        // Check if player has recent activity
        // Priority: lastProgressAt > levelStartTime > joinedAt
        // lastProgressAt is updated on every answer submission, so it's most accurate
        let lastActivity = 0;
        
        if (player.lastProgressAt) {
          lastActivity = Number(player.lastProgressAt);
        } else if (player.levelStartTime) {
          lastActivity = Number(player.levelStartTime);
        } else if (player.joinedAt) {
          lastActivity = Number(player.joinedAt);
        }
        
        // Validate timestamp is reasonable (not in future, not too old)
        if (lastActivity <= 0 || lastActivity > now) {
          return; // Invalid timestamp
        }
        
        const timeSinceActivity = now - lastActivity;
        
        // Player is "online" if they've had activity in the last 90 seconds
        if (timeSinceActivity <= MAX_INACTIVITY_MS) {
          activePlayerCount++;
        }
      });
      
      // Only count this room if it has at least one active player
      if (activePlayerCount > 0) {
        debugInfo.activeRooms++;
        count += activePlayerCount;
      } else {
        // Room has no active players - consider it stale
        debugInfo.otherStatus++;
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

