import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Lock, Unlock, RotateCw, Volume2 } from 'lucide-react';
import { hashStringToUint32, mulberry32, seededInt } from "../../utils/seededRandom";

/**
 * Code Lock Game - Player must unlock a 3-digit code lock
 * 
 * DIFFICULTY SETTINGS:
 * - Easy: Digits 0-5 (early) to 0-9 (late), 2 exact hints + 1 range
 * - Medium: Digits 0-9, all range hints (±1)
 * - Hard: Digits 0-9, wider range hints (±2) with parity
 * 
 * SPECIAL FEATURE: Click sound plays as HINT when all 3 dials are correct during rotation
 * 
 * Props:
 * - difficulty: "easy" | "medium" | "hard"
 * - levelNumber: current level
 * - totalLevels: total levels in game
 * - seed: deterministic seed for multiplayer sync
 * - onSuccess: callback when code is unlocked
 * - onFail: callback when wrong code is tried
 */
export default function CodeLock({
  difficulty = "medium",
  levelNumber = 1,
  totalLevels = 0,
  seed = "",
  onSuccess,
  onFail,
}) {
  const difficultyLower = (difficulty || "medium").toLowerCase();
  const level = Number(levelNumber) || 1;
  const total = Number(totalLevels) || 5;

  // Calculate progress (0 to 1)
  const progress = useMemo(() => {
    if (total <= 1) return 0;
    return Math.min(1, Math.max(0, (level - 1) / (total - 1)));
  }, [level, total]);

  // Generate secret code based on difficulty
  const secretCode = useMemo(() => {
    const seedString = `${seed}:codeLock:${difficultyLower}:L${level}:T${total}`;
    const rand = mulberry32(hashStringToUint32(seedString));

    // Max digit based on difficulty and progress
    let maxDigit = 9;
    if (difficultyLower === 'easy') {
      maxDigit = progress < 0.5 ? 5 : progress < 0.8 ? 7 : 9;
    }

    const pickDigit = () => seededInt(rand, 0, maxDigit);
    let a = pickDigit();
    let b = pickDigit();
    let c = pickDigit();

    // Avoid triples (0-0-0, 5-5-5, etc.) except on very easy early levels
    const avoidTriples = difficultyLower !== 'easy' || progress > 0.6;
    if (avoidTriples && a === b && b === c) {
      c = (c + seededInt(rand, 1, maxDigit || 9)) % (maxDigit + 1);
    }

    return [a, b, c];
  }, [seed, difficultyLower, level, total, progress]);

  // Game state
  const [code, setCode] = useState([0, 0, 0]);
  const [dialAngles, setDialAngles] = useState([0, 0, 0]);
  const [dragIndex, setDragIndex] = useState(null);
  const [isLocked, setIsLocked] = useState(true);
  const [hasWon, setHasWon] = useState(false);
  const [error, setError] = useState("");
  const [hintPlayed, setHintPlayed] = useState(false);

  // Audio refs
  const lockerSoundRef = useRef(null);
  const clickSoundRef = useRef(null);

  // Initialize audio
  useEffect(() => {
    lockerSoundRef.current = new Audio('/sounds/locker.mp3');
    lockerSoundRef.current.loop = true;
    lockerSoundRef.current.volume = 0.4;

    clickSoundRef.current = new Audio('/sounds/click.mp3');
    clickSoundRef.current.volume = 0.7;

    return () => {
      if (lockerSoundRef.current) {
        lockerSoundRef.current.pause();
        lockerSoundRef.current = null;
      }
      clickSoundRef.current = null;
    };
  }, []);

  // Reset state when secret code changes
  useEffect(() => {
    setCode([0, 0, 0]);
    setDialAngles([0, 0, 0]);
    setIsLocked(true);
    setDragIndex(null);
    setHasWon(false);
    setError("");
    setHintPlayed(false);
  }, [secretCode]);

  // Check if code is correct
  const isCodeCorrect = useCallback((currentCode) => {
    return currentCode.every((digit, i) => digit === secretCode[i]);
  }, [secretCode]);

  // Audio controls
  const startLockerSound = () => {
    if (lockerSoundRef.current?.paused) {
      lockerSoundRef.current.currentTime = 0;
      lockerSoundRef.current.play().catch(() => {});
    }
  };

  const stopLockerSound = () => {
    if (lockerSoundRef.current && !lockerSoundRef.current.paused) {
      lockerSoundRef.current.pause();
      lockerSoundRef.current.currentTime = 0;
    }
  };

  const playHintClick = () => {
    if (clickSoundRef.current) {
      clickSoundRef.current.currentTime = 0;
      clickSoundRef.current.play().catch(() => {});
    }
  };

  // Update code and check for hint
  const updateCode = useCallback((index, value) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError("");

    // Play hint sound when all correct
    if (isCodeCorrect(newCode) && !hintPlayed) {
      playHintClick();
      setHintPlayed(true);
    } else if (!isCodeCorrect(newCode)) {
      setHintPlayed(false);
    }
  }, [code, isCodeCorrect, hintPlayed]);

  // Dial sensitivity based on difficulty
  const sensitivity = useMemo(() => {
    const base = difficultyLower === 'easy' ? 1 : difficultyLower === 'hard' ? 1.6 : 1.3;
    return base + Math.min(0.6, (level - 1) * 0.05);
  }, [difficultyLower, level]);

  // Handle dial rotation
  const handleDialDrag = (e, index) => {
    if (dragIndex !== index) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    const degrees = (angle * 180 / Math.PI + 90 + 360) % 360;

    const newAngles = [...dialAngles];
    newAngles[index] = degrees;
    setDialAngles(newAngles);

    const digit = Math.round(((degrees / 360) * 9) * sensitivity) % 10;
    updateCode(index, digit);
  };

  const handleDragStart = (index) => {
    setDragIndex(index);
    startLockerSound();
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    stopLockerSound();
  };

  // Try code
  const handleTryCode = () => {
    if (hasWon) return;

    if (isCodeCorrect(code)) {
      setIsLocked(false);
      setError("");
      setHasWon(true);
      setTimeout(() => onSuccess?.(), 400);
    } else {
      setIsLocked(true);
      setError("Wrong code. Try again.");
      onFail?.();
    }
  };

  // Render hint based on difficulty
  const renderHint = () => {
    const [d1, d2, d3] = secretCode;
    const clamp = (n) => Math.min(9, Math.max(0, n));
    const fmtRange = (lo, hi) => lo === hi ? `${lo}` : `${lo}–${hi}`;

    const rangeAtLeastTwo = (digit, width) => {
      const d = clamp(digit);
      const lo = clamp(d - width);
      const hi = clamp(d + width);
      if (lo !== hi) return [lo, hi];
      if (d <= 0) return [0, 1];
      if (d >= 9) return [8, 9];
      return [d - 1, d + 1];
    };

    if (difficultyLower === 'easy') {
      const [r3lo, r3hi] = rangeAtLeastTwo(d3, 1);
      return (
        <p className="text-cyber-accent text-opacity-90 text-[10px] sm:text-xs font-semibold">
          Hint: Dial 1 = <span className="underline">{d1}</span>, Dial 2 = <span className="underline">{d2}</span>, Dial 3 = {fmtRange(r3lo, r3hi)}
        </p>
      );
    }

    if (difficultyLower === 'medium') {
      const [r1lo, r1hi] = rangeAtLeastTwo(d1, 1);
      const [r2lo, r2hi] = rangeAtLeastTwo(d2, 1);
      const [r3lo, r3hi] = rangeAtLeastTwo(d3, 1);
      return (
        <p className="text-cyber-accent text-opacity-80 text-[10px] sm:text-xs font-semibold">
          Hint: {fmtRange(r1lo, r1hi)}, {fmtRange(r2lo, r2hi)}, {fmtRange(r3lo, r3hi)}
        </p>
      );
    }

    // Hard
    const [r1lo, r1hi] = rangeAtLeastTwo(d1, 2);
    const [r2lo, r2hi] = rangeAtLeastTwo(d2, 2);
    const [r3lo, r3hi] = rangeAtLeastTwo(d3, 2);
    const parity = (n) => n % 2 === 0 ? 'even' : 'odd';
    return (
      <p className="text-cyber-accent text-opacity-75 text-[10px] sm:text-xs font-semibold">
        Hint: {fmtRange(r1lo, r1hi)} ({parity(d1)}), {fmtRange(r2lo, r2hi)} ({parity(d2)}), {fmtRange(r3lo, r3hi)} ({parity(d3)})
      </p>
    );
  };

  return (
    <div className="w-full flex flex-col">
      {/* Lock Status */}
      <div className="text-center mb-2">
        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 text-sm ${
          isLocked ? 'bg-red-500/20 text-red-300 border-red-500' : 'bg-green-500/20 text-green-300 border-green-500'
        }`}>
          {isLocked ? <Lock size={14} /> : <Unlock size={14} />}
          <span className="font-bold">{isLocked ? 'LOCKED' : 'UNLOCKED'}</span>
        </div>
      </div>

      {/* Sound Hint */}
      <div className="flex items-center justify-center gap-1.5 mb-2">
        <Volume2 size={14} className="text-cyber-warning" />
        <p className="text-cyber-warning text-[10px] sm:text-xs font-semibold">
          Listen for CLICK sound = correct code!
        </p>
      </div>

      {/* Hints */}
      <div className="text-center mb-2">
        <p className="text-white text-opacity-60 text-[10px] sm:text-xs mb-1">
          Rotate dials, listen for click, then TRY CODE
        </p>
        {renderHint()}
      </div>

      {/* Lock Interface */}
      <div className="bg-black bg-opacity-40 backdrop-blur-sm rounded-lg p-2 sm:p-3 border border-cyber-border">
        {/* Code Display */}
        <div className="flex justify-center gap-3 sm:gap-4 mb-3">
          {code.map((digit, index) => (
            <div key={index} className="text-center">
              <div className="w-12 h-14 sm:w-14 sm:h-16 bg-cyber-bg rounded-lg flex items-center justify-center border-2 border-cyber-border mb-1">
                <span className="text-2xl sm:text-3xl font-bold text-cyber-accent font-mono">{digit}</span>
              </div>
              <div className="text-[9px] sm:text-[10px] text-white text-opacity-50">Dial {index + 1}</div>
            </div>
          ))}
        </div>

        {/* Rotating Dials */}
        <div className="flex justify-center gap-3 sm:gap-4">
          {[0, 1, 2].map((index) => (
            <div key={index} className="relative">
              <div
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-cyber-bg to-black border-2 border-cyber-border cursor-grab active:cursor-grabbing shadow-lg"
                style={{ transform: `rotate(${dialAngles[index]}deg)` }}
                onMouseDown={() => handleDragStart(index)}
                onMouseMove={(e) => handleDialDrag(e, index)}
                onMouseUp={handleDragEnd}
                onMouseLeave={handleDragEnd}
                onTouchStart={() => handleDragStart(index)}
                onTouchMove={(e) => {
                  if (dragIndex !== index) return;
                  const touch = e.touches?.[0];
                  if (!touch) return;
                  handleDialDrag({ clientX: touch.clientX, clientY: touch.clientY, currentTarget: e.currentTarget }, index);
                }}
                onTouchEnd={handleDragEnd}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <RotateCw className="text-cyber-accent" size={14} />
                </div>
                <div className="absolute top-1 left-1/2 -translate-x-1/2 w-0.5 h-3 sm:h-4 bg-cyber-danger rounded-full" />
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
                  const angle = num * 36 - 90;
                  const radius = 26;
                  const x = Math.cos((angle * Math.PI) / 180) * radius;
                  const y = Math.sin((angle * Math.PI) / 180) * radius;
                  return (
                    <div
                      key={num}
                      className="absolute text-[8px] sm:text-[10px] font-bold text-white text-opacity-70"
                      style={{
                        left: `calc(50% + ${x}px)`,
                        top: `calc(50% + ${y}px)`,
                        transform: `translate(-50%, -50%) rotate(-${dialAngles[index]}deg)`,
                      }}
                    >
                      {num}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Try Button */}
        <div className="mt-3 flex flex-col items-center gap-1.5">
          <button
            type="button"
            onClick={handleTryCode}
            disabled={hasWon}
            className="px-5 py-2 rounded-lg bg-cyber-accent text-black font-bold text-sm shadow-md hover:bg-opacity-90 disabled:opacity-60"
          >
            {hasWon ? "UNLOCKED" : "TRY CODE"}
          </button>
          {error && <p className="text-cyber-danger text-[10px] sm:text-xs">{error}</p>}
        </div>
      </div>
    </div>
  );
}
