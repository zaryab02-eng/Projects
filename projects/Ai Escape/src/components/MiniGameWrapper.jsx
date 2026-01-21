import { useState } from "react";
import { Gamepad2 } from "lucide-react";
import PatternMemoryGame from "./minigames/PatternMemoryGame";
import CodeLock from "./minigames/CodeLock";
import DragDropOrderPuzzle from "./minigames/DragDropOrderPuzzle";
import GreenFlashGame from "./minigames/GreenFlashGame";
import { submitMiniGameResult } from "../services/gameService";

/**
 * Mini Game Wrapper - Wraps mini-games with consistent styling and game logic
 * Compact UI designed to fit on one screen without scrolling
 * 
 * Props:
 * - roomCode: Room code
 * - playerId: Player ID
 * - gameType: Type of mini-game ('patternMemory', 'codeLock', 'dragDropOrder', 'greenFlash')
 * - levelNumber: Current level number
 * - difficulty: Game difficulty ('Easy', 'Medium', 'Hard')
 * - onCorrectAnswer: Callback when mini-game is completed successfully
 * - onWrongAnswer: Callback when mini-game fails
 */
export default function MiniGameWrapper({
  roomCode,
  playerId,
  gameType,
  levelNumber,
  difficulty,
  totalLevels,
  onCorrectAnswer,
  onWrongAnswer,
}) {
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Map difficulty to lowercase for mini-games
  const difficultyLower = difficulty?.toLowerCase() || "medium";

  // Sound effects function
  const playSound = (soundFile) => {
    try {
      const audio = new Audio(soundFile);
      audio.volume = 0.5;
      
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.log("Sound autoplay prevented:", err);
        });
      }
    } catch (err) {
      console.log("Sound initialization error:", err);
    }
  };

  // Handle mini-game success
  const handleSuccess = async () => {
    if (submitting) return;
    
    setSubmitting(true);
    setError("");

    try {
      const success = await submitMiniGameResult(
        roomCode,
        playerId,
        levelNumber,
        gameType,
        true
      );

      if (success) {
        playSound("/sounds/unlock.mp3");
        onCorrectAnswer(levelNumber);
      } else {
        setError("Error recording result. Please try again.");
        setSubmitting(false);
      }
    } catch (err) {
      setError("Error: " + err.message);
      setSubmitting(false);
    }
  };

  // Handle mini-game failure
  const handleFail = async () => {
    if (submitting) return;

    setSubmitting(true);
    setError("");

    try {
      await submitMiniGameResult(
        roomCode,
        playerId,
        levelNumber,
        gameType,
        false
      );

      playSound("/sounds/wrong.mp3");

      if (onWrongAnswer) {
        onWrongAnswer();
      }

      setError("❌ Failed! Try again!");
      
      setTimeout(() => {
        setSubmitting(false);
      }, 800);
    } catch (err) {
      setError("Error: " + err.message);
      setSubmitting(false);
    }
  };

  // Render the appropriate mini-game component
  const renderMiniGame = () => {
    const seed = `${roomCode || "room"}:${gameType || "game"}:L${levelNumber || 0}:T${totalLevels || 0}`;

    const commonProps = {
      difficulty: difficultyLower,
      levelNumber,
      totalLevels,
      seed,
      onSuccess: handleSuccess,
      onFail: handleFail,
    };

    switch (gameType) {
      case 'patternMemory':
        return <PatternMemoryGame {...commonProps} />;
      case 'codeLock':
        return <CodeLock {...commonProps} />;
      case 'dragDropOrder':
        return <DragDropOrderPuzzle {...commonProps} />;
      case 'greenFlash':
        return <GreenFlashGame {...commonProps} />;
      default:
        return <div className="text-white">Unknown mini-game type: {gameType}</div>;
    }
  };

  // Get game type display name
  const getGameTypeName = () => {
    switch (gameType) {
      case 'patternMemory': return 'Pattern Memory';
      case 'codeLock': return 'Code Lock';
      case 'dragDropOrder': return 'Sequence Order';
      case 'greenFlash': return 'Reaction Time';
      default: return 'Mini Game';
    }
  };

  return (
    <div className="max-w-lg mx-auto w-full">
      <div className="fade-in p-2 sm:p-3 md:p-4 bg-black bg-opacity-40 backdrop-blur-sm border border-cyber-border border-opacity-50 rounded-xl shadow-xl">
        {/* Level Header - Compact */}
        <div className="flex items-center justify-center gap-2 mb-2 sm:mb-3">
          <Gamepad2 className="text-cyber-accent" size={18} />
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-cyber-accent glow-text tracking-tight">
            LEVEL {levelNumber} • {getGameTypeName()}
          </h2>
        </div>

        {/* Mini Game Content - No extra padding to save space */}
        <div className="bg-black bg-opacity-20 backdrop-blur-sm p-2 sm:p-3 rounded-lg border-l-3 border-cyber-accent">
          {renderMiniGame()}
        </div>

        {/* Error message - Compact */}
        {error && (
          <div className="mt-2 py-1.5 px-2 bg-black bg-opacity-50 rounded-lg border border-cyber-danger">
            <p className="text-cyber-danger font-bold text-xs sm:text-sm text-center">
              {error}
            </p>
          </div>
        )}

        {/* Footer hint - Compact */}
        <p className="text-center text-white font-medium mt-2 text-[10px] sm:text-xs opacity-70">
          Complete to proceed to next level
        </p>
      </div>
    </div>
  );
}
