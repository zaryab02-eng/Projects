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
    <div className="h-full flex flex-col min-h-0">
      <div className="card fade-in flex flex-col h-full min-h-0 flex-1">
        {/* Header - Fixed */}
        <div className="text-center mb-2 md:mb-3 flex-shrink-0">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-cyber-accent glow-text mb-1 md:mb-2">
            WAITING LOBBY
          </h2>
          <p className="text-xs md:text-sm text-white text-opacity-70">
            Room Code:{" "}
            <span className="text-cyber-accent font-bold text-lg md:text-xl">
              {roomData.roomCode}
            </span>
          </p>
          <p className="text-xs text-white text-opacity-50 mt-1 hidden md:block">
            Share this code with other players to join
          </p>
        </div>

        {/* Players List - Scrollable */}
        <div className="flex-1 min-h-0 flex flex-col mb-2 md:mb-3">
          <div className="flex items-center gap-2 mb-2 flex-shrink-0">
            <Users className="text-cyber-accent" size={18} />
            <h3 className="text-base md:text-lg font-bold text-white">
              Players ({players.length}/5 max)
            </h3>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto space-y-1.5 md:space-y-2 pr-1">
            {players.map((player) => (
              <div
                key={player.id}
                className="bg-cyber-bg p-2 md:p-3 rounded-lg border-2 border-cyber-border 
                         hover:border-cyber-accent transition-all duration-300 flex items-center justify-between flex-shrink-0"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div
                    className={`w-2 h-2 md:w-3 md:h-3 rounded-full flex-shrink-0 ${
                      player.ready ? "bg-cyber-accent" : "bg-gray-500"
                    }`}
                  />
                  <span className="text-sm md:text-base text-white font-bold truncate">
                    {player.name}
                  </span>
                  {player.id === playerId && (
                    <span className="text-cyber-accent text-xs flex-shrink-0">(You)</span>
                  )}
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  {player.ready ? (
                    <div className="flex items-center gap-1 text-cyber-accent">
                      <Check size={14} className="md:hidden" />
                      <Check size={18} className="hidden md:block" />
                      <span className="font-bold text-xs">READY</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-gray-500">
                      <X size={14} className="md:hidden" />
                      <X size={18} className="hidden md:block" />
                      <span className="text-xs">Not Ready</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Empty slots - Optional, shows available slots */}
            {players.length < 5 && (
              <div className="bg-cyber-bg bg-opacity-20 p-2 rounded-lg border border-dashed border-cyber-border flex-shrink-0">
                <p className="text-xs text-white text-opacity-50 text-center">
                  {5 - players.length} slot{5 - players.length !== 1 ? 's' : ''} available
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Ready Button (for players) - Fixed */}
        {!isAdmin && currentPlayer && (
          <button
            onClick={handleToggleReady}
            className={`w-full py-2.5 md:py-3 rounded-lg font-bold text-sm md:text-base transition-all duration-300 flex-shrink-0 ${
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

        {/* Admin Note - Fixed */}
        {isAdmin && (
          <div className="bg-cyber-accent bg-opacity-10 p-2 md:p-3 rounded-lg border border-cyber-accent flex-shrink-0 mt-2">
            <p className="text-cyber-accent text-center font-bold text-xs">
              🎮 You are the Admin. Configure game settings and start when ready.
            </p>
          </div>
        )}

        {/* Player Note - Fixed */}
        {!isAdmin && (
          <div className="bg-cyber-bg p-2 md:p-3 rounded-lg border border-cyber-border flex-shrink-0 mt-2">
            <p className="text-white text-opacity-70 text-center text-xs">
              ⚠️ Wait for the admin to start the game
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
