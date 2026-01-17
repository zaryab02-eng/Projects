import { useState, useEffect } from "react";
import { Clock, AlertTriangle } from "lucide-react";
import { useGameState, formatTime } from "../hooks/useGameState";
import { useAntiCheat } from "../hooks/useAntiCheat";
import { getLeaderboard, endGame } from "../services/gameService";
import Question from "./Question";
import Cinematic from "./Cinematic";
import Leaderboard from "./Leaderboard";

/**
 * Game Room - main gameplay area for players
 */
export default function GameRoom({ roomCode, playerId, playerName, isAdmin }) {
  const { roomData, remainingTime } = useGameState(roomCode);
  const [showCinematic, setShowCinematic] = useState(false);
  const [completedLevel, setCompletedLevel] = useState(null);

  const isGameActive = roomData?.status === "playing";
  useAntiCheat(roomCode, playerId, isGameActive && !isAdmin);

  const player = roomData?.players?.[playerId];
  const currentQuestion = roomData?.questions?.[player?.currentLevel - 1];
  const leaderboard = roomData ? getLeaderboard(roomData) : [];

  // Auto-end game when timer expires (admin only)
  useEffect(() => {
    if (isAdmin && remainingTime === 0 && roomData?.status === "playing") {
      endGame(roomCode);
    }
  }, [remainingTime, isAdmin, roomData?.status, roomCode]);

  // Check if player is disqualified
  if (player?.disqualified) {
    return (
      <div className="viewport-container flex items-center justify-center cyber-grid">
        <div className="card max-w-2xl mx-4">
          <div className="text-center">
            <AlertTriangle
              className="text-cyber-danger mx-auto mb-4"
              size={48}
            />
            <h2 className="text-2xl md:text-4xl font-bold text-cyber-danger mb-4">
              DISQUALIFIED
            </h2>
            <p className="text-base md:text-xl text-white mb-4">
              You have been removed from the game due to rule violations.
            </p>
            <p className="text-sm md:text-base text-white text-opacity-70">
              Reason: Too many warnings (tab switching or other violations)
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show cinematic after level completion
  if (showCinematic && completedLevel) {
    return (
      <Cinematic
        levelNumber={completedLevel}
        playerName={playerName}
        onComplete={() => {
          setShowCinematic(false);
          setCompletedLevel(null);
        }}
      />
    );
  }

  const handleCorrectAnswer = () => {
    const levelJustCompleted = player.currentLevel;
    setCompletedLevel(levelJustCompleted);
    setShowCinematic(true);
  };

  // Game finished
  if (roomData?.status === "finished") {
    return (
      <div className="viewport-container cyber-grid overflow-y-auto">
        <div className="max-w-6xl mx-auto px-4 py-4 md:py-8">
          <div className="text-center mb-4 md:mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-cyber-accent glow-text mb-3 md:mb-4">
              GAME COMPLETE
            </h1>
            <p className="text-base md:text-xl text-white">Thank you for playing!</p>
          </div>

          <Leaderboard
            leaderboard={leaderboard}
            isAdmin={isAdmin}
            isGameFinished={true}
          />
        </div>
      </div>
    );
  }

  // Check if all levels completed
  const allLevelsCompleted = player?.completedLevels >= roomData?.totalLevels;

  return (
    <div className="viewport-container cyber-grid overflow-y-auto">
      <div className="max-w-6xl mx-auto px-4 py-4 md:py-8">
        {/* Header */}
        <div className="mb-4 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-cyber-accent glow-text">
                ESCAPE ROOM
              </h1>
              <p className="text-xs md:text-sm text-white text-opacity-70">
                Room: {roomCode} | Player: {playerName}
              </p>
            </div>

            {/* Timer */}
            <div className="bg-cyber-surface border-2 border-cyber-accent rounded-lg p-3 md:p-4">
              <div className="flex items-center gap-2">
                <Clock className="text-cyber-accent" size={20} />
                <div>
                  <div className="text-xs md:text-sm text-white text-opacity-70">
                    TIME LEFT
                  </div>
                  <div
                    className={`text-xl md:text-3xl font-bold ${
                      remainingTime < 60000
                        ? "text-cyber-danger animate-pulse"
                        : "text-cyber-accent"
                    }`}
                  >
                    {formatTime(remainingTime)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="bg-cyber-surface rounded-lg p-3 md:p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-bold text-sm md:text-base">
                Progress: {player?.completedLevels || 0} /{" "}
                {roomData?.totalLevels || 0} Levels
              </span>
              <span className="text-cyber-accent font-bold text-sm md:text-base">
                {Math.floor(
                  ((player?.completedLevels || 0) /
                    (roomData?.totalLevels || 1)) *
                    100,
                )}
                %
              </span>
            </div>
            <div className="w-full bg-cyber-bg rounded-full h-2 md:h-3 overflow-hidden">
              <div
                className="bg-cyber-accent h-full transition-all duration-500 rounded-full"
                style={{
                  width: `${((player?.completedLevels || 0) / (roomData?.totalLevels || 1)) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        {allLevelsCompleted ? (
          <div className="card text-center py-6 md:py-12">
            <h2 className="text-2xl md:text-4xl font-bold text-cyber-accent glow-text mb-3 md:mb-4">
              🎉 ALL LEVELS COMPLETE! 🎉
            </h2>
            <p className="text-base md:text-xl text-white mb-4 md:mb-8">
              Waiting for other players or timer to finish...
            </p>
            <div className="max-w-4xl mx-auto">
              <Leaderboard
                leaderboard={leaderboard}
                isAdmin={isAdmin}
                isGameFinished={false}
              />
            </div>
          </div>
        ) : currentQuestion ? (
          <Question
            roomCode={roomCode}
            playerId={playerId}
            question={currentQuestion}
            levelNumber={player?.currentLevel || 1}
            onCorrectAnswer={handleCorrectAnswer}
          />
        ) : (
          <div className="card text-center py-6 md:py-12">
            <p className="text-base md:text-xl text-white">Loading question...</p>
          </div>
        )}

        {/* Warnings */}
        {player?.warnings > 0 && (
          <div className="mt-4 md:mt-6 bg-cyber-warning bg-opacity-20 p-3 md:p-4 rounded-lg border border-cyber-warning">
            <p className="text-cyber-warning text-center font-bold text-sm md:text-base">
              ⚠️ WARNING: {player.warnings}/2 - One more violation and you will
              be disqualified!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
