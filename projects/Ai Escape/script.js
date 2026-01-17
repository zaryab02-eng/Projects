// ============================================
// AI SECURITY ESCAPE ROOM - GAME LOGIC
// ============================================

// ============================================
// GAME CONFIGURATION
// CUSTOMIZE EVERYTHING HERE!
// ============================================

const GAME_CONFIG = {
  // TOTAL NUMBER OF LEVELS
  totalLevels: 5,

  // MAXIMUM HINTS PER LEVEL (CHANGE THIS to adjust difficulty)
  maxHintsPerLevel: 2,

  // ============================================
  // LEVEL DEFINITIONS
  // HOW TO ADD A NEW LEVEL:
  // 1. Copy one of the objects below
  // 2. Change id, name, question, answer, hints
  // 3. Add your own video URL (or use placeholder)
  // 4. Update totalLevels above
  // ============================================
  levels: [
    {
      id: 1,
      name: "FIREWALL BREACH",
      question: "SYSTEM LOG: First computer virus created in 1986. Name?",
      answer: "brain", // Answers are case-insensitive
      hints: [
        "LOG ENTRY: Originated in Pakistan, targeted MS-DOS systems",
        "LOG ENTRY: Named after the organ that processes information",
      ],
      // CHANGE THIS URL to use your own video
      // You can use: Local file path like "./assets/videos/level1.mp4"
      // Or online URLs from free video sites
      videoUrl:
        "https://cdn.pixabay.com/video/2019/11/12/28941-372485121_large.mp4",
      color: "#00ff41", // Neon green - customize per level
    },
    {
      id: 2,
      name: "ENCRYPTION LAYER",
      question: "DECODE: Binary 01001000 01001001 represents which word?",
      answer: "hi",
      hints: [
        "LOG ENTRY: Convert binary to ASCII characters",
        "LOG ENTRY: 01001000=72, 01001001=73 in decimal",
      ],
      videoUrl:
        "https://cdn.pixabay.com/video/2020/03/15/33121-399919076_large.mp4",
      color: "#00ffff", // Cyan
    },
    {
      id: 3,
      name: "DATABASE ACCESS",
      question: "SQL INJECTION DETECTED: What does SQL stand for? (full form)",
      answer: "structured query language",
      hints: [
        "LOG ENTRY: Standard language for database operations",
        "LOG ENTRY: S_______d Q___y L______e",
      ],
      videoUrl:
        "https://cdn.pixabay.com/video/2022/11/28/141298-777417110_large.mp4",
      color: "#ff00ff", // Magenta
    },
    {
      id: 4,
      name: "ADMIN OVERRIDE",
      question: "PATTERN RECOGNITION: 2, 4, 8, 16, ? (next number)",
      answer: "32",
      hints: [
        "LOG ENTRY: Each number doubles the previous",
        "LOG ENTRY: Powers of 2 sequence",
      ],
      videoUrl:
        "https://cdn.pixabay.com/video/2021/05/05/73515-546566455_large.mp4",
      color: "#ffff00", // Yellow
    },
    {
      id: 5,
      name: "CORE SYSTEM",
      question: "FINAL CHALLENGE: Port commonly used for HTTPS traffic?",
      answer: "443",
      hints: [
        "LOG ENTRY: Not 80 (that's HTTP)",
        "LOG ENTRY: Four hundred and forty-three",
      ],
      videoUrl:
        "https://cdn.pixabay.com/video/2023/05/01/160896-822708155_large.mp4",
      color: "#ff0000", // Red
    },
  ],
};

// ============================================
// GAME STATE VARIABLES
// ============================================
let currentLevel = 0; // Current level index (0-based)
let hintsUsed = 0; // Hints used in current level
let gameTimer = 0; // Timer in seconds
let timerInterval = null; // Timer interval reference

// ============================================
// INITIALIZE GAME
// ============================================
function initGame() {
  // Set total levels display
  document.getElementById("totalLevels").textContent = GAME_CONFIG.totalLevels;
  document.getElementById("totalLayersVictory").textContent =
    GAME_CONFIG.totalLevels;
  document.getElementById("maxHints").textContent =
    GAME_CONFIG.maxHintsPerLevel;

  // Load first level
  loadLevel(0);

  // Start timer
  startTimer();

  // Create level progress indicators
  updateLevelProgress();
}

// ============================================
// LOAD A SPECIFIC LEVEL
// ============================================
function loadLevel(levelIndex) {
  const level = GAME_CONFIG.levels[levelIndex];

  // Update UI
  document.getElementById("currentLevelNum").textContent = levelIndex + 1;
  document.getElementById("levelName").textContent = level.name;
  document.getElementById("levelName").style.color = level.color;
  document.getElementById("puzzleQuestion").textContent = level.question;

  // Reset hints for new level
  hintsUsed = 0;
  document.getElementById("hintsUsed").textContent = hintsUsed;

  // Clear input
  document.getElementById("answerInput").value = "";

  // Update video background
  updateVideo(level.videoUrl);

  // Update level progress
  updateLevelProgress();

  // Show level entry message
  showMessage("NEW SECURITY LAYER DETECTED. ANALYZING...", "info");
}

// ============================================
// UPDATE VIDEO BACKGROUND
// ============================================
function updateVideo(videoUrl) {
  const video = document.getElementById("backgroundVideo");
  const source = document.getElementById("videoSource");

  source.src = videoUrl;
  video.load();
  video.play();
}

// ============================================
// UPDATE LEVEL PROGRESS INDICATORS (Lock Icons)
// ============================================
function updateLevelProgress() {
  const progressContainer = document.getElementById("levelProgress");
  progressContainer.innerHTML = ""; // Clear existing

  for (let i = 0; i < GAME_CONFIG.totalLevels; i++) {
    // Create lock/unlock icon
    const icon = document.createElement("div");
    icon.className = "w-6 h-6";

    if (i <= currentLevel) {
      // Unlocked (green)
      icon.innerHTML = `
                <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="5" y="11" width="14" height="10" rx="2" stroke-width="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke-width="2"></path>
                    <circle cx="12" cy="16" r="1" fill="currentColor"></circle>
                </svg>
            `;
    } else {
      // Locked (red)
      icon.innerHTML = `
                <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="5" y="11" width="14" height="10" rx="2" stroke-width="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke-width="2"></path>
                </svg>
            `;
    }

    progressContainer.appendChild(icon);

    // Add connecting line (except after last icon)
    if (i < GAME_CONFIG.totalLevels - 1) {
      const line = document.createElement("div");
      line.className = `w-8 h-0.5 ${i < currentLevel ? "bg-green-400" : "bg-gray-600"}`;
      progressContainer.appendChild(line);
    }
  }
}

// ============================================
// TIMER FUNCTIONS
// ============================================
function startTimer() {
  timerInterval = setInterval(() => {
    gameTimer++;
    updateTimerDisplay();
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function updateTimerDisplay() {
  const minutes = Math.floor(gameTimer / 60);
  const seconds = gameTimer % 60;
  const formatted = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  document.getElementById("timer").textContent = formatted;
}

// ============================================
// SUBMIT ANSWER
// ============================================
function submitAnswer() {
  const userAnswer = document.getElementById("answerInput").value.trim();
  const level = GAME_CONFIG.levels[currentLevel];

  // Check if empty
  if (userAnswer === "") {
    showMessage(">>> ERROR: EMPTY INPUT DETECTED <<<", "error");
    return;
  }

  // ANSWER VALIDATION (case-insensitive)
  if (userAnswer.toLowerCase() === level.answer.toLowerCase()) {
    // CORRECT ANSWER
    showMessage(">>> ACCESS GRANTED. SECURITY LAYER BYPASSED <<<", "success");

    // Clear input
    document.getElementById("answerInput").value = "";

    // Move to next level after delay
    setTimeout(() => {
      if (currentLevel < GAME_CONFIG.totalLevels - 1) {
        currentLevel++;
        loadLevel(currentLevel);
      } else {
        // GAME COMPLETE!
        completeGame();
      }
    }, 1500);
  } else {
    // WRONG ANSWER
    showMessage(">>> ACCESS DENIED. INVALID CREDENTIALS <<<", "error");

    // Clear input
    document.getElementById("answerInput").value = "";

    // Shake animation
    document.body.classList.add("shake");
    setTimeout(() => {
      document.body.classList.remove("shake");
    }, 500);
  }
}

// ============================================
// SHOW HINT
// ============================================
function showHint() {
  const level = GAME_CONFIG.levels[currentLevel];

  // Check if hints available
  if (hintsUsed < Math.min(GAME_CONFIG.maxHintsPerLevel, level.hints.length)) {
    showMessage(level.hints[hintsUsed], "info");
    hintsUsed++;
    document.getElementById("hintsUsed").textContent = hintsUsed;
  } else {
    showMessage(">>> NO MORE SYSTEM LOGS AVAILABLE <<<", "error");
  }
}

// ============================================
// SHOW MESSAGE (with typing effect)
// ============================================
function showMessage(text, type) {
  const messageConsole = document.getElementById("messageConsole");
  const messageText = document.getElementById("messageText");

  // Update border color based on type
  if (type === "success") {
    messageConsole.className =
      "bg-black/70 border-2 border-green-500 p-6 min-h-[120px]";
    messageText.className = "text-sm md:text-base text-green-400";
  } else if (type === "error") {
    messageConsole.className =
      "bg-black/70 border-2 border-red-500 p-6 min-h-[120px]";
    messageText.className = "text-sm md:text-base text-red-400";
  } else {
    messageConsole.className =
      "bg-black/70 border-2 border-cyan-500 p-6 min-h-[120px]";
    messageText.className = "text-sm md:text-base text-cyan-400";
  }

  // Typing effect
  let index = 0;
  messageText.textContent = "";

  const typingInterval = setInterval(() => {
    messageText.textContent = text.slice(0, index) + "▊";
    index++;

    if (index > text.length) {
      clearInterval(typingInterval);
      messageText.innerHTML = text + '<span class="typing-cursor">▊</span>';
    }
  }, 30);
}

// ============================================
// COMPLETE GAME (Victory Screen)
// ============================================
function completeGame() {
  stopTimer();

  // Update victory screen
  const minutes = Math.floor(gameTimer / 60);
  const seconds = gameTimer % 60;
  const formatted = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  document.getElementById("finalTime").textContent = formatted;
  document.getElementById("layersCompleted").textContent =
    GAME_CONFIG.totalLevels;

  // Show victory screen
  document.getElementById("victoryScreen").classList.remove("hidden");
}

// ============================================
// RETURN TO HOME
// ============================================
function returnHome() {
  // CHANGE THIS if you rename index.html
  window.location.href = "index.html";
}

// ============================================
// START THE GAME WHEN PAGE LOADS
// ============================================
window.addEventListener("DOMContentLoaded", initGame);
