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
  const players = roomData.players || {};
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

  if (isCorrect) {
    const playerRef = ref(database, `rooms/${roomCode}/players/${playerId}`);
    const playerSnapshot = await get(playerRef);
    const playerData = playerSnapshot.val();

    const now = Date.now();
    const levelTime = now - (playerData.levelStartTime || roomData.startTime);
    const newTotalTime = (playerData.totalTime || 0) + levelTime;

    const updates = {
      completedLevels: levelNumber,
      totalTime: newTotalTime,
      [`levelTimes/${levelNumber}`]: levelTime,
    };

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
  }

  return isCorrect;
}

/**
 * Add warning to player (anti-cheat)
 */
export async function addPlayerWarning(roomCode, playerId, reason) {
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
    }

    await update(playerRef, updates);

    return newWarnings;
  }
}

/**
 * Disqualify player (Admin)
 */
export async function disqualifyPlayer(roomCode, playerId) {
  const playerRef = ref(database, `rooms/${roomCode}/players/${playerId}`);
  await update(playerRef, { disqualified: true });
}

/**
 * End game (Admin or automatic when timer expires)
 */
export async function endGame(roomCode) {
  const roomRef = ref(database, `rooms/${roomCode}`);
  await update(roomRef, {
    status: "finished",
    actualEndTime: Date.now(),
  });
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
 */
export function getLeaderboard(roomData) {
  const players = roomData.players || {};

  const leaderboard = Object.values(players)
    .filter((p) => !p.disqualified)
    .map((p) => ({
      id: p.id,
      name: p.name,
      identifier: p.identifier || '',
      completedLevels: p.completedLevels || 0,
      totalTime: p.totalTime || 0,
    }))
    .sort((a, b) => {
      // Sort by levels completed (descending), then by time (ascending)
      if (b.completedLevels !== a.completedLevels) {
        return b.completedLevels - a.completedLevels;
      }
      return a.totalTime - b.totalTime;
    });

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
    alert('Error generating PDF: ' + (error.message || 'Unknown error. Please check the browser console.'));
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
