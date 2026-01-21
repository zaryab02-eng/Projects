# Mini-Games Configuration Guide

This document explains how each mini-game works and where to make changes for customization.

---

## Table of Contents
1. [Pattern Memory Game](#1-pattern-memory-game)
2. [Green Flash Game](#2-green-flash-game)
3. [Drag Drop Order Puzzle](#3-drag-drop-order-puzzle)
4. [Code Lock Game](#4-code-lock-game)
5. [Mini-Game Selector Logic](#5-mini-game-selector-logic)
6. [Common Configuration Points](#6-common-configuration-points)

---

## 1. Pattern Memory Game

**File:** `src/components/minigames/PatternMemoryGame.jsx`

### How It Works
- Player sees colored tiles flash in a sequence
- Player must repeat the sequence by tapping tiles in order
- Wrong tap = fail, correct sequence = success

### Difficulty Settings

| Setting | Easy | Medium | Hard |
|---------|------|--------|------|
| Grid Size | 4 tiles (2x2) | 6 tiles (2x3) | 6-9 tiles (2x3 or 3x3) |
| Sequence Length | 3-4 | 4-5 | 5-7 |
| Flash ON time | 700ms | 550ms | 400ms |
| Flash OFF time | 400ms | 300ms | 200ms |

### Where to Change

#### Grid Size (Line ~33-44)
```javascript
const gridSize = useMemo(() => {
  switch (difficultyLower) {
    case 'easy':
      return 4; // Change to 6 for 2x3 grid
    case 'hard':
      return progress > 0.5 ? 9 : 6; // 9 = 3x3, 6 = 2x3
    default: // medium
      return 6;
  }
}, [difficultyLower, progress]);
```

#### Sequence Length (Line ~47-59)
```javascript
const sequenceLength = useMemo(() => {
  switch (difficultyLower) {
    case 'easy':
      return progress > 0.7 ? 4 : 3; // Change numbers here
    case 'hard':
      if (progress > 0.7) return 7;
      if (progress > 0.4) return 6;
      return 5;
    default: // medium
      return progress > 0.5 ? 5 : 4;
  }
}, [difficultyLower, progress]);
```

#### Flash Timings (Line ~62-80)
```javascript
const getFlashTimings = useCallback(() => {
  switch (difficultyLower) {
    case 'easy':
      return {
        initialDelay: 600, // Time before pattern starts
        on: 700,           // How long tile stays lit
        off: 400,          // Gap between tiles
      };
    // ... other difficulties
  }
}, [difficultyLower, progress]);
```

#### Tile Colors (Line ~147-157)
```javascript
const getTileColor = (index) => {
  const colors = [
    '#3B82F6', // blue - change hex codes here
    '#EF4444', // red
    '#10B981', // green
    // Add more colors for larger grids
  ];
  return colors[index % colors.length];
};
```

---

## 2. Green Flash Game

**File:** `src/components/minigames/GreenFlashGame.jsx`

### How It Works
- Screen flashes between colors
- Player must tap ONLY when target color appears
- Tapping wrong color = fail
- Reaching required hits = success

### Difficulty Settings

| Setting | Easy | Medium | Hard |
|---------|------|--------|------|
| Game Mode | Standard (Green/Red) | Standard → MultiColor | Standard → MultiColor → Sequence |
| Required Hits | 3 | 4 | 5+ |
| Wait Time | 1.8-3.5s | 1.4-3.0s | 0.9-2.5s |
| Target Duration | 1100ms | 850ms | 550ms |

### Where to Change

#### Game Modes (Line ~27-36)
```javascript
const gameMode = useMemo(() => {
  if (difficultyLower === 'easy') return 'standard';
  if (difficultyLower === 'medium') {
    return progress > 0.5 ? 'multiColor' : 'standard'; // Change 0.5 threshold
  }
  // Hard: sequence mode at late game
  if (progress > 0.6) return 'sequence';
  if (progress > 0.3) return 'multiColor';
  return 'standard';
}, [difficultyLower, progress]);
```

#### Color Palettes (Line ~39-53)
```javascript
const colorConfig = useMemo(() => {
  const configs = {
    standard: {
      colors: ['red', 'green'], // Add colors here
      styles: { red: 'bg-red-600', green: 'bg-green-500' },
    },
    multiColor: {
      colors: ['red', 'green', 'yellow', 'blue'],
      // ...
    },
    sequence: {
      colors: ['red', 'green', 'cyan', 'purple', 'orange'],
      // ...
    },
  };
}, [gameMode]);
```

#### Timing Configuration (Line ~66-77)
```javascript
const config = useMemo(() => {
  const baseConfigs = {
    easy: { minWait: 1800, maxWait: 3500, targetDuration: 1100, requiredHits: 3 },
    medium: { minWait: 1400, maxWait: 3000, targetDuration: 850, requiredHits: 4 },
    hard: { minWait: 900, maxWait: 2500, targetDuration: 550, requiredHits: 5 },
  };
  // ...
}, [difficultyLower, progress]);
```

---

## 3. Drag Drop Order Puzzle

**File:** `src/components/minigames/DragDropOrderPuzzle.jsx`

### How It Works
- Player sees shuffled sequence items
- Must drag items to arrange in correct order
- Press SUBMIT to check answer
- Wrong order = fail, correct = success

### Difficulty Settings

| Setting | Easy | Medium | Hard |
|---------|------|--------|------|
| Item Count | 3-4 | 4 | 4-5 |
| Theme Complexity | Simple | Mixed | Complex |

### Where to Change

#### Item Count (Line ~24-33)
```javascript
const itemCount = useMemo(() => {
  switch (difficultyLower) {
    case 'easy':
      return progress > 0.7 ? 4 : 3; // 3 items early, 4 late
    case 'hard':
      return progress > 0.5 ? 5 : 4; // 4 items early, 5 late
    default: // medium
      return 4; // Always 4 items
  }
}, [difficultyLower, progress]);
```

#### Theme Sets (Line ~36-49)
```javascript
const THEMES = [
  ["Wake up", "Find clue", "Decode", "Unlock", "Escape"],
  ["Boot system", "Authenticate", "Bypass", "Override", "Access"],
  // Add your own themes here - each array should have 5 items
  ["Step 1", "Step 2", "Step 3", "Step 4", "Step 5"],
];
```

---

## 4. Code Lock Game

**File:** `src/components/minigames/CodeLock.jsx`

### How It Works
- Player rotates 3 dials to guess a 3-digit code
- **HINT FEATURE**: Click sound plays when all 3 dials are correct
- Press TRY CODE to submit guess
- Wrong code = fail, correct = success

### Difficulty Settings

| Setting | Easy | Medium | Hard |
|---------|------|--------|------|
| Digit Range | 0-5 (early) to 0-9 | 0-9 | 0-9 |
| Hints | 2 exact + 1 range | All ranges (±1) | Wide ranges (±2) + parity |
| Dial Sensitivity | 1.0x | 1.3x | 1.6x |

### Where to Change

#### Secret Code Generation (Line ~28-46)
```javascript
const secretCode = useMemo(() => {
  // Max digit based on difficulty
  let maxDigit = 9;
  if (difficultyLower === 'easy') {
    maxDigit = progress < 0.5 ? 5 : progress < 0.8 ? 7 : 9;
  }
  // Change maxDigit values to adjust digit range
}, [seed, difficultyLower, level, total, progress]);
```

#### Hint Display (Line ~180-215)
```javascript
const renderHint = () => {
  if (difficultyLower === 'easy') {
    // Shows 2 exact digits + 1 range
    return <p>Hint: Dial 1 = {d1}, Dial 2 = {d2}, Dial 3 = {range}</p>;
  }
  if (difficultyLower === 'medium') {
    // Shows all ranges (±1)
    return <p>Hint: {range1}, {range2}, {range3}</p>;
  }
  // Hard: wider ranges + parity (even/odd)
};
```

#### Dial Sensitivity (Line ~95-98)
```javascript
const sensitivity = useMemo(() => {
  const base = difficultyLower === 'easy' ? 1 : difficultyLower === 'hard' ? 1.6 : 1.3;
  return base + Math.min(0.6, (level - 1) * 0.05); // Increases with level
}, [difficultyLower, level]);
```

---

## 5. Mini-Game Selector Logic

**File:** `src/utils/miniGameSelector.js`

### How It Works
- Level 1: Question (always)
- Level 2: Mini-game
- Level 3: Question
- Level 4: Mini-game
- Pattern: Odd levels = Questions, Even levels = Mini-games

### Where to Change

#### Level Pattern (Line ~16-28)
```javascript
export function shouldShowMiniGame(levelNumber, totalLevels) {
  const level = Number(levelNumber || 0);
  if (level <= 1) return false; // Level 1 always question

  // Even levels are mini-games
  return level % 2 === 0;
  
  // Alternative: Mini-game every 3rd level starting from level 2
  // return (level - 2) % 3 === 0 && level >= 2;
}
```

#### Mini-Game Selection (Line ~36-52)
```javascript
const MINI_GAMES = ["patternMemory", "codeLock", "dragDropOrder", "greenFlash"];

export function selectMiniGame(levelNumber, previousType) {
  // Cycles through mini-games
  const miniGameOccurrence = Math.floor(level / 2) - 1;
  const baseIndex = miniGameOccurrence % MINI_GAMES.length;
  
  // Change MINI_GAMES array order to change which games appear first
}
```

---

## 6. Common Configuration Points

### Adding New Sound Effects

**File:** `src/components/MiniGameWrapper.jsx`

```javascript
const playSound = (soundFile) => {
  const audio = new Audio(soundFile);
  audio.volume = 0.5; // Change volume (0.0 to 1.0)
  audio.play();
};

// Usage:
playSound("/sounds/unlock.mp3"); // Success sound
playSound("/sounds/wrong.mp3");  // Fail sound
```

### Sound Files Location
Place audio files in: `public/sounds/`
- `unlock.mp3` - Success sound
- `wrong.mp3` - Failure sound  
- `locker.mp3` - Code lock rotation (loops)
- `click.mp3` - Code lock hint (correct combination)

### Progress Calculation
All mini-games use this progress formula:
```javascript
const progress = (level - 1) / (totalLevels - 1);
// progress = 0 at level 1
// progress = 1 at last level
// Use progress to scale difficulty within a run
```

### Wrapper Styling

**File:** `src/components/MiniGameWrapper.jsx`

Change mini-game container styling here:
```javascript
<div className="max-w-lg mx-auto"> // Max width
  <div className="p-2 sm:p-3 md:p-4 bg-black bg-opacity-40"> // Padding
    {/* Mini-game content */}
  </div>
</div>
```

---

## Quick Reference: File Locations

| Component | File Path |
|-----------|-----------|
| Pattern Memory | `src/components/minigames/PatternMemoryGame.jsx` |
| Green Flash | `src/components/minigames/GreenFlashGame.jsx` |
| Drag Drop | `src/components/minigames/DragDropOrderPuzzle.jsx` |
| Code Lock | `src/components/minigames/CodeLock.jsx` |
| Wrapper | `src/components/MiniGameWrapper.jsx` |
| Selector Logic | `src/utils/miniGameSelector.js` |
| Game Room | `src/components/GameRoom.jsx` |
| Sounds | `public/sounds/` |

---

## Testing Checklist

Before deploying, test each mini-game with:
- [ ] Easy difficulty (early level, e.g., level 2 of 10)
- [ ] Easy difficulty (late level, e.g., level 8 of 10)
- [ ] Medium difficulty (early and late levels)
- [ ] Hard difficulty (early and late levels)
- [ ] Solo mode
- [ ] Multiplayer mode (2+ players)
- [ ] Mobile devices (touch interactions)
- [ ] Desktop (mouse interactions)
