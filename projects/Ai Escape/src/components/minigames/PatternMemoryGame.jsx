import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { hashStringToUint32, mulberry32, seededInt } from "../../utils/seededRandom";

/**
 * Pattern Memory Game - Player must remember and repeat a sequence of colored tiles
 * 
 * DIFFICULTY SETTINGS:
 * - Easy: 4 tiles (2x2), 3-4 sequence length, slow flash speed
 * - Medium: 6 tiles (2x3), 4-5 sequence length, medium flash speed  
 * - Hard: 6-9 tiles (2x3 or 3x3), 5-7 sequence length, fast flash speed
 * 
 * Props:
 * - difficulty: "easy" | "medium" | "hard"
 * - levelNumber: current level (affects progression scaling)
 * - totalLevels: total levels in game (for progress calculation)
 * - seed: deterministic seed for multiplayer sync
 * - onSuccess: callback when game is completed successfully
 * - onFail: callback when player makes a mistake
 */
const PatternMemoryGame = ({
  difficulty = "medium",
  levelNumber = 1,
  totalLevels = 0,
  seed = "",
  onSuccess,
  onFail,
}) => {
  const difficultyLower = (difficulty || "medium").toLowerCase();
  const level = Number(levelNumber) || 1;
  const total = Number(totalLevels) || 5;

  // Calculate progress (0 to 1) based on level
  const progress = useMemo(() => {
    if (total <= 1) return 0;
    return Math.min(1, Math.max(0, (level - 1) / (total - 1)));
  }, [level, total]);

  // GRID SIZE based on difficulty
  const gridSize = useMemo(() => {
    switch (difficultyLower) {
      case 'easy':
        return 4; // 2x2 grid
      case 'hard':
        return progress > 0.5 ? 9 : 6; // 3x3 late game, 2x3 early
      default: // medium
        return 6; // 2x3 grid
    }
  }, [difficultyLower, progress]);

  // SEQUENCE LENGTH based on difficulty and progress
  const sequenceLength = useMemo(() => {
    switch (difficultyLower) {
      case 'easy':
        return progress > 0.7 ? 4 : 3;
      case 'hard':
        if (progress > 0.7) return 7;
        if (progress > 0.4) return 6;
        return 5;
      default: // medium
        return progress > 0.5 ? 5 : 4;
    }
  }, [difficultyLower, progress]);

  // FLASH TIMINGS based on difficulty and progress
  const getFlashTimings = useCallback(() => {
    const difficultySpeed =
      difficultyLower === 'hard' ? 0.6 : difficultyLower === 'medium' ? 0.8 : 1;
    // Make later levels faster and scale harder difficulties more aggressively
    const progressBoost = 1 - Math.min(0.45, progress * (difficultyLower === 'hard' ? 0.55 : 0.35));
    const speedMultiplier = difficultySpeed * progressBoost;

    switch (difficultyLower) {
      case 'easy':
        return {
          initialDelay: Math.round(700 * speedMultiplier),
          on: Math.round(850 * speedMultiplier),
          off: Math.round(450 * speedMultiplier),
        };
      case 'hard':
        return {
          initialDelay: Math.round(320 * speedMultiplier),
          on: Math.round(360 * speedMultiplier),
          off: Math.round(170 * speedMultiplier),
        };
      default: // medium
        return {
          initialDelay: Math.round(520 * speedMultiplier),
          on: Math.round(620 * speedMultiplier),
          off: Math.round(320 * speedMultiplier),
        };
    }
  }, [difficultyLower, progress]);

  // Game state
  const [attempt, setAttempt] = useState(0);
  const [pattern, setPattern] = useState([]);
  const [userInput, setUserInput] = useState([]);
  const [isFlashing, setIsFlashing] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [inputEnabled, setInputEnabled] = useState(false);
  const [hasFailed, setHasFailed] = useState(false);

  // Generate pattern deterministically but change per attempt to avoid repeats
  const generatePattern = useCallback((attemptValue = 0) => {
    const seedString = `${seed}:patternMemory:${difficultyLower}:L${level}:T${total}:A${attemptValue}`;
    const rand = mulberry32(hashStringToUint32(seedString));

    const newPattern = [];
    for (let i = 0; i < sequenceLength; i++) {
      newPattern.push(seededInt(rand, 0, gridSize - 1));
    }

    setAttempt(attemptValue);
    setPattern(newPattern);
    setUserInput([]);
    setGameStarted(false);
    setInputEnabled(false);
    setIsFlashing(false);
    setActiveIndex(null);
    setHasFailed(false);
  }, [seed, difficultyLower, level, total, sequenceLength, gridSize]);

  const regenerateWithNewAttempt = useCallback(() => {
    const nextAttempt = attempt + 1;
    generatePattern(nextAttempt);
  }, [attempt, generatePattern]);

  // Generate pattern on mount or when dependencies change
  useEffect(() => {
    generatePattern(0);
  }, [generatePattern]);

  // Start game and flash pattern
  const startGame = useCallback(() => {
    setGameStarted(true);
    setUserInput([]);
    setInputEnabled(false);
    setHasFailed(false);

    const flashPattern = async () => {
      const timings = getFlashTimings();
      setIsFlashing(true);

      await new Promise(r => setTimeout(r, timings.initialDelay));

      for (let i = 0; i < pattern.length; i++) {
        setActiveIndex(pattern[i]);
        await new Promise(r => setTimeout(r, timings.on));
        setActiveIndex(null);
        await new Promise(r => setTimeout(r, timings.off));
      }

      setIsFlashing(false);
      setInputEnabled(true);
    };

    flashPattern();
  }, [pattern, getFlashTimings]);

  // Handle tile click
  const handleTileClick = useCallback((index) => {
    if (!inputEnabled || isFlashing) return;

    const currentStep = userInput.length;
    const newInput = [...userInput, index];
    setUserInput(newInput);

    // Flash clicked tile
    setActiveIndex(index);
    setTimeout(() => setActiveIndex(null), 150);

    // Check if wrong
    if (index !== pattern[currentStep]) {
      setInputEnabled(false);
      setHasFailed(true);
      setTimeout(() => {
        if (onFail) onFail();
        regenerateWithNewAttempt();
      }, 300);
      return;
    }

    // Check if complete
    if (newInput.length === pattern.length) {
      setInputEnabled(false);
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 300);
    }
  }, [inputEnabled, isFlashing, userInput, pattern, onFail, onSuccess, regenerateWithNewAttempt]);

  // Tile colors
  const getTileColor = (index) => {
    const colors = [
      '#3B82F6', // blue
      '#EF4444', // red
      '#10B981', // green
      '#F59E0B', // amber
      '#8B5CF6', // purple
      '#EC4899', // pink
      '#06B6D4', // cyan
      '#F97316', // orange
      '#14B8A6', // teal
    ];
    return colors[index % colors.length];
  };

  // Grid columns based on grid size
  const gridCols = gridSize === 4 ? 2 : 3;

  return (
    <div className="w-full flex flex-col items-center">
      {/* Title */}
      <h2 className="text-cyber-accent text-center mb-2 text-lg sm:text-xl font-bold glow-text">
        Pattern Memory
      </h2>

      {/* Status */}
      <div className="text-center text-white text-opacity-70 mb-3 text-xs sm:text-sm min-h-[20px]">
        {gameStarted ? (
          isFlashing ? (
            'Watch the pattern...'
          ) : inputEnabled ? (
            `Repeat: ${userInput.length} / ${pattern.length}`
          ) : (
            hasFailed ? 'Wrong! Tap button to retry.' : 'Get ready...'
          )
        ) : (
          `Remember ${sequenceLength} tiles`
        )}
      </div>

      {/* Grid */}
      <div 
        className="grid gap-2 sm:gap-3 mb-4"
        style={{ 
          gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
          width: gridSize === 4 ? '160px' : gridSize === 9 ? '210px' : '210px',
          maxWidth: '100%'
        }}
      >
        {Array.from({ length: gridSize }).map((_, index) => (
          <div
            key={index}
            onClick={() => handleTileClick(index)}
            className="aspect-square rounded-lg sm:rounded-xl transition-all duration-150"
            style={{
              backgroundColor: getTileColor(index),
              opacity: activeIndex === index ? 1 : 0.35,
              transform: activeIndex === index ? 'scale(0.92)' : 'scale(1)',
              cursor: inputEnabled ? 'pointer' : 'default',
              boxShadow: activeIndex === index 
                ? '0 0 15px rgba(255, 255, 255, 0.5)' 
                : '0 2px 4px rgba(0, 0, 0, 0.3)',
              minWidth: gridSize === 4 ? '60px' : '55px',
              minHeight: gridSize === 4 ? '60px' : '55px',
            }}
          />
        ))}
      </div>

      {/* Start button */}
      {!gameStarted && (
        <button
          onClick={startGame}
          className="w-full max-w-xs py-2.5 px-4 text-sm sm:text-base font-bold text-white bg-cyber-accent border border-cyber-accent rounded-lg transition-all duration-200 hover:bg-opacity-80"
        >
          {hasFailed ? "Play Again" : "Start Game"}
        </button>
      )}
    </div>
  );
};

export default PatternMemoryGame;
