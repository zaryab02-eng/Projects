import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGameState, formatTime } from "../hooks/useGameState";
import { getLeaderboard, endGame } from "../services/gameService";
import LobbyWaiting from "../components/LobbyWaiting";
import GameRoom from "../components/GameRoom";
import AdminPanel from "../components/AdminPanel";
import Leaderboard from "../components/Leaderboard";
import { Clock } from "lucide-react";

/**
 * Game Page - main game orchestrator
 * Handles waiting lobby, active gameplay, and results
 */
export default function GamePage() {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState("");
  const [playerId, setPlayerId] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const { roomData, loading, error, remainingTime } = useGameState(roomCode);

  useEffect(() => {
    // Restore session data
    const savedRoomCode = sessionStorage.getItem("roomCode");
    const savedPlayerId = sessionStorage.getItem("playerId");
    const savedPlayerName = sessionStorage.getItem("playerName");
    const savedIsAdmin = sessionStorage.getItem("isAdmin") === "true";
    const savedAdminName = sessionStorage.getItem("adminName");

    if (!savedRoomCode) {
      navigate("/");
      return;
    }

    setRoomCode(savedRoomCode);
    setIsAdmin(savedIsAdmin);

    if (savedIsAdmin) {
      setPlayerName(savedAdminName || "Admin");
    } else {
      if (!savedPlayerId || !savedPlayerName) {
        navigate("/");
        return;
      }
      setPlayerId(savedPlayerId);
      setPlayerName(savedPlayerName);
    }
  }, [navigate]);

  // Auto-end multiplayer game when all players complete all levels (admin only)
  useEffect(() => {
    if (
      isAdmin &&
      roomCode &&
      roomData?.status === "playing" &&
      roomData?.players &&
      roomData?.totalLevels
    ) {
      const players = roomData.players;
      const activePlayers = Object.values(players).filter(
        (p) => !p.disqualified
      );

      // Check if all active players have completed all levels
      const allPlayersCompleted =
        activePlayers.length > 0 &&
        activePlayers.every(
          (player) => (player.completedLevels || 0) >= roomData.totalLevels
        );

      if (allPlayersCompleted) {
        // Small delay to show completion state, then auto-end
        const timer = setTimeout(() => {
          endGame(roomCode);
        }, 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [
    isAdmin,
    roomCode,
    roomData?.status,
    roomData?.players,
    roomData?.totalLevels,
  ]);

  if (loading) {
    return (
      <div className="viewport-container flex items-center justify-center cyber-grid">
        <div className="card">
          <div className="text-center">
            <div
              className="animate-spin w-12 h-12 md:w-16 md:h-16 border-4 border-cyber-accent border-t-transparent 
                          rounded-full mx-auto mb-4"
            />
            <p className="text-base md:text-xl text-white">Loading game...</p>
          </div>
        </div>
      </div>
    );
  }

  // Only show error if loading is complete AND there's an actual error (not just initial null state)
  if (!loading && error && !roomData) {
    return (
      <div className="viewport-container flex items-center justify-center cyber-grid">
        <div className="card max-w-2xl mx-4">
          <div className="text-center">
            <h2 className="text-2xl md:text-4xl font-bold text-cyber-danger mb-4">
              ERROR
            </h2>
            <p className="text-base md:text-xl text-white mb-6">
              {error || "Room not found"}
            </p>
            <button
              onClick={() => {
                sessionStorage.clear();
                navigate("/");
              }}
              className="btn-primary text-sm md:text-base"
            >
              BACK TO HOME
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If still loading or no roomData yet, keep loading screen
  if (!roomData) {
    return (
      <div className="viewport-container flex items-center justify-center cyber-grid">
        <div className="card">
          <div className="text-center">
            <div
              className="animate-spin w-12 h-12 md:w-16 md:h-16 border-4 border-cyber-accent border-t-transparent 
                          rounded-full mx-auto mb-4"
            />
            <p className="text-base md:text-xl text-white">Loading game...</p>
          </div>
        </div>
      </div>
    );
  }

  // Waiting lobby
  if (roomData.status === "waiting") {
    return (
      <div className="viewport-container cyber-grid flex flex-col">
        <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full px-4 py-3 md:py-6 min-h-0">
          {/* Header - Fixed height */}
          <div className="text-center mb-3 md:mb-4 flex-shrink-0">
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-cyber-accent glow-text mb-1 md:mb-2">
              ESCAPE ROOM
            </h1>
            <p className="text-xs md:text-sm text-white text-opacity-70">
              {isAdmin ? "Admin Control Panel" : "Waiting for game to start"}
            </p>
          </div>

          {/* Content - Scrollable if needed, takes remaining space */}
          <div className="flex-1 min-h-0 flex flex-col md:grid md:grid-cols-2 gap-3 md:gap-4 overflow-hidden">
            {/* Lobby Waiting - Takes available space */}
            <div className="flex flex-col min-h-0 flex-1 md:flex-none">
              <LobbyWaiting
                roomData={roomData}
                playerId={playerId}
                isAdmin={isAdmin}
              />
            </div>

            {/* Admin Panel or Game Info */}
            {isAdmin && (
              <div className="flex flex-col min-h-0 flex-1 md:flex-none overflow-y-auto">
                <AdminPanel roomData={roomData} />
              </div>
            )}

            {!isAdmin && (
              <div className="card flex-shrink-0 md:flex-none md:overflow-y-auto">
                <h3 className="text-lg md:text-2xl font-bold text-white mb-2 md:mb-3">
                  GAME INFO
                </h3>

                {roomData.difficulty ? (
                  <div className="space-y-2">
                    <div className="bg-cyber-bg p-2 md:p-3 rounded-lg">
                      <p className="text-white text-opacity-70 text-xs md:text-sm">
                        Difficulty
                      </p>
                      <p className="text-cyber-accent font-bold text-base md:text-xl">
                        {roomData.difficulty}
                      </p>
                    </div>
                    <div className="bg-cyber-bg p-2 md:p-3 rounded-lg">
                      <p className="text-white text-opacity-70 text-xs md:text-sm">
                        Duration
                      </p>
                      <p className="text-cyber-accent font-bold text-base md:text-xl">
                        {roomData.duration} minutes
                      </p>
                    </div>
                    <div className="bg-cyber-bg p-2 md:p-3 rounded-lg">
                      <p className="text-white text-opacity-70 text-xs md:text-sm">
                        Total Levels
                      </p>
                      <p className="text-cyber-accent font-bold text-base md:text-xl">
                        {roomData.totalLevels}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-cyber-bg p-3 md:p-4 rounded-lg text-center">
                    <p className="text-xs md:text-sm text-white text-opacity-70">
                      Waiting for admin to configure game settings...
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Active game
  if (roomData.status === "playing") {
    if (isAdmin) {
      const leaderboard = getLeaderboard(roomData);

      return (
        <div className="viewport-container cyber-grid flex flex-col">
          <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full px-4 py-3 md:py-6 min-h-0">
            {/* Header - Fixed */}
            <div className="mb-3 md:mb-4 flex-shrink-0">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-cyber-accent glow-text">
                    ADMIN DASHBOARD
                  </h1>
                  <p className="text-xs md:text-sm text-white text-opacity-70">
                    Room: {roomCode}
                  </p>
                </div>

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
            </div>

            {/* Content - Scrollable if needed */}
            <div className="flex-1 min-h-0 grid md:grid-cols-3 gap-3 md:gap-4 overflow-hidden">
              <div className="md:col-span-2 flex flex-col min-h-0 overflow-y-auto">
                <Leaderboard
                  leaderboard={leaderboard}
                  isAdmin={true}
                  isGameFinished={false}
                />
              </div>

              <div className="flex flex-col min-h-0 overflow-y-auto">
                <AdminPanel roomData={roomData} />
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <GameRoom
        roomCode={roomCode}
        playerId={playerId}
        playerName={playerName}
        isAdmin={false}
      />
    );
  }

  // Game finished
  if (roomData.status === "finished") {
    const leaderboard = getLeaderboard(roomData);

    return (
      <div className="viewport-container cyber-grid flex flex-col overflow-hidden">
        <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full px-3 md:px-4 py-3 md:py-4 lg:py-6 min-h-0 overflow-hidden">
          {/* Header - Fixed height */}
          <div className="text-center mb-3 md:mb-4 lg:mb-6 flex-shrink-0">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-cyber-accent glow-text mb-1 md:mb-2">
              GAME COMPLETE
            </h1>
            <p className="text-xs md:text-sm text-white mb-0.5 md:mb-1">
              Room: {roomCode}
            </p>
            <p className="text-xs md:text-sm text-white text-opacity-70">
              Thank you for playing!
            </p>
          </div>

          {/* Main Content Grid - Improved desktop layout with proper overflow */}
          <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-2 md:gap-3 lg:gap-4 mb-3 md:mb-4 overflow-hidden">
            {/* Leaderboard - Takes 2/3 of desktop space */}
            <div className="lg:col-span-2 flex flex-col min-h-0 overflow-hidden">
              <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
                <Leaderboard
                  leaderboard={leaderboard}
                  isAdmin={isAdmin}
                  isGameFinished={true}
                />
              </div>
            </div>

            {/* Side Panel - Stats and Admin Actions */}
            <div className="lg:col-span-1 flex flex-col min-h-0 gap-3 md:gap-4">
              {/* Game Stats Card - Scrollable if needed */}
              <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
                <div className="card p-3 md:p-4 lg:p-5">
                  <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-3 md:mb-4">
                    GAME STATS
                  </h3>
                  <div className="space-y-2 md:space-y-3">
                    <div className="bg-cyber-bg p-2 md:p-3 rounded-lg">
                      <p className="text-white text-opacity-70 text-xs md:text-sm mb-0.5 md:mb-1">
                        Total Players
                      </p>
                      <p className="text-cyber-accent font-bold text-base md:text-lg lg:text-xl">
                        {roomData.players
                          ? Object.keys(roomData.players).length
                          : 0}
                      </p>
                    </div>
                    {roomData.difficulty && (
                      <div className="bg-cyber-bg p-2 md:p-3 rounded-lg">
                        <p className="text-white text-opacity-70 text-xs md:text-sm mb-0.5 md:mb-1">
                          Difficulty
                        </p>
                        <p className="text-cyber-accent font-bold text-base md:text-lg lg:text-xl">
                          {roomData.difficulty}
                        </p>
                      </div>
                    )}
                    {roomData.totalLevels && (
                      <div className="bg-cyber-bg p-2 md:p-3 rounded-lg">
                        <p className="text-white text-opacity-70 text-xs md:text-sm mb-0.5 md:mb-1">
                          Total Levels
                        </p>
                        <p className="text-cyber-accent font-bold text-base md:text-lg lg:text-xl">
                          {roomData.totalLevels}
                        </p>
                      </div>
                    )}
                    {roomData.duration && (
                      <div className="bg-cyber-bg p-2 md:p-3 rounded-lg">
                        <p className="text-white text-opacity-70 text-xs md:text-sm mb-0.5 md:mb-1">
                          Duration
                        </p>
                        <p className="text-cyber-accent font-bold text-base md:text-lg lg:text-xl">
                          {roomData.duration} minutes
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Admin Actions - Fixed, always visible */}
              {isAdmin && (
                <div className="flex-shrink-0">
                  <AdminPanel
                    roomData={roomData}
                    hidePlayerManagement={true}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Action Button - Fixed height */}
          <div className="flex-shrink-0 text-center pt-2">
            <button
              onClick={() => {
                sessionStorage.clear();
                navigate("/");
              }}
              className="btn-primary text-xs md:text-sm lg:text-base px-6 md:px-8 py-2 md:py-3"
            >
              BACK TO HOME
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
