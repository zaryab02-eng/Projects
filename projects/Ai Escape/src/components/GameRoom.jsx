import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const { roomData, remainingTime } = useGameState(roomCode);
  const [showCinematic, setShowCinematic] = useState(false);
  const [completedLevel, setCompletedLevel] = useState(null);
  const isSolo = sessionStorage.getItem("isSolo") === "true";

  // NEW: State for wrong answer video
  const [showWrongVideo, setShowWrongVideo] = useState(false);
  const backgroundVideoRef = useRef(null);
  const wrongVideoRef = useRef(null);

  const isGameActive = roomData?.status === "playing";
  useAntiCheat(roomCode, playerId, isGameActive && !isAdmin);

  const player = roomData?.players?.[playerId];
  const currentQuestion = roomData?.questions?.[player?.currentLevel - 1];
  const leaderboard = roomData ? getLeaderboard(roomData) : [];
  const playerRank = leaderboard.findIndex((p) => p.id === playerId) + 1 || 0;

  // Auto-end game when timer expires (admin only)
  useEffect(() => {
    if (isAdmin && remainingTime === 0 && roomData?.status === "playing") {
      endGame(roomCode);
    }
  }, [remainingTime, isAdmin, roomData?.status, roomCode]);

  // Auto-hide cinematic when final level finishes and status changes to "finished"
  const totalLevels = roomData?.totalLevels || 0;
  const isFinalLevel =
    showCinematic && completedLevel && completedLevel >= totalLevels;

  useEffect(() => {
    if (isFinalLevel && roomData?.status === "finished") {
      setShowCinematic(false);
      setCompletedLevel(null);
    }
  }, [isFinalLevel, roomData?.status]);

  // NEW: Handle wrong answer video playback
  const handleWrongAnswer = () => {
    setShowWrongVideo(true);

    // Pause background video
    if (backgroundVideoRef.current) {
      backgroundVideoRef.current.pause();
    }

    // Play wrong answer video
    if (wrongVideoRef.current) {
      wrongVideoRef.current.currentTime = 0;
      wrongVideoRef.current.play();
    }
  };

  // NEW: Handle when wrong answer video ends
  const handleWrongVideoEnd = () => {
    setShowWrongVideo(false);

    // Resume background video
    if (backgroundVideoRef.current) {
      backgroundVideoRef.current.play();
    }
  };

  // Show cinematic after level completion
  if (
    showCinematic &&
    completedLevel &&
    !(isFinalLevel && roomData?.status === "finished")
  ) {
    return (
      <Cinematic
        levelNumber={completedLevel}
        playerName={playerName}
        totalLevels={totalLevels}
        isSolo={isSolo}
        onComplete={() => {
          const totalLevelsValue = roomData?.totalLevels || 0;
          const isFinal = completedLevel >= totalLevelsValue;

          if (isFinal && roomData?.status === "playing") {
            endGame(roomCode)
              .then(() => {
                setTimeout(() => {
                  setShowCinematic(false);
                  setCompletedLevel(null);
                }, 100);
              })
              .catch((err) => {
                console.error("Error ending game:", err);
                setTimeout(() => {
                  setShowCinematic(false);
                  setCompletedLevel(null);
                }, 1500);
              });

            setTimeout(() => {
              setShowCinematic(false);
              setCompletedLevel(null);
            }, 1500);
          } else {
            setShowCinematic(false);
            setCompletedLevel(null);
          }
        }}
      />
    );
  }

  const handleCorrectAnswer = (completedLevelNumber) => {
    setCompletedLevel(completedLevelNumber);
    setShowCinematic(true);
  };

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

  // Game finished
  if (roomData?.status === "finished") {
    return (
      <div className="viewport-container cyber-grid flex flex-col overflow-x-hidden">
        <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full px-3 md:px-4 py-3 md:py-4 min-h-0 max-w-full">
          <div className="text-center mb-2 md:mb-3 flex-shrink-0">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-cyber-accent glow-text mb-1 md:mb-2">
              GAME COMPLETE
            </h1>
            <p className="text-xs md:text-sm text-white">
              Thank you for playing!
            </p>
          </div>

          <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-2 md:gap-3 mb-2 md:mb-3 overflow-hidden max-w-full">
            <div className="lg:col-span-2 flex flex-col min-h-0 overflow-y-auto overflow-x-hidden">
              <Leaderboard
                leaderboard={leaderboard}
                isAdmin={isAdmin}
                isGameFinished={true}
              />
            </div>

            <div className="flex flex-col gap-2 md:gap-3 min-h-0 overflow-y-auto overflow-x-hidden">
              <div className="card flex-shrink-0 p-3 md:p-4">
                <h3 className="text-base md:text-lg font-bold text-white mb-2 md:mb-3">
                  YOUR STATS
                </h3>
                <div className="space-y-1.5 md:space-y-2">
                  {player && (
                    <>
                      <div className="bg-cyber-bg p-2 rounded-lg">
                        <p className="text-white text-opacity-70 text-xs mb-0.5">
                          Levels Completed
                        </p>
                        <p className="text-cyber-accent font-bold text-sm md:text-base">
                          {player.completedLevels} /{" "}
                          {roomData?.totalLevels || 0}
                        </p>
                      </div>
                      <div className="bg-cyber-bg p-2 rounded-lg">
                        <p className="text-white text-opacity-70 text-xs mb-0.5">
                          Total Time
                        </p>
                        <p className="text-cyber-accent font-bold text-sm md:text-base">
                          {formatTime(player.totalTime)}
                        </p>
                      </div>
                      <div className="bg-cyber-bg p-2 rounded-lg">
                        <p className="text-white text-opacity-70 text-xs mb-0.5">
                          Rank
                        </p>
                        <p className="text-cyber-accent font-bold text-sm md:text-base">
                          #{playerRank > 0 ? playerRank : "N/A"}
                        </p>
                      </div>
                    </>
                  )}
                  {roomData?.difficulty && (
                    <div className="bg-cyber-bg p-2 rounded-lg">
                      <p className="text-white text-opacity-70 text-xs mb-0.5">
                        Difficulty
                      </p>
                      <p className="text-cyber-accent font-bold text-sm md:text-base">
                        {roomData.difficulty}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 text-center">
            <button
              onClick={() => {
                sessionStorage.clear();
                navigate("/");
              }}
              className="btn-primary text-xs md:text-sm py-2"
            >
              BACK TO HOME
            </button>
          </div>
        </div>
      </div>
    );
  }

  const allLevelsCompleted = player?.completedLevels >= roomData?.totalLevels;

  return (
    <div className="viewport-container cyber-grid flex flex-col relative">
      {/* 🎬 Background Video - Plays throughout the game */}
      <video
        ref={backgroundVideoRef}
        autoPlay
        loop
        muted
        playsInline
        disablePictureInPicture
        disableRemotePlayback
        controlsList="nodownload nofullscreen noremoteplayback"
        className="fixed inset-0 w-full h-full object-cover opacity-100 -z-10 pointer-events-none"
        onContextMenu={(e) => e.preventDefault()}
        style={{ display: showWrongVideo ? "none" : "block" }}
      >
        <source src="/videos/background.mp4" type="video/mp4" />
      </video>

      {/* ❌ Wrong Answer Video - Plays when wrong answer is submitted */}
      {showWrongVideo && (
        <video
          ref={wrongVideoRef}
          autoPlay
          muted
          playsInline
          disablePictureInPicture
          disableRemotePlayback
          controlsList="nodownload nofullscreen noremoteplayback"
          className="fixed inset-0 w-full h-full object-cover opacity-100 -z-10 pointer-events-none"
          onContextMenu={(e) => e.preventDefault()}
          onEnded={handleWrongVideoEnd}
        >
          <source src="/videos/wrong.mp4" type="video/mp4" />
        </video>
      )}

      <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full px-4 py-3 md:py-6 min-h-0 relative z-0">
        {/* Header - Fixed */}
        <div className="mb-3 md:mb-4 flex-shrink-0">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-cyber-accent glow-text">
                ESCAPE ROOM
              </h1>
              <p className="text-xs text-white text-opacity-70">
                Room: {roomCode} | Player: {playerName}
              </p>
            </div>

            {/* Timer */}
            <div className="bg-cyber-surface border-2 border-cyber-accent rounded-lg p-2 md:p-3 flex-shrink-0">
              <div className="flex items-center gap-2">
                <Clock className="text-cyber-accent" size={18} />
                <div>
                  <div className="text-xs text-white text-opacity-70">
                    TIME LEFT
                  </div>
                  <div
                    className={`text-lg md:text-2xl font-bold ${
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

          {/* Progress - Fixed */}
          <div className="bg-cyber-surface rounded-lg p-2 md:p-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-white font-bold text-xs md:text-sm">
                Progress: {player?.completedLevels || 0} /{" "}
                {roomData?.totalLevels || 0} Levels
              </span>
              <span className="text-cyber-accent font-bold text-xs md:text-sm">
                {Math.floor(
                  ((player?.completedLevels || 0) /
                    (roomData?.totalLevels || 1)) *
                    100,
                )}
                %
              </span>
            </div>
            <div className="w-full bg-cyber-bg rounded-full h-2 overflow-hidden">
              <div
                className="bg-cyber-accent h-full transition-all duration-500 rounded-full"
                style={{
                  width: `${((player?.completedLevels || 0) / (roomData?.totalLevels || 1)) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Main Content - Scrollable if needed */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          {allLevelsCompleted ? (
            <div className="card text-center py-4 md:py-6">
              <h2 className="text-xl md:text-3xl font-bold text-cyber-accent glow-text mb-2 md:mb-3">
                🎉 ALL LEVELS COMPLETE! 🎉
              </h2>
              {isSolo ? (
                <>
                  <p className="text-sm md:text-base text-white mb-3 md:mb-4">
                    Congratulations! You've completed all levels!
                  </p>
                  <div className="max-w-4xl mx-auto mb-4">
                    <Leaderboard
                      leaderboard={leaderboard}
                      isAdmin={isAdmin}
                      isGameFinished={false}
                    />
                  </div>
                  <button
                    onClick={() => {
                      endGame(roomCode);
                      setTimeout(() => {
                        sessionStorage.clear();
                        navigate("/");
                      }, 500);
                    }}
                    className="btn-primary text-sm md:text-base mt-4"
                  >
                    COMPLETE & GO HOME
                  </button>
                </>
              ) : (
                <>
                  <p className="text-sm md:text-base text-white mb-3 md:mb-4">
                    Waiting for other players or timer to finish...
                  </p>
                  <div className="max-w-4xl mx-auto">
                    <Leaderboard
                      leaderboard={leaderboard}
                      isAdmin={isAdmin}
                      isGameFinished={false}
                    />
                  </div>
                </>
              )}
            </div>
          ) : currentQuestion ? (
            <Question
              roomCode={roomCode}
              playerId={playerId}
              question={currentQuestion}
              levelNumber={player?.currentLevel || 1}
              onCorrectAnswer={handleCorrectAnswer}
              onWrongAnswer={handleWrongAnswer}
            />
          ) : (
            <div className="card text-center py-6 md:py-8">
              <p className="text-sm md:text-base text-white">
                Loading question...
              </p>
            </div>
          )}
        </div>

        {/* Warnings - Fixed */}
        {player?.warnings > 0 && (
          <div className="mt-2 bg-cyber-warning bg-opacity-20 p-2 md:p-3 rounded-lg border border-cyber-warning flex-shrink-0">
            <p className="text-cyber-warning text-center font-bold text-xs md:text-sm">
              ⚠️ WARNING: {player.warnings}/2 - One more violation and you will
              be disqualified!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
