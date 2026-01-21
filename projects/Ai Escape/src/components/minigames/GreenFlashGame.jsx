import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { hashStringToUint32, mulberry32 } from "../../utils/seededRandom";

/**
 * Green Flash Reaction Game - Player must tap ONLY when screen shows target color
 * 
 * DIFFICULTY SETTINGS:
 * - Easy: Green/Red only, 3 hits needed, slow timing (1.8-3.5s wait, 1.1s green)
 * - Medium: Green/Red + decoys at late levels, 4 hits, medium timing
 * - Hard: Multi-color mode with random target, 5+ hits, fast timing
 * 
 * Props:
 * - difficulty: "easy" | "medium" | "hard"
 * - levelNumber: current level (affects progression scaling)
 * - totalLevels: total levels in game
 * - seed: deterministic seed for multiplayer sync
 * - onSuccess: callback when game is completed successfully
 * - onFail: callback when player taps on wrong color
 */
const GreenFlashGame = ({
  difficulty = "medium",
  levelNumber = 1,
  totalLevels = 0,
  seed = "",
  onSuccess = () => {},
  onFail = () => {},
}) => {
  const difficultyLower = (difficulty || "medium").toLowerCase();
  const level = Number(levelNumber) || 1;
  const total = Number(totalLevels) || 5;

  // Calculate progress (0 to 1)
  const progress = useMemo(() => {
    if (total <= 1) return 0;
    return Math.min(1, Math.max(0, (level - 1) / (total - 1)));
  }, [level, total]);

  // Game mode based on difficulty and progress
  const gameMode = useMemo(() => {
    if (difficultyLower === 'easy') return 'standard';
    if (difficultyLower === 'medium') {
      return progress > 0.5 ? 'multiColor' : 'standard';
    }
    // Hard
    if (progress > 0.6) return 'sequence';
    if (progress > 0.3) return 'multiColor';
    return 'standard';
  }, [difficultyLower, progress]);

  // Color configuration
  const colorConfig = useMemo(() => {
    const configs = {
      standard: {
        colors: ['red', 'green'],
        styles: { red: 'bg-red-600', green: 'bg-green-500' },
      },
      multiColor: {
        colors: ['red', 'green', 'yellow', 'blue'],
        styles: { red: 'bg-red-600', green: 'bg-green-500', yellow: 'bg-yellow-500', blue: 'bg-blue-600' },
      },
      sequence: {
        colors: ['red', 'green', 'cyan', 'purple', 'orange'],
        styles: { red: 'bg-red-600', green: 'bg-green-500', cyan: 'bg-cyan-500', purple: 'bg-purple-600', orange: 'bg-orange-500' },
      },
    };
    return configs[gameMode] || configs.standard;
  }, [gameMode]);

  // Target color (green for standard/multiColor, random for sequence)
  const targetColor = useMemo(() => {
    if (gameMode === 'sequence') {
      const rand = mulberry32(hashStringToUint32(`${seed}:greenFlash:target:${level}`));
      const idx = Math.floor(rand() * colorConfig.colors.length);
      return colorConfig.colors[idx];
    }
    return 'green';
  }, [gameMode, seed, level, colorConfig.colors]);

  // Timing configuration based on difficulty
  const config = useMemo(() => {
    const baseConfigs = {
      easy: { minWait: 1800, maxWait: 3500, targetDuration: 1150, requiredHits: 3 },
      medium: { minWait: 1300, maxWait: 2800, targetDuration: 850, requiredHits: 4 },
      hard: { minWait: 850, maxWait: 2300, targetDuration: 520, requiredHits: 5 },
    };
    
    const base = baseConfigs[difficultyLower] || baseConfigs.medium;
    // Increase speed more aggressively as difficulty and progress rise
    const difficultyScale = difficultyLower === 'hard' ? 0.6 : difficultyLower === 'medium' ? 0.8 : 1;
    const progressScale = 1 - Math.min(0.4, progress * (difficultyLower === 'hard' ? 0.55 : 0.35));
    const speedScale = difficultyScale * progressScale;
    
    return {
      minWait: Math.max(650, Math.round(base.minWait * speedScale)),
      maxWait: Math.max(1700, Math.round(base.maxWait * speedScale)),
      targetDuration: Math.max(380, Math.round(base.targetDuration * speedScale)),
      requiredHits: Math.min(7, base.requiredHits + (progress > 0.6 ? 1 : 0)),
    };
  }, [difficultyLower, progress]);

  // Game state
  const [attempt, setAttempt] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentColor, setCurrentColor] = useState('red');
  const [gameOver, setGameOver] = useState(false);
  const [successCount, setSuccessCount] = useState(0);
  const [statusText, setStatusText] = useState('Tap Start to begin');
  
  const hasCalledCallback = useRef(false);
  const flashTimerRef = useRef(null);
  const durationTimerRef = useRef(null);
  const runIdRef = useRef(0);

  // Get random non-target color
  const getRandomNonTargetColor = useCallback((rand) => {
    const others = colorConfig.colors.filter(c => c !== targetColor);
    if (others.length === 0) return 'red';
    return others[Math.floor(rand() * others.length)];
  }, [colorConfig.colors, targetColor]);

  const clearTimers = useCallback(() => {
    if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
    if (durationTimerRef.current) clearTimeout(durationTimerRef.current);
  }, []);

  // Schedule next color flash
  const scheduleFlash = useCallback((runId) => {
    const rand = mulberry32(hashStringToUint32(`${seed}:flash:${runId}:${Date.now()}`));
    const waitTime = rand() * (config.maxWait - config.minWait) + config.minWait;

    flashTimerRef.current = setTimeout(() => {
      const showTarget = rand() > 0.3; // 70% chance for target

      if (showTarget) {
        setCurrentColor(targetColor);
        setStatusText('Tap now!');
        durationTimerRef.current = setTimeout(() => {
          setCurrentColor(getRandomNonTargetColor(rand));
          setStatusText('Wait...');
          if (!hasCalledCallback.current && runIdRef.current === runId) scheduleFlash(runId);
        }, config.targetDuration);
      } else {
        setCurrentColor(getRandomNonTargetColor(rand));
        setStatusText('Wait...');
        durationTimerRef.current = setTimeout(() => {
          if (!hasCalledCallback.current && runIdRef.current === runId) scheduleFlash(runId);
        }, config.targetDuration * 0.8);
      }
    }, waitTime);
  }, [seed, config, targetColor, getRandomNonTargetColor]);

  // Initialize / reset game state without auto-start
  const resetGameState = useCallback((nextAttempt = 0) => {
    clearTimers();
    hasCalledCallback.current = false;
    runIdRef.current = nextAttempt;
    setAttempt(nextAttempt);
    setCurrentColor('red');
    setGameOver(false);
    setSuccessCount(0);
    setHasStarted(false);
    setStatusText('Tap Start to begin');
  }, [clearTimers]);

  useEffect(() => {
    // Run only once on mount to set initial state
    resetGameState(0);
    return () => {
      clearTimers();
    };
  }, [resetGameState, clearTimers]);

  const startGame = useCallback(() => {
    const nextAttempt = attempt + 1;
    resetGameState(nextAttempt);
    setHasStarted(true);
    setStatusText('Wait for the target color...');
    hasCalledCallback.current = false;
    scheduleFlash(nextAttempt);
  }, [attempt, resetGameState, scheduleFlash]);

  // Handle tap
  const handleTap = useCallback((e) => {
    e.preventDefault();
    if (!hasStarted || gameOver || hasCalledCallback.current) return;

    if (currentColor === targetColor) {
      const newCount = successCount + 1;
      setSuccessCount(newCount);
      setStatusText('Nice! Keep going...');

      if (newCount >= config.requiredHits) {
        hasCalledCallback.current = true;
        setGameOver(true);
        setHasStarted(false);
        clearTimers();
        setStatusText('Completed! Play again?');
        onSuccess();
      }
    } else {
      hasCalledCallback.current = true;
      setGameOver(true);
      setHasStarted(false);
      clearTimers();
      setStatusText('Mistimed! Tap Play Again');
      onFail();
    }
  }, [hasStarted, gameOver, currentColor, targetColor, successCount, config.requiredHits, onSuccess, onFail, clearTimers]);

  // Get display values
  const isTarget = currentColor === targetColor;
  const colorClass = colorConfig.styles[currentColor] || 'bg-red-600';
  const targetColorDisplay = targetColor.charAt(0).toUpperCase() + targetColor.slice(1);
  
  const targetColorHex = {
    green: '#22c55e', cyan: '#06b6d4', purple: '#9333ea',
    orange: '#f97316', red: '#dc2626', yellow: '#eab308', blue: '#2563eb',
  }[targetColor] || '#22c55e';

  return (
    <div className="w-full flex flex-col">
      {/* Target indicator */}
      <div className="mb-2 text-center">
        <p className="text-white text-xs sm:text-sm opacity-80">
          Tap only on: <span className="font-bold text-sm sm:text-base" style={{ color: targetColorHex }}>
            {targetColorDisplay}
          </span>
        </p>
      </div>

      <p className="text-center text-white text-opacity-70 text-xs sm:text-sm mb-2">
        {statusText}
      </p>

      {/* Game area */}
      <div
        className={`w-full h-44 sm:h-52 md:h-60 flex flex-col items-center justify-center transition-colors duration-150 select-none rounded-xl ${colorClass} ${gameOver ? 'opacity-75' : ''} ${hasStarted ? 'cursor-pointer' : 'cursor-not-allowed'}`}
        onClick={handleTap}
      >
        <div className="text-center px-3">
          {!gameOver ? (
            <>
              <h1 className="text-white text-xl sm:text-2xl md:text-3xl font-bold mb-1">
                {!hasStarted ? 'PRESS START' : isTarget ? 'TAP NOW!' : 'WAIT...'}
              </h1>
              <p className="text-white text-sm sm:text-base opacity-90">
                {!hasStarted ? 'Begin when ready' : isTarget ? 'Quick!' : "Don't tap yet"}
              </p>
            </>
          ) : (
            <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold">
              {successCount >= config.requiredHits ? '✓ SUCCESS!' : '✗ FAILED!'}
            </h1>
          )}
        </div>
      </div>

      {/* Progress dots */}
      <div className="mt-3 flex gap-2 justify-center">
        {Array.from({ length: config.requiredHits }).map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 transition-all ${
              i < successCount ? 'bg-cyber-accent border-cyber-accent' : 'bg-transparent border-white border-opacity-50'
            }`}
          />
        ))}
      </div>

      {/* Progress text */}
      <p className="text-center text-white text-opacity-60 text-xs mt-1">
        {successCount} / {config.requiredHits} hits
      </p>

      {/* Controls */}
      <div className="mt-3 flex justify-center">
        <button
          onClick={startGame}
          className="w-full max-w-xs py-2 px-4 text-sm sm:text-base font-bold text-white bg-cyber-accent border border-cyber-accent rounded-lg transition-all duration-200 hover:bg-opacity-80 disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={hasStarted}
        >
          {gameOver ? 'Play Again' : hasStarted ? 'Running...' : 'Start'}
        </button>
      </div>
    </div>
  );
};

export default GreenFlashGame;
