import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGameState, formatTime } from "../hooks/useGameState";
import { getLeaderboard } from "../services/gameService";
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center cyber-grid">
        <div className="card">
          <div className="text-center">
            <div
              className="animate-spin w-16 h-16 border-4 border-cyber-accent border-t-transparent 
                          rounded-full mx-auto mb-4"
            />
            <p className="text-xl text-white">Loading game...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !roomData) {
    return (
      <div className="min-h-screen flex items-center justify-center cyber-grid">
        <div className="card max-w-2xl">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-cyber-danger mb-4">ERROR</h2>
            <p className="text-xl text-white mb-6">
              {error || "Room not found"}
            </p>
            <button onClick={() => navigate("/")} className="btn-primary">
              BACK TO HOME
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Waiting lobby
  if (roomData.status === "waiting") {
    return (
      <div className="min-h-screen p-4 md:p-8 cyber-grid">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-cyber-accent glow-text mb-2">
              ESCAPE ROOM
            </h1>
            <p className="text-white text-opacity-70">
              {isAdmin ? "Admin Control Panel" : "Waiting for game to start"}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <LobbyWaiting
                roomData={roomData}
                playerId={playerId}
                isAdmin={isAdmin}
              />
            </div>

            {isAdmin && (
              <div>
                <AdminPanel roomData={roomData} />
              </div>
            )}

            {!isAdmin && (
              <div className="card">
                <h3 className="text-2xl font-bold text-white mb-4">
                  GAME INFO
                </h3>

                {roomData.difficulty ? (
                  <div className="space-y-3">
                    <div className="bg-cyber-bg p-3 rounded-lg">
                      <p className="text-white text-opacity-70 text-sm">
                        Difficulty
                      </p>
                      <p className="text-cyber-accent font-bold text-xl">
                        {roomData.difficulty}
                      </p>
                    </div>
                    <div className="bg-cyber-bg p-3 rounded-lg">
                      <p className="text-white text-opacity-70 text-sm">
                        Duration
                      </p>
                      <p className="text-cyber-accent font-bold text-xl">
                        {roomData.duration} minutes
                      </p>
                    </div>
                    <div className="bg-cyber-bg p-3 rounded-lg">
                      <p className="text-white text-opacity-70 text-sm">
                        Total Levels
                      </p>
                      <p className="text-cyber-accent font-bold text-xl">
                        {roomData.totalLevels}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-cyber-bg p-6 rounded-lg text-center">
                    <p className="text-white text-opacity-70">
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
        <div className="min-h-screen p-4 md:p-8 cyber-grid">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold text-cyber-accent glow-text">
                    ADMIN DASHBOARD
                  </h1>
                  <p className="text-white text-opacity-70">Room: {roomCode}</p>
                </div>

                <div className="bg-cyber-surface border-2 border-cyber-accent rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <Clock className="text-cyber-accent" size={24} />
                    <div>
                      <div className="text-sm text-white text-opacity-70">
                        TIME LEFT
                      </div>
                      <div
                        className={`text-3xl font-bold ${
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

            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Leaderboard
                  leaderboard={leaderboard}
                  isAdmin={true}
                  isGameFinished={false}
                />
              </div>

              <div>
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
      <div className="min-h-screen p-4 md:p-8 cyber-grid">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-6xl font-bold text-cyber-accent glow-text mb-4">
              GAME COMPLETE
            </h1>
            <p className="text-xl text-white mb-2">Room: {roomCode}</p>
            <p className="text-white text-opacity-70">Thank you for playing!</p>
          </div>

          <Leaderboard
            leaderboard={leaderboard}
            isAdmin={isAdmin}
            isGameFinished={true}
          />

          {isAdmin && (
            <div className="mt-8 text-center">
              <AdminPanel roomData={roomData} />
            </div>
          )}

          <div className="mt-8 text-center">
            <button
              onClick={() => {
                sessionStorage.clear();
                navigate("/");
              }}
              className="btn-primary"
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
