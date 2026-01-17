import { Check, X, Users } from "lucide-react";
import { togglePlayerReady } from "../services/gameService";

/**
 * Lobby waiting room - shows before game starts
 */
export default function LobbyWaiting({ roomData, playerId, isAdmin }) {
  const players = Object.values(roomData.players || {});

  const handleToggleReady = async () => {
    if (!playerId) return;
    await togglePlayerReady(roomData.roomCode, playerId);
  };

  const currentPlayer = players.find((p) => p.id === playerId);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card fade-in">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-cyber-accent glow-text mb-2">
            WAITING LOBBY
          </h2>
          <p className="text-white text-opacity-70">
            Room Code:{" "}
            <span className="text-cyber-accent font-bold text-2xl">
              {roomData.roomCode}
            </span>
          </p>
          <p className="text-white text-opacity-50 mt-2">
            Share this code with other players to join
          </p>
        </div>

        {/* Players List */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Users className="text-cyber-accent" size={24} />
            <h3 className="text-2xl font-bold text-white">
              Players ({players.length}/5)
            </h3>
          </div>

          <div className="space-y-3">
            {players.map((player) => (
              <div
                key={player.id}
                className="bg-cyber-bg p-4 rounded-lg border-2 border-cyber-border 
                         hover:border-cyber-accent transition-all duration-300 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      player.ready ? "bg-cyber-accent" : "bg-gray-500"
                    }`}
                  />
                  <span className="text-xl text-white font-bold">
                    {player.name}
                  </span>
                  {player.id === playerId && (
                    <span className="text-cyber-accent text-sm">(You)</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {player.ready ? (
                    <div className="flex items-center gap-2 text-cyber-accent">
                      <Check size={20} />
                      <span className="font-bold">READY</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-gray-500">
                      <X size={20} />
                      <span>Not Ready</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Empty slots */}
            {[...Array(5 - players.length)].map((_, i) => (
              <div
                key={`empty-${i}`}
                className="bg-cyber-bg bg-opacity-30 p-4 rounded-lg border-2 border-dashed 
                         border-cyber-border flex items-center gap-3"
              >
                <div className="w-3 h-3 rounded-full bg-gray-700" />
                <span className="text-gray-500">Waiting for player...</span>
              </div>
            ))}
          </div>
        </div>

        {/* Ready Button (for players) */}
        {!isAdmin && currentPlayer && (
          <button
            onClick={handleToggleReady}
            className={`w-full py-4 rounded-lg font-bold text-xl transition-all duration-300 ${
              currentPlayer.ready
                ? "bg-cyber-danger text-white hover:bg-opacity-80"
                : "btn-primary"
            }`}
          >
            {currentPlayer.ready
              ? "✓ READY - Click to Cancel"
              : "MARK AS READY"}
          </button>
        )}

        {/* Admin Note */}
        {isAdmin && (
          <div className="bg-cyber-accent bg-opacity-10 p-4 rounded-lg border border-cyber-accent">
            <p className="text-cyber-accent text-center font-bold">
              🎮 You are the Admin. Configure game settings to start.
            </p>
          </div>
        )}

        {/* Player Note */}
        {!isAdmin && (
          <div className="bg-cyber-bg p-4 rounded-lg border border-cyber-border mt-4">
            <p className="text-white text-opacity-70 text-center">
              ⚠️ Wait for the admin to start the game
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
