import { database } from "./firebase";
import { ref, set, get, update, query, orderByChild, limitToFirst, startAt, equalTo } from "firebase/database";

/**
 * Get leaderboard key from difficulty and level count
 */
function getLeaderboardKey(difficulty, totalLevels) {
  return `${difficulty}-${totalLevels}`;
}

/**
 * Submit solo game result to global leaderboard
 */
export async function submitSoloResult(userId, displayName, difficulty, totalLevels, completedLevels, totalTime, totalWrongAnswers) {
  const leaderboardKey = getLeaderboardKey(difficulty, totalLevels);
  const leaderboardRef = ref(database, `soloLeaderboards/${leaderboardKey}/${userId}`);

  const result = {
    userId,
    displayName,
    difficulty,
    totalLevels,
    completedLevels,
    totalTime,
    totalWrongAnswers,
    timestamp: Date.now(),
    // Store as negative for sorting (newer entries rank higher when tied)
    sortTimestamp: -Date.now(),
  };

  await set(leaderboardRef, result);
  return result;
}

/**
 * Get global leaderboard for a specific difficulty and level count
 * Returns top 20 players and player's rank if they're below top 20
 */
export async function getGlobalLeaderboard(difficulty, totalLevels, userId = null) {
  const leaderboardKey = getLeaderboardKey(difficulty, totalLevels);
  const leaderboardRef = ref(database, `soloLeaderboards/${leaderboardKey}`);

  try {
    const snapshot = await get(leaderboardRef);
    
    if (!snapshot.exists()) {
      return {
        topPlayers: [],
        playerRank: null,
        totalPlayers: 0,
      };
    }

    const allResults = [];
    snapshot.forEach((childSnapshot) => {
      allResults.push({
        id: childSnapshot.key,
        ...childSnapshot.val(),
      });
    });

    // Sort according to ranking priority:
    // 1. Higher levels completed (descending)
    // 2. Less total time (ascending)
    // 3. Fewer wrong attempts (ascending)
    // 4. Newer entry ranks above older (descending timestamp)
    allResults.sort((a, b) => {
      // 1. Levels completed (higher is better)
      if (b.completedLevels !== a.completedLevels) {
        return b.completedLevels - a.completedLevels;
      }

      // 2. Total time (less is better)
      if (a.totalTime !== b.totalTime) {
        return a.totalTime - b.totalTime;
      }

      // 3. Wrong answers (fewer is better)
      const aWrong = a.totalWrongAnswers || 0;
      const bWrong = b.totalWrongAnswers || 0;
      if (aWrong !== bWrong) {
        return aWrong - bWrong;
      }

      // 4. Newer entry ranks above older (higher timestamp is better)
      // Since we stored sortTimestamp as negative, we reverse the comparison
      return b.timestamp - a.timestamp;
    });

    const topPlayers = allResults.slice(0, 20);
    
    // Find player's rank and data if userId provided
    let playerRank = null;
    let playerData = null;
    if (userId) {
      const playerIndex = allResults.findIndex((r) => r.userId === userId);
      if (playerIndex !== -1) {
        playerRank = playerIndex + 1;
        // If player is below top 20, include their data
        if (playerRank > 20) {
          playerData = allResults[playerIndex];
        }
      }
    }

    return {
      topPlayers,
      playerRank: playerRank && playerRank > 20 ? playerRank : null,
      playerData: playerData || null,
      totalPlayers: allResults.length,
    };
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return {
      topPlayers: [],
      playerRank: null,
      totalPlayers: 0,
    };
  }
}

/**
 * Get all leaderboard categories
 */
export function getLeaderboardCategories() {
  return [
    { difficulty: "Easy", totalLevels: 5 },
    { difficulty: "Easy", totalLevels: 10 },
    { difficulty: "Medium", totalLevels: 5 },
    { difficulty: "Medium", totalLevels: 10 },
    { difficulty: "Hard", totalLevels: 5 },
    { difficulty: "Hard", totalLevels: 10 },
  ];
}

/**
 * Update a solo user's display name everywhere it appears:
 * - local players directory: players/solo-${userId}
 * - all solo leaderboard categories where the user already has an entry
 */
export async function updateSoloDisplayNameEverywhere(userId, newDisplayName) {
  const trimmed = (newDisplayName || "").trim();
  if (!userId) throw new Error("Missing userId");
  if (!trimmed) throw new Error("Display name cannot be empty");

  // Update global player profile (used for tracking across games)
  const playerIdentifier = `solo-${userId}`;
  const globalPlayerRef = ref(database, `players/${playerIdentifier}`);
  await update(globalPlayerRef, {
    name: trimmed,
    lastPlayed: Date.now(),
  });

  // Update existing leaderboard entries across all categories
  const categories = getLeaderboardCategories();
  for (const cat of categories) {
    const leaderboardKey = getLeaderboardKey(cat.difficulty, cat.totalLevels);
    const entryRef = ref(database, `soloLeaderboards/${leaderboardKey}/${userId}`);
    const snap = await get(entryRef);
    if (snap.exists()) {
      await update(entryRef, { displayName: trimmed });
    }
  }
}
