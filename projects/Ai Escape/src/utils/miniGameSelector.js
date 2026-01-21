// Mini-game selection + scheduling logic
// Pattern: Level 1 = Question, Level 2 = Mini-game, Level 3 = Question, Level 4 = Mini-game, etc.
// Odd levels = Questions, Even levels = Mini-games

const MINI_GAMES = ["patternMemory", "codeLock", "dragDropOrder", "greenFlash"];

/**
 * Decide whether the given level should contain a mini‑game.
 *
 * Pattern:
 * - Level 1: Question (always start with a question)
 * - Level 2: Mini-game
 * - Level 3: Question
 * - Level 4: Mini-game
 * - Level 5: Question
 * - And so on... (odd = question, even = mini-game)
 *
 * This ensures alternating Question → Mini-game → Question → Mini-game pattern
 * based on the admin/player's chosen number of levels.
 */
export function shouldShowMiniGame(levelNumber, totalLevels) {
  const level = Number(levelNumber || 0);
  const total = Number(totalLevels || 0);

  if (!level || !total) return false;
  if (level <= 1) return false; // Level 1 is always a question
  if (level > total) return false; // Beyond total levels

  // Even levels are mini-games (2, 4, 6, 8, ...)
  // Odd levels are questions (1, 3, 5, 7, ...)
  return level % 2 === 0;
}

/**
 * Pick which mini‑game to show for a level.
 *
 * - Deterministic based on level number.
 * - Uses the mini-game index based on how many mini-games have occurred so far.
 * - Cycles through all mini-game types for variety.
 * - Mini-games occur on even levels (2, 4, 6, 8, ...)
 *   So level 2 = 1st mini-game, level 4 = 2nd mini-game, etc.
 */
export function selectMiniGame(levelNumber, previousType) {
  const level = Number(levelNumber || 0);
  if (!level) return MINI_GAMES[0];

  // Calculate which mini-game occurrence this is (1st, 2nd, 3rd, etc.)
  // Level 2 = 1st mini-game (index 0), Level 4 = 2nd (index 1), Level 6 = 3rd (index 2)
  const miniGameOccurrence = Math.floor(level / 2) - 1;
  const baseIndex = miniGameOccurrence % MINI_GAMES.length;
  let candidate = MINI_GAMES[baseIndex];

  // Avoid repeating the same game type as the previous mini-game if possible
  if (previousType && MINI_GAMES.includes(previousType) && candidate === previousType) {
    const nextIndex = (baseIndex + 1) % MINI_GAMES.length;
    candidate = MINI_GAMES[nextIndex];
  }

  return candidate;
}

