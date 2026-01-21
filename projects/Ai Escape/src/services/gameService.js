import { database } from "./firebase";
import {
  ref,
  set,
  get,
  update,
  onValue,
  serverTimestamp,
  push,
  remove,
} from "firebase/database";
import { generateAllQuestions, checkAnswer } from "./gemini";
import { compareEscapeRanking } from "../utils/ranking";
import { notify } from "../utils/notify";

/**
 * Generate a unique 6-character room code
 */
export function generateRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

/**
 * Create a new game room (Admin)
 * ✅ Safari-safe with error handling
 */
export async function createGameRoom(adminName) {
  try {
    const roomCode = generateRoomCode();
    const roomRef = ref(database, `rooms/${roomCode}`);

    const roomData = {
      roomCode,
      adminName,
      status: "waiting", // waiting, playing, finished
      difficulty: null,
      duration: null, // in minutes
      totalLevels: null,
      startTime: null,
      endTime: null,
      serverStartTimestamp: null,
      questions: [],
      players: {},
      createdAt: Date.now(),
    };

    await set(roomRef, roomData);
    return roomCode;
  } catch (error) {
    console.error("❌ Firebase error creating room:", error);
    throw new Error("Unable to connect to game servers. Please check your internet connection.");
  }
}

/**
 * Join a game room (Player)
 */
export async function joinGameRoom(roomCode, playerIdentifier, playerName) {
  const roomRef = ref(database, `rooms/${roomCode}`);
  const roomSnapshot = await get(roomRef);

  if (!roomSnapshot.exists()) {
    throw new Error("Room not found");
  }

  const roomData = roomSnapshot.val();

  if (roomData.status !== "waiting") {
    throw new Error("Game already started or finished");
  }

  // Check if player already joined from another device
  const players = roomData.players || {};
  for (const playerId in players) {
    if (players[playerId].identifier === playerIdentifier) {
      // Ensure name is updated/stored on reconnection
      const existingPlayerRef = ref(database, `rooms/${roomCode}/players/${playerId}`);
      await update(existingPlayerRef, { name: playerName });
      
      // Store player in global players collection for tracking
      const globalPlayerRef = ref(database, `players/${playerIdentifier}`);
      await set(globalPlayerRef, {
        identifier: playerIdentifier,
        name: playerName,
        lastPlayed: Date.now(),
        lastRoom: roomCode,
      });
      
      return playerId; // Return existing player ID for reconnection
    }
  }

  // Check max players (5)
  if (Object.keys(players).length >= 5) {
    throw new Error("Room is full (max 5 players)");
  }

  // Add new player
  const playerRef = push(ref(database, `rooms/${roomCode}/players`));
  const playerId = playerRef.key;

  await set(playerRef, {
    id: playerId,
    identifier: playerIdentifier,
    name: playerName,
    ready: false,
    currentLevel: 0,
    completedLevels: 0,
    totalTime: 0,
    levelTimes: {},
    levelWrongAnswers: {},
    totalWrongAnswers: 0,
    lastProgressAt: Date.now(),
    gaveUp: false,
    disqualified: false,
    warnings: 0,
    joinedAt: Date.now(),
  });

  // Store player in global players collection for tracking across all games
  const globalPlayerRef = ref(database, `players/${playerIdentifier}`);
  await set(globalPlayerRef, {
    identifier: playerIdentifier,
    name: playerName,
    lastPlayed: Date.now(),
    lastRoom: roomCode,
  });

  return playerId;
}

/**
 * Update a player's name inside a specific room (e.g. after renaming in solo mode)
 */
export async function updatePlayerNameInRoom(roomCode, playerId, playerName) {
  const trimmed = (playerName || "").trim();
  if (!roomCode) throw new Error("Missing roomCode");
  if (!playerId) throw new Error("Missing playerId");
  if (!trimmed) throw new Error("Display name cannot be empty");

  const playerRef = ref(database, `rooms/${roomCode}/players/${playerId}`);
  await update(playerRef, { name: trimmed });
}

/**
 * Toggle player ready status
 */
export async function togglePlayerReady(roomCode, playerId) {
  const playerRef = ref(database, `rooms/${roomCode}/players/${playerId}`);
  const snapshot = await get(playerRef);

  if (snapshot.exists()) {
    const currentReady = snapshot.val().ready;
    await update(playerRef, { ready: !currentReady });
  }
}

/**
 * Set game configuration (Admin only)
 */
export async function setGameConfig(
  roomCode,
  difficulty,
  duration,
  totalLevels,
) {
  const roomRef = ref(database, `rooms/${roomCode}`);

  await update(roomRef, {
    difficulty,
    duration,
    totalLevels,
  });
}

/**
 * Start the game (Admin only)
 * Requires all players to be ready
 */
export async function startGame(roomCode) {
  const roomRef = ref(database, `rooms/${roomCode}`);
  const snapshot = await get(roomRef);

  if (!snapshot.exists()) {
    throw new Error("Room not found");
  }

  const roomData = snapshot.val();

  if (!roomData.difficulty || !roomData.duration || !roomData.totalLevels) {
    throw new Error("Game configuration incomplete");
  }

  // Check that all players are ready (only for multiplayer mode, not solo)
  const players = roomData.players || {};
  const playerList = Object.values(players);
  
  if (playerList.length === 0) {
    throw new Error("No players in the room");
  }

  // Detect solo mode: solo rooms have adminName starting with "Solo-" or only 1 player
  const isSoloMode = (roomData.adminName && roomData.adminName.startsWith("Solo-")) || playerList.length === 1;

  // Only require all players to be ready in multiplayer mode
  if (!isSoloMode) {
    const allPlayersReady = playerList.every((p) => p.ready === true);
    if (!allPlayersReady) {
      const readyCount = playerList.filter((p) => p.ready === true).length;
      throw new Error(`All players must be ready to start. ${readyCount}/${playerList.length} players are ready.`);
    }
  }

  // Generate questions
  const questions = await generateAllQuestions(
    roomData.difficulty,
    roomData.totalLevels,
  );

  // Calculate end time based on duration
  const startTime = Date.now();
  const endTime = startTime + roomData.duration * 60 * 1000;

  await update(roomRef, {
    status: "playing",
    startTime,
    endTime,
    serverStartTimestamp: serverTimestamp(),
    questions,
  });

  // Initialize all players to level 1
  for (const playerId in players) {
    await update(ref(database, `rooms/${roomCode}/players/${playerId}`), {
      currentLevel: 1,
      levelStartTime: startTime,
    });
  }
}

/**
 * Submit an answer
 */
export async function submitAnswer(roomCode, playerId, levelNumber, answer) {
  const roomRef = ref(database, `rooms/${roomCode}`);
  const snapshot = await get(roomRef);

  if (!snapshot.exists()) {
    throw new Error("Room not found");
  }

  const roomData = snapshot.val();
  const questions = roomData.questions || [];
  const currentQuestion = questions[levelNumber - 1];

  if (!currentQuestion) {
    throw new Error("Invalid level");
  }

  // Ensure answer is a string
  if (typeof answer !== "string") {
    answer = String(answer || "");
  }

  // Case-insensitive comparison (handles array of acceptable answers)
  const isCorrect = checkAnswer(answer, currentQuestion.answer);

  const playerRef = ref(database, `rooms/${roomCode}/players/${playerId}`);
  const playerSnapshot = await get(playerRef);
  const playerData = playerSnapshot.val();

  // Check if this is a solo game
  const isSolo = sessionStorage.getItem("isSolo") === "true";

  if (isCorrect) {
    const now = Date.now();
    const levelTime = now - (playerData.levelStartTime || roomData.startTime);
    
    // For solo mode: add time penalty for wrong answers in this level
    // Each wrong answer adds 10 seconds penalty (applied when level completes)
    const levelWrongAnswers = (playerData.levelWrongAnswers && playerData.levelWrongAnswers[levelNumber]) || 0;
    const wrongAnswersPenalty = isSolo ? (levelWrongAnswers * 10 * 1000) : 0;
    const newTotalTime = (playerData.totalTime || 0) + levelTime + wrongAnswersPenalty;

    const updates = {
      completedLevels: levelNumber,
      totalTime: newTotalTime,
      [`levelTimes/${levelNumber}`]: levelTime,
      lastProgressAt: now,
    };

    // Track total wrong answers across all levels (for both solo and multiplayer)
    // Sum up all wrong answers from all levels including the current one
    const allLevelWrongAnswers = playerData.levelWrongAnswers || {};
    let totalWrongAnswers = 0;
    for (const level in allLevelWrongAnswers) {
      totalWrongAnswers += allLevelWrongAnswers[level];
    }
    updates.totalWrongAnswers = totalWrongAnswers;

    // Move to next level if available
    if (levelNumber < roomData.totalLevels) {
      updates.currentLevel = levelNumber + 1;
      updates.levelStartTime = now;
    } else {
      // All levels completed
      updates.currentLevel = levelNumber;
      updates.levelStartTime = null;
    }

    await update(playerRef, updates);
  } else {
    // Wrong answer - increment wrong answers count for this level (for both solo and multiplayer)
    const now = Date.now();
    const currentWrongAnswers = (playerData.levelWrongAnswers && playerData.levelWrongAnswers[levelNumber]) || 0;
    const levelWrongAnswers = playerData.levelWrongAnswers || {};
    levelWrongAnswers[levelNumber] = currentWrongAnswers + 1;

    // Keep realtime leaderboard accurate by updating totalWrongAnswers on every wrong attempt
    let totalWrongAnswers = 0;
    for (const level in levelWrongAnswers) {
      totalWrongAnswers += Number(levelWrongAnswers[level] || 0);
    }

    await update(playerRef, {
      levelWrongAnswers,
      totalWrongAnswers,
      lastProgressAt: now,
    });
  }

  return isCorrect;
}

/**
 * Submit a mini-game result
 * Works similarly to submitAnswer but for mini-games
 */
export async function submitMiniGameResult(roomCode, playerId, levelNumber, gameType, isCorrect) {
  const roomRef = ref(database, `rooms/${roomCode}`);
  const snapshot = await get(roomRef);

  if (!snapshot.exists()) {
    throw new Error("Room not found");
  }

  const roomData = snapshot.val();
  const playerRef = ref(database, `rooms/${roomCode}/players/${playerId}`);
  const playerSnapshot = await get(playerRef);
  const playerData = playerSnapshot.val();

  if (!playerData) {
    throw new Error("Player not found");
  }

  // Check if this is a solo game
  const isSolo = sessionStorage.getItem("isSolo") === "true";

  if (isCorrect) {
    const now = Date.now();
    const levelTime = now - (playerData.levelStartTime || roomData.startTime);
    
    // For solo mode: add time penalty for wrong answers in this level
    // Each wrong answer adds 10 seconds penalty (applied when level completes)
    const levelWrongAnswers = (playerData.levelWrongAnswers && playerData.levelWrongAnswers[levelNumber]) || 0;
    const wrongAnswersPenalty = isSolo ? (levelWrongAnswers * 10 * 1000) : 0;
    const newTotalTime = (playerData.totalTime || 0) + levelTime + wrongAnswersPenalty;

    const updates = {
      completedLevels: levelNumber,
      totalTime: newTotalTime,
      [`levelTimes/${levelNumber}`]: levelTime,
      lastProgressAt: now,
    };

    // Track total wrong answers across all levels (for both solo and multiplayer)
    const allLevelWrongAnswers = playerData.levelWrongAnswers || {};
    let totalWrongAnswers = 0;
    for (const level in allLevelWrongAnswers) {
      totalWrongAnswers += Number(allLevelWrongAnswers[level] || 0);
    }
    updates.totalWrongAnswers = totalWrongAnswers;

    // Move to next level if available
    if (levelNumber < roomData.totalLevels) {
      updates.currentLevel = levelNumber + 1;
      updates.levelStartTime = now;
    } else {
      // All levels completed
      updates.currentLevel = levelNumber;
      updates.levelStartTime = null;
    }

    await update(playerRef, updates);
    return true;
  } else {
    // Wrong attempt - increment wrong answers count for this level (for both solo and multiplayer)
    const now = Date.now();
    const currentWrongAnswers = (playerData.levelWrongAnswers && playerData.levelWrongAnswers[levelNumber]) || 0;
    const levelWrongAnswers = playerData.levelWrongAnswers || {};
    levelWrongAnswers[levelNumber] = currentWrongAnswers + 1;

    // Keep realtime leaderboard accurate by updating totalWrongAnswers on every wrong attempt
    let totalWrongAnswers = 0;
    for (const level in levelWrongAnswers) {
      totalWrongAnswers += Number(levelWrongAnswers[level] || 0);
    }

    await update(playerRef, {
      levelWrongAnswers,
      totalWrongAnswers,
      lastProgressAt: now,
    });
    return false;
  }
}

/**
 * Add warning to player (anti-cheat)
 * For solo games, saves progress to global leaderboard when auto-disqualifying
 */
export async function addPlayerWarning(roomCode, playerId, reason) {
  const roomRef = ref(database, `rooms/${roomCode}`);
  const roomSnapshot = await get(roomRef);
  
  if (!roomSnapshot.exists()) {
    throw new Error("Room not found");
  }
  
  const roomData = roomSnapshot.val();
  const playerRef = ref(database, `rooms/${roomCode}/players/${playerId}`);
  const snapshot = await get(playerRef);

  if (snapshot.exists()) {
    const playerData = snapshot.val();
    const newWarnings = (playerData.warnings || 0) + 1;

    const updates = {
      warnings: newWarnings,
    };

    // Auto disqualify after 2 warnings
    if (newWarnings >= 2) {
      updates.disqualified = true;
      
      // For solo games, save progress to global leaderboard before disqualifying
      const isSolo = (roomData.adminName && roomData.adminName.startsWith("Solo-")) || 
                     (Object.keys(roomData.players || {}).length === 1);
      
      if (isSolo && playerData.identifier) {
        // Extract userId from identifier (format: "solo-${userId}")
        const userId = playerData.identifier.replace(/^solo-/, "");
        
        if (userId && roomData.difficulty && roomData.totalLevels) {
          try {
            // Dynamically import to avoid circular dependencies
            const { submitSoloResult } = await import("./leaderboardService");
            
            // Calculate total wrong answers correctly
            let totalWrongAnswers = 0;
            if (playerData.levelWrongAnswers && typeof playerData.levelWrongAnswers === "object") {
              for (const level in playerData.levelWrongAnswers) {
                totalWrongAnswers += Number(playerData.levelWrongAnswers[level] || 0);
              }
            } else {
              totalWrongAnswers = Number(playerData.totalWrongAnswers || 0);
            }
            
            // Calculate total time including current level progress
            let totalTime = Number(playerData.totalTime || 0);
            if (roomData.status === "playing" && playerData.currentLevel && playerData.levelStartTime) {
              const now = Date.now();
              const levelStartTime = Number(playerData.levelStartTime || roomData.startTime || 0);
              const elapsed = Math.max(0, now - levelStartTime);
              
              // Add penalty for wrong answers in current level (solo mode)
              const currentLevel = Number(playerData.currentLevel || 0);
              const levelWrongAnswers = playerData.levelWrongAnswers || {};
              const currentWrong = Number(levelWrongAnswers[currentLevel] || 0);
              const penalty = currentWrong * 10 * 1000;
              
              totalTime = totalTime + elapsed + penalty;
            }
            
            // Submit progress to global leaderboard
            await submitSoloResult(
              userId,
              playerData.name || "Unknown",
              roomData.difficulty,
              roomData.totalLevels,
              playerData.completedLevels || 0,
              totalTime,
              totalWrongAnswers
            );
          } catch (err) {
            console.error("Error submitting auto-disqualified solo player progress:", err);
            // Continue with disqualification even if leaderboard submission fails
          }
        }
      }
    }

    await update(playerRef, updates);

    return newWarnings;
  }
}

/**
 * Disqualify player (Admin)
 * For solo games, also saves progress to global leaderboard before disqualifying
 */
export async function disqualifyPlayer(roomCode, playerId) {
  const roomRef = ref(database, `rooms/${roomCode}`);
  const roomSnapshot = await get(roomRef);
  
  if (!roomSnapshot.exists()) {
    throw new Error("Room not found");
  }
  
  const roomData = roomSnapshot.val();
  const playerRef = ref(database, `rooms/${roomCode}/players/${playerId}`);
  const playerSnapshot = await get(playerRef);
  
  if (!playerSnapshot.exists()) {
    throw new Error("Player not found");
  }
  
  const playerData = playerSnapshot.val();
  
  // Check if this is a solo game
  const isSolo = (roomData.adminName && roomData.adminName.startsWith("Solo-")) || 
                 (Object.keys(roomData.players || {}).length === 1);
  
  // For solo games, save progress to global leaderboard before disqualifying
  if (isSolo && playerData.identifier) {
    // Extract userId from identifier (format: "solo-${userId}")
    const userId = playerData.identifier.replace(/^solo-/, "");
    
    if (userId && roomData.difficulty && roomData.totalLevels) {
      try {
        // Dynamically import to avoid circular dependencies
        const { submitSoloResult } = await import("./leaderboardService");
        
        // Calculate total wrong answers correctly
        let totalWrongAnswers = 0;
        if (playerData.levelWrongAnswers && typeof playerData.levelWrongAnswers === "object") {
          for (const level in playerData.levelWrongAnswers) {
            totalWrongAnswers += Number(playerData.levelWrongAnswers[level] || 0);
          }
        } else {
          totalWrongAnswers = Number(playerData.totalWrongAnswers || 0);
        }
        
        // Calculate total time including current level progress
        let totalTime = Number(playerData.totalTime || 0);
        if (roomData.status === "playing" && playerData.currentLevel && playerData.levelStartTime) {
          const now = Date.now();
          const levelStartTime = Number(playerData.levelStartTime || roomData.startTime || 0);
          const elapsed = Math.max(0, now - levelStartTime);
          
          // Add penalty for wrong answers in current level (solo mode)
          const currentLevel = Number(playerData.currentLevel || 0);
          const levelWrongAnswers = playerData.levelWrongAnswers || {};
          const currentWrong = Number(levelWrongAnswers[currentLevel] || 0);
          const penalty = currentWrong * 10 * 1000;
          
          totalTime = totalTime + elapsed + penalty;
        }
        
        // Submit progress to global leaderboard
        await submitSoloResult(
          userId,
          playerData.name || "Unknown",
          roomData.difficulty,
          roomData.totalLevels,
          playerData.completedLevels || 0,
          totalTime,
          totalWrongAnswers
        );
      } catch (err) {
        console.error("Error submitting disqualified solo player progress:", err);
        // Continue with disqualification even if leaderboard submission fails
      }
    }
  }
  
  // Update player as disqualified
  await update(playerRef, { disqualified: true });
}

/**
 * End game (Admin or automatic when timer expires)
 * Can optionally mark as abandoned by admin
 */
export async function endGame(roomCode, abandonedByAdmin = false) {
  const roomRef = ref(database, `rooms/${roomCode}`);
  const updates = {
    status: "finished",
    actualEndTime: Date.now(),
  };
  
  if (abandonedByAdmin) {
    updates.abandonedByAdmin = true;
  }
  
  await update(roomRef, updates);
}

/**
 * Subscribe to room updates
 */
export function subscribeToRoom(roomCode, callback) {
  const roomRef = ref(database, `rooms/${roomCode}`);
  return onValue(roomRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val());
    } else {
      callback(null);
    }
  });
}

/**
 * Get leaderboard data
 * Uses same ranking logic as solo mode: levels, time, wrong attempts
 * Includes all players (disqualified, gave up, etc.) so their progress is visible
 */
export function getLeaderboard(roomData) {
  const players = roomData.players || {};

  const leaderboard = Object.values(players)
    .map((p) => ({
      id: p.id,
      name: p.name,
      identifier: p.identifier || '',
      completedLevels: p.completedLevels || 0,
      totalTime: p.totalTime || 0,
      totalWrongAnswers: p.totalWrongAnswers ?? 0,
      timestamp: p.lastProgressAt || p.joinedAt || 0,
      gaveUp: !!p.gaveUp,
      disqualified: !!p.disqualified,
    }))
    .sort(compareEscapeRanking);

  return leaderboard;
}

/**
 * Export results to CSV format (deprecated - use exportResultsPDF)
 */
export function exportResultsCSV(roomData) {
  const leaderboard = getLeaderboard(roomData);

  let csv = "Rank,Name,Levels Completed,Total Time (seconds)\n";

  leaderboard.forEach((player, index) => {
    const rank = index + 1;
    const timeInSeconds = Math.floor(player.totalTime / 1000);
    csv += `${rank},${player.name},${player.completedLevels},${timeInSeconds}\n`;
  });

  return csv;
}

/**
 * Export results to PDF format
 */
export async function exportResultsPDF(roomData) {
  try {
    // Dynamically import jsPDF to avoid bundling issues
    const module = await import('jspdf');
    const jsPDF = module.default || module.jsPDF;
    const leaderboard = getLeaderboard(roomData);
    const doc = new jsPDF();

    // PDF Title
    doc.setFontSize(20);
    doc.setTextColor(0, 150, 200); // Cyan color
    doc.text('ESCAPE ROOM - GAME RESULTS', 105, 20, { align: 'center' });

    // Room Code
    doc.setFontSize(12);
    doc.setTextColor(50, 50, 50); // Dark gray
    doc.text(`Room Code: ${roomData.roomCode}`, 105, 30, { align: 'center' });

    // Game Info
    let yPos = 45;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100); // Gray
    
    if (roomData.difficulty) {
      doc.text(`Difficulty: ${roomData.difficulty}`, 20, yPos);
      yPos += 7;
    }
    if (roomData.totalLevels) {
      doc.text(`Total Levels: ${roomData.totalLevels}`, 20, yPos);
      yPos += 7;
    }
    if (roomData.duration) {
      doc.text(`Duration: ${roomData.duration} minutes`, 20, yPos);
      yPos += 7;
    }
    if (roomData.players) {
      doc.text(`Total Players: ${Object.keys(roomData.players).length}`, 20, yPos);
      yPos += 10;
    }

    // Table Header
    doc.setFillColor(0, 100, 200);
    doc.rect(20, yPos, 170, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text('Rank', 22, yPos + 6);
    doc.text('Name', 35, yPos + 6);
    doc.text('Identifier', 85, yPos + 6);
    doc.text('Lvls', 125, yPos + 6);
    doc.text('Time', 150, yPos + 6);

    yPos += 8;

    // Table Rows
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    
    leaderboard.forEach((player, index) => {
      const rank = index + 1;
      const timeInSeconds = Math.floor(player.totalTime / 1000);
      const minutes = Math.floor(timeInSeconds / 60);
      const seconds = timeInSeconds % 60;
      const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;

      // Alternate row colors
      if (index % 2 === 0) {
        doc.setFillColor(240, 240, 240); // Light gray background
        doc.rect(20, yPos, 170, 7, 'F');
      }

      doc.setTextColor(0, 0, 0); // Black text
      doc.setFontSize(9);
      doc.text(rank.toString(), 22, yPos + 5);
      // Truncate name if too long
      const displayName = player.name.length > 12 ? player.name.substring(0, 10) + '...' : player.name;
      doc.text(displayName, 35, yPos + 5);
      doc.text(player.identifier || 'N/A', 85, yPos + 5);
      doc.text(player.completedLevels.toString(), 125, yPos + 5);
      doc.text(timeString, 150, yPos + 5);

      yPos += 7;

      // Add new page if needed
      if (yPos > 280) {
        doc.addPage();
        yPos = 20;
      }
    });

    // Save PDF
    doc.save(`escape-room-results-${roomData.roomCode}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    notify.error(error.message ? `PDF export failed: ${error.message}` : "PDF export failed. Please try again.");
  }
}

/**
 * Calculate remaining time
 */
export function getRemainingTime(roomData) {
  if (!roomData.startTime || !roomData.endTime) {
    return 0;
  }

  const now = Date.now();
  const remaining = roomData.endTime - now;

  return Math.max(0, remaining);
}
