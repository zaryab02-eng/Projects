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
export default function AdminPanel({ roomData, hidePlayerManagement = false }) {
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

    if (
      !confirm(
        `Start the game now with ${players.length} player${players.length !== 1 ? "s" : ""}? The game will begin immediately.`,
      )
    ) {
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
    <div className="space-y-3 md:space-y-4 w-full">
      {/* Game Configuration */}
      {roomData.status === "waiting" && (
        <div className="card">
          <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
            <Settings className="text-cyber-accent" size={24} />
            <h2 className="text-xl md:text-3xl font-bold text-cyber-accent">
              GAME CONFIGURATION
            </h2>
          </div>

          <div className="space-y-3 md:space-y-4">
            {/* Difficulty */}
            <div>
              <label className="block text-white font-bold mb-2 text-sm md:text-base">
                DIFFICULTY LEVEL
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="input text-lg"
                disabled={loading}
              >
                <option value="Easy">Easy - Simple riddles</option>
                <option value="Medium">Medium - Logic puzzles</option>
                <option value="Hard">Hard - Complex challenges</option>
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-white font-bold mb-2 text-sm md:text-base">
                GAME DURATION (minutes)
              </label>
              <input
                type="number"
                min="5"
                max="120"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="input text-lg"
                disabled={loading}
              />
              <p className="text-white text-opacity-50 text-xs md:text-sm mt-1">
                Recommended: 15-45 minutes
              </p>
            </div>

            {/* Total Levels */}
            <div>
              <label className="block text-white font-bold mb-2 text-sm md:text-base">
                TOTAL LEVELS
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={totalLevels}
                onChange={(e) => setTotalLevels(parseInt(e.target.value))}
                className="input text-lg"
                disabled={loading}
              />
              <p className="text-white text-opacity-50 text-xs md:text-sm mt-1">
                Number of questions/levels in the game
              </p>
            </div>

            {error && (
              <div className="bg-cyber-danger bg-opacity-20 p-3 md:p-4 rounded-lg border border-cyber-danger">
                <p className="text-cyber-danger text-sm md:text-base">
                  {error}
                </p>
              </div>
            )}

            <button
              onClick={handleSetConfig}
              disabled={loading}
              className="btn-primary w-full text-sm md:text-base"
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
      {roomData.status !== "finished" && (
        <div className="card">
          <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">
            GAME CONTROLS
          </h3>

          <div className="space-y-2 md:space-y-3">
            {roomData.status === "waiting" && (
              <button
                onClick={handleStartGame}
                disabled={!canStartGame || loading}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 
                         disabled:cursor-not-allowed text-sm md:text-base"
              >
                <Play size={18} />
                START GAME
              </button>
            )}

            {roomData.status === "playing" && (
              <button
                onClick={handleEndGame}
                disabled={loading}
                className="btn-danger w-full flex items-center justify-center gap-2 text-sm md:text-base"
              >
                <StopCircle size={18} />
                END GAME NOW
              </button>
            )}
          </div>

          {!canStartGame && roomData.status === "waiting" && (
            <p className="text-cyber-warning text-center mt-3 md:mt-4 text-xs md:text-sm">
              {!isConfigSet
                ? "⚠️ Set game configuration first"
                : "⚠️ At least one player must join to start"}
            </p>
          )}

          {canStartGame && roomData.status === "waiting" && (
            <p className="text-cyber-accent text-center mt-3 md:mt-4 text-xs md:text-sm">
              ✓ Ready to start! Game can begin with {players.length} player
              {players.length !== 1 ? "s" : ""} (up to 5 max)
            </p>
          )}
        </div>
      )}

      {/* Export Results - Only shown on finished page */}
      {roomData.status === "finished" && (
        <div className="card">
          <h3 className="text-lg md:text-xl font-bold text-white mb-3">
            ADMIN ACTIONS
          </h3>
          <button
            onClick={handleExportResults}
            className="btn-primary w-full flex items-center justify-center gap-2 text-sm md:text-base"
          >
            <Download size={18} />
            EXPORT RESULTS (CSV)
          </button>
        </div>
      )}

      {/* Player Management - Hidden when hidePlayerManagement is true */}
      {!hidePlayerManagement && players.length > 0 && (
        <div className="card w-full max-w-full overflow-hidden">
          <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">
            PLAYER MANAGEMENT
          </h3>

          <div className="space-y-2 max-w-full overflow-hidden">
            {players.map((player) => (
              <div
                key={player.id}
                className="bg-cyber-bg p-2 md:p-3 rounded-lg flex items-center justify-between gap-2 max-w-full overflow-hidden"
              >
                <div className="min-w-0 flex-1 overflow-hidden">
                  <span className="text-white font-bold text-sm md:text-base truncate block">
                    {player.name}
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {player.disqualified && (
                      <span className="text-cyber-danger text-xs md:text-sm">
                        DISQUALIFIED
                      </span>
                    )}
                    {player.warnings > 0 && (
                      <span className="text-cyber-warning text-xs md:text-sm">
                        ⚠️ {player.warnings} warning(s)
                      </span>
                    )}
                  </div>
                </div>

                {!player.disqualified && roomData.status === "playing" && (
                  <button
                    onClick={() =>
                      handleDisqualifyPlayer(player.id, player.name)
                    }
                    className="px-2 md:px-3 py-1 bg-cyber-danger text-white rounded hover:bg-opacity-80 
                             transition-all duration-300 flex items-center gap-1 text-xs md:text-sm flex-shrink-0"
                  >
                    <UserX size={14} />
                    <span className="hidden sm:inline">Disqualify</span>
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
