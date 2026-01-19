import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, AlertTriangle, Pencil, X, Check, LogOut, Flag } from "lucide-react";
import { useGameState, formatTime } from "../hooks/useGameState";
import { useAntiCheat } from "../hooks/useAntiCheat";
import { useTabVisibility } from "../hooks/useTabVisibility";
import { getLeaderboard, endGame, updatePlayerNameInRoom } from "../services/gameService";
import { submitSoloResult, getGlobalLeaderboard, updateSoloDisplayNameEverywhere } from "../services/leaderboardService";
import { signOutUser } from "../services/authService";
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
  const [rankInfo, setRankInfo] = useState(null);
  const isSolo = sessionStorage.getItem("isSolo") === "true";
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(playerName || "");
  const [renameLoading, setRenameLoading] = useState(false);
  const [renameError, setRenameError] = useState("");

  // NEW: State for wrong answer video
  const [showWrongVideo, setShowWrongVideo] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const backgroundVideoRef = useRef(null);
  const wrongVideoRef = useRef(null);

  const isGameActive = roomData?.status === "playing";
  useAntiCheat(roomCode, playerId, isGameActive && !isAdmin);

  const player = roomData?.players?.[playerId];
  const currentQuestion = roomData?.questions?.[player?.currentLevel - 1];
  const leaderboard = roomData ? getLeaderboard(roomData) : [];
  const playerRank = leaderboard.findIndex((p) => p.id === playerId) + 1 || 0;
  const effectivePlayerName = player?.name || playerName;

  const handleSaveName = async () => {
    const soloUserId = sessionStorage.getItem("soloUserId");
    const trimmed = (nameDraft || "").trim();
    if (!isSolo || !soloUserId) return;
    if (!trimmed) {
      setRenameError("Name cannot be empty");
      return;
    }

    setRenameLoading(true);
    setRenameError("");
    try {
      // Persist locally for next time
      localStorage.setItem(`solo_displayName_${soloUserId}`, trimmed);

      // Update current room player name (so in-room UI/leaderboard updates immediately)
      await updatePlayerNameInRoom(roomCode, playerId, trimmed);

      // Update global solo leaderboards + global player profile
      await updateSoloDisplayNameEverywhere(soloUserId, trimmed);

      // Keep session name consistent for any later submissions in this run
      sessionStorage.setItem("playerName", trimmed);

      setIsEditingName(false);
    } catch (err) {
      setRenameError(err.message || "Failed to update name");
    } finally {
      setRenameLoading(false);
    }
  };

  const handleSignOut = async () => {
    // Solo-only sign out: end the room (best-effort), clear state, sign out, go home
    try {
      if (isSolo) {
        await endGame(roomCode);
      }
    } catch (err) {
      // Non-blocking
      console.error("Error ending game during sign out:", err);
    }

    try {
      sessionStorage.clear();
      await signOutUser();
    } catch (err) {
      console.error("Error signing out:", err);
    } finally {
      navigate("/");
    }
  };

  const handleGiveUp = async () => {
    if (!isSolo || !isGameActive || !player) return;

    const confirmed = window.confirm(
      "Are you sure you want to give up? Your current progress will be saved to the leaderboard."
    );
    if (!confirmed) return;

    const soloUserId = sessionStorage.getItem("soloUserId");
    const soloDifficulty = sessionStorage.getItem("soloDifficulty");
    const soloTotalLevels = parseInt(sessionStorage.getItem("soloTotalLevels") || "5");

    if (soloUserId && soloDifficulty) {
      try {
        // Submit current progress to leaderboard
        await submitSoloResult(
          soloUserId,
          effectivePlayerName,
          soloDifficulty,
          soloTotalLevels,
          player.completedLevels || 0,
          player.totalTime || 0,
          player.totalWrongAnswers || 0
        );
      } catch (err) {
        console.error("Error submitting to leaderboard:", err);
      }
    }

    // End the game
    try {
      await endGame(roomCode);
    } catch (err) {
      console.error("Error ending game:", err);
    }

    sessionStorage.clear();
    navigate("/");
  };

  // Solo mode: Tab visibility detection with grace timer
  const handleTabLeave = async () => {
    if (isSolo && isGameActive && player) {
      // Submit current progress to leaderboard before terminating
      const soloUserId = sessionStorage.getItem("soloUserId");
      const soloDifficulty = sessionStorage.getItem("soloDifficulty");
      const soloTotalLevels = parseInt(sessionStorage.getItem("soloTotalLevels") || "5");

      if (soloUserId && soloDifficulty) {
        try {
          await submitSoloResult(
            soloUserId,
            effectivePlayerName,
            soloDifficulty,
            soloTotalLevels,
            player.completedLevels || 0,
            player.totalTime || 0,
            player.totalWrongAnswers || 0
          );
        } catch (err) {
          console.error("Error submitting to leaderboard:", err);
        }
      }

      // Terminate solo game if player leaves tab/app
      try {
        await endGame(roomCode);
      } catch (err) {
        console.error("Error ending game:", err);
      }
      
      sessionStorage.clear();
      navigate("/");
      alert("Game terminated: You left the tab/app during solo mode.");
    }
  };

  // Solo mode: immediate termination (no grace period)
  useTabVisibility(handleTabLeave, isSolo ? 0 : 7500);

  // Submit solo result to global leaderboard when game finishes and compute rank change
  useEffect(() => {
    if (!(isSolo && roomData?.status === "finished" && player)) return;

    const soloUserId = sessionStorage.getItem("soloUserId");
    const difficulty = roomData?.difficulty;
    const totalLevels = roomData?.totalLevels;

    if (!soloUserId || !difficulty || !totalLevels) return;

    const computeRank = (data) => {
      if (!data) return null;
      const inTop = data.topPlayers.findIndex((p) => p.userId === soloUserId);
      if (inTop >= 0) return inTop + 1;
      if (data.playerRank) return data.playerRank;
      return null;
    };

    const syncLeaderboard = async () => {
      try {
        const before = await getGlobalLeaderboard(difficulty, totalLevels, soloUserId);
        const rankBefore = computeRank(before);

        await submitSoloResult(
          soloUserId,
          effectivePlayerName,
          difficulty,
          totalLevels,
          player.completedLevels || 0,
          player.totalTime || 0,
          player.totalWrongAnswers || 0
        );

        const after = await getGlobalLeaderboard(difficulty, totalLevels, soloUserId);
        const rankAfter = computeRank(after);

        setRankInfo({
          before: rankBefore,
          after: rankAfter,
          totalPlayers: after?.totalPlayers || null,
        });
      } catch (err) {
        console.error("Error syncing leaderboard:", err);
      }
    };

    syncLeaderboard();
  }, [isSolo, roomData?.status, player, effectivePlayerName, roomData?.difficulty, roomData?.totalLevels]);

  // Initialize background video for Safari
  useEffect(() => {
    if (backgroundVideoRef.current) {
      // Try to play background video
      backgroundVideoRef.current.play().catch((err) => {
        console.log("Background video autoplay prevented (normal on Safari):", err);
        // Will try again after user interaction
      });
    }
  }, []);

  // Preload wrong answer video to prevent freeze on first play
  useEffect(() => {
    if (wrongVideoRef.current) {
      wrongVideoRef.current.load(); // Force preload
    }
  }, []);

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

  // NEW: Handle wrong answer video playback - Safari-safe with preload check
  const handleWrongAnswer = () => {
    setShowWrongVideo(true);

    // Pause background video
    if (backgroundVideoRef.current) {
      backgroundVideoRef.current.pause();
    }

    // Play wrong answer video - Safari-safe with readyState check
    if (wrongVideoRef.current) {
      // Ensure video is loaded before playing
      if (wrongVideoRef.current.readyState < 2) {
        wrongVideoRef.current.load();
      }
      
      wrongVideoRef.current.currentTime = 0;
      
      // Wait for video to be ready if needed
      const playVideo = () => {
        if (wrongVideoRef.current) {
          wrongVideoRef.current.play().catch((err) => {
            console.log("Wrong video play prevented:", err);
            handleWrongVideoEnd();
          });
        }
      };

      if (wrongVideoRef.current.readyState >= 2) {
        playVideo();
      } else {
        wrongVideoRef.current.addEventListener('canplay', playVideo, { once: true });
      }
    }
  };

  // NEW: Handle when wrong answer video ends
  const handleWrongVideoEnd = () => {
    setShowWrongVideo(false);

    // Resume background video - Safari-safe
    if (backgroundVideoRef.current) {
      backgroundVideoRef.current.play().catch((err) => {
        console.log("Background video resume prevented:", err);
        // App continues even if video fails
      });
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
        playerName={effectivePlayerName}
        totalLevels={totalLevels}
        isSolo={isSolo}
        rankInfo={rankInfo}
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
        <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full px-3 md:px-4 py-3 md:py-4 min-h-0">
          <div className="text-center mb-2 md:mb-3 flex-shrink-0">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-cyber-accent glow-text mb-1 md:mb-2">
              GAME COMPLETE
            </h1>
            <p className="text-xs md:text-sm text-white">
              Thank you for playing!
            </p>
            {rankInfo && (
              <div className="mt-2 text-sm md:text-base text-cyber-accent font-bold">
                {rankInfo.totalPlayers && rankInfo.totalPlayers <= 1 ? (
                  <>You are #1</>
                ) : rankInfo.before && rankInfo.after && rankInfo.before !== rankInfo.after ? (
                  <>You jumped from #{rankInfo.before} to #{rankInfo.after}!</>
                ) : rankInfo.after ? (
                  <>Your rank: #{rankInfo.after}</>
                ) : (
                  <>Ranking will update shortly...</>
                )}
              </div>
            )}
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
      {/* 🎬 Background Video - Safari-safe with error handling */}
      <video
        ref={backgroundVideoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        disableRemotePlayback
        controlsList="nodownload nofullscreen noremoteplayback"
        className="fixed inset-0 w-full h-full object-cover opacity-100 -z-10 pointer-events-none"
        onContextMenu={(e) => e.preventDefault()}
        style={{ 
          display: showWrongVideo ? "none" : "block",
          opacity: videoError ? 0 : 1 
        }}
        onError={(e) => {
          console.error("Background video failed to load:", e);
          setVideoError(true);
          // App continues even if video fails - don't crash!
        }}
        onLoadedData={() => {
          console.log("Background video loaded successfully");
          setVideoError(false);
        }}
      >
        <source src="/videos/background.mp4" type="video/mp4" />
      </video>

      {/* ❌ Wrong Answer Video - Safari-safe with error handling, always rendered for preload */}
      <video
        ref={wrongVideoRef}
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        disableRemotePlayback
        controlsList="nodownload nofullscreen noremoteplayback"
        className={`fixed inset-0 w-full h-full object-cover opacity-100 -z-10 pointer-events-none ${
          showWrongVideo ? "" : "hidden"
        }`}
        onContextMenu={(e) => e.preventDefault()}
        onEnded={handleWrongVideoEnd}
        onError={(e) => {
          console.error("Wrong video failed to load:", e);
          // If wrong video fails, just skip it
          handleWrongVideoEnd();
        }}
      >
        <source src="/videos/wrong.mp4" type="video/mp4" />
      </video>

      <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full px-4 py-3 md:py-6 min-h-0 relative z-0">
        {/* Header - Fixed */}
        <div className="mb-3 md:mb-4 flex-shrink-0">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-cyber-accent glow-text">
                ESCAPE ROOM
              </h1>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-xs text-white text-opacity-70">
                  Room: {roomCode} | Player: {player?.name || playerName}
                </p>
                {isSolo && !isAdmin && (
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="inline-flex items-center gap-1.5 px-2 py-1 bg-cyber-surface border border-cyber-border rounded-lg hover:border-cyber-accent transition-all duration-300 text-[10px]"
                    title="Sign out"
                  >
                    <LogOut size={12} />
                    SIGN OUT
                  </button>
                )}
              </div>
              {renameError && (
                <p className="text-[10px] text-cyber-danger mt-1">{renameError}</p>
              )}
            </div>

            {/* Timer and Give Up Button */}
            <div className="flex items-center gap-2 md:gap-3">
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
              {isSolo && !isAdmin && isGameActive && (
                <button
                  type="button"
                  onClick={handleGiveUp}
                  className="inline-flex items-center gap-1.5 px-2.5 md:px-3 py-1.5 md:py-2 bg-cyber-danger bg-opacity-20 border border-cyber-danger rounded-lg hover:bg-opacity-30 transition-all duration-300 text-[10px] md:text-xs"
                  title="Give up and save current progress"
                >
                  <Flag size={12} />
                  GIVE UP
                </button>
              )}
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
