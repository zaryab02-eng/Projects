import { useState } from "react";
import { Settings, Play, StopCircle, UserX, Download } from "lucide-react";
import {
  setGameConfig,
  startGame,
  endGame,
  disqualifyPlayer,
  exportResultsCSV,
} from "../services/gameService";

/**
 * Admin Panel - game configuration and controls
 */
export default function AdminPanel({ roomData }) {
  // 🔧 CHANGE DEFAULT GAME SETTINGS HERE
  const [difficulty, setDifficulty] = useState("Medium");
  const [duration, setDuration] = useState(30); // in minutes
  const [totalLevels, setTotalLevels] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const players = Object.values(roomData.players || {});
  const isConfigSet =
    roomData.difficulty && roomData.duration && roomData.totalLevels;
  const canStartGame = isConfigSet && players.length > 0;

  const handleSetConfig = async () => {
    setLoading(true);
    setError("");

    try {
      await setGameConfig(roomData.roomCode, difficulty, duration, totalLevels);
      alert("✓ Game configuration saved!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStartGame = async () => {
    if (!canStartGame) {
      alert("Please set game configuration and wait for at least one player");
      return;
    }

    if (!confirm("Start the game now? All players will begin immediately.")) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      await startGame(roomData.roomCode);
    } catch (err) {
      setError(err.message);
      alert("Error starting game: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEndGame = async () => {
    if (!confirm("End the game now? This will finalize all results.")) {
      return;
    }

    setLoading(true);
    try {
      await endGame(roomData.roomCode);
    } catch (err) {
      alert("Error ending game: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDisqualifyPlayer = async (playerId, playerName) => {
    if (!confirm(`Disqualify ${playerName}? This action cannot be undone.`)) {
      return;
    }

    try {
      await disqualifyPlayer(roomData.roomCode, playerId);
      alert(`${playerName} has been disqualified`);
    } catch (err) {
      alert("Error disqualifying player: " + err.message);
    }
  };

  const handleExportResults = () => {
    const csv = exportResultsCSV(roomData);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `escape-room-results-${roomData.roomCode}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Game Configuration */}
      {roomData.status === "waiting" && (
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <Settings className="text-cyber-accent" size={32} />
            <h2 className="text-3xl font-bold text-cyber-accent">
              GAME CONFIGURATION
            </h2>
          </div>

          <div className="space-y-4">
            {/* Difficulty */}
            <div>
              <label className="block text-white font-bold mb-2">
                DIFFICULTY LEVEL
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="input"
                disabled={loading}
              >
                <option value="Easy">Easy - Simple riddles</option>
                <option value="Medium">Medium - Logic puzzles</option>
                <option value="Hard">Hard - Complex challenges</option>
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-white font-bold mb-2">
                GAME DURATION (minutes)
              </label>
              <input
                type="number"
                min="5"
                max="120"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="input"
                disabled={loading}
              />
              <p className="text-white text-opacity-50 text-sm mt-1">
                Recommended: 15-45 minutes
              </p>
            </div>

            {/* Total Levels */}
            <div>
              <label className="block text-white font-bold mb-2">
                TOTAL LEVELS
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={totalLevels}
                onChange={(e) => setTotalLevels(parseInt(e.target.value))}
                className="input"
                disabled={loading}
              />
              <p className="text-white text-opacity-50 text-sm mt-1">
                Number of questions/levels in the game
              </p>
            </div>

            {error && (
              <div className="bg-cyber-danger bg-opacity-20 p-4 rounded-lg border border-cyber-danger">
                <p className="text-cyber-danger">{error}</p>
              </div>
            )}

            <button
              onClick={handleSetConfig}
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading
                ? "SAVING..."
                : isConfigSet
                  ? "✓ UPDATE CONFIGURATION"
                  : "SAVE CONFIGURATION"}
            </button>
          </div>
        </div>
      )}

      {/* Game Controls */}
      <div className="card">
        <h3 className="text-2xl font-bold text-white mb-4">GAME CONTROLS</h3>

        <div className="space-y-3">
          {roomData.status === "waiting" && (
            <button
              onClick={handleStartGame}
              disabled={!canStartGame || loading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 
                       disabled:cursor-not-allowed"
            >
              <Play size={20} />
              START GAME
            </button>
          )}

          {roomData.status === "playing" && (
            <button
              onClick={handleEndGame}
              disabled={loading}
              className="btn-danger w-full flex items-center justify-center gap-2"
            >
              <StopCircle size={20} />
              END GAME NOW
            </button>
          )}

          {roomData.status === "finished" && (
            <button
              onClick={handleExportResults}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <Download size={20} />
              EXPORT RESULTS (CSV)
            </button>
          )}
        </div>

        {!canStartGame && roomData.status === "waiting" && (
          <p className="text-cyber-warning text-center mt-4">
            {!isConfigSet
              ? "⚠️ Set game configuration first"
              : "⚠️ Waiting for players to join"}
          </p>
        )}
      </div>

      {/* Player Management */}
      {players.length > 0 && (
        <div className="card">
          <h3 className="text-2xl font-bold text-white mb-4">
            PLAYER MANAGEMENT
          </h3>

          <div className="space-y-2">
            {players.map((player) => (
              <div
                key={player.id}
                className="bg-cyber-bg p-3 rounded-lg flex items-center justify-between"
              >
                <div>
                  <span className="text-white font-bold">{player.name}</span>
                  {player.disqualified && (
                    <span className="ml-2 text-cyber-danger text-sm">
                      DISQUALIFIED
                    </span>
                  )}
                  {player.warnings > 0 && (
                    <span className="ml-2 text-cyber-warning text-sm">
                      ⚠️ {player.warnings} warning(s)
                    </span>
                  )}
                </div>

                {!player.disqualified && roomData.status === "playing" && (
                  <button
                    onClick={() =>
                      handleDisqualifyPlayer(player.id, player.name)
                    }
                    className="px-3 py-1 bg-cyber-danger text-white rounded hover:bg-opacity-80 
                             transition-all duration-300 flex items-center gap-1"
                  >
                    <UserX size={16} />
                    Disqualify
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
