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
        <div className="text-center mb-4 md:mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-cyber-accent glow-text mb-2">
            WAITING LOBBY
          </h2>
          <p className="text-sm md:text-base text-white text-opacity-70">
            Room Code:{" "}
            <span className="text-cyber-accent font-bold text-xl md:text-2xl">
              {roomData.roomCode}
            </span>
          </p>
          <p className="text-xs md:text-sm text-white text-opacity-50 mt-2">
            Share this code with other players to join
          </p>
        </div>

        {/* Players List */}
        <div className="mb-4 md:mb-8">
          <div className="flex items-center gap-2 mb-3 md:mb-4">
            <Users className="text-cyber-accent" size={20} />
            <h3 className="text-lg md:text-2xl font-bold text-white">
              Players ({players.length}/5 max)
            </h3>
          </div>

          <div className="space-y-2 md:space-y-3">
            {players.map((player) => (
              <div
                key={player.id}
                className="bg-cyber-bg p-3 md:p-4 rounded-lg border-2 border-cyber-border 
                         hover:border-cyber-accent transition-all duration-300 flex items-center justify-between"
              >
                <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                  <div
                    className={`w-2 h-2 md:w-3 md:h-3 rounded-full flex-shrink-0 ${
                      player.ready ? "bg-cyber-accent" : "bg-gray-500"
                    }`}
                  />
                  <span className="text-base md:text-xl text-white font-bold truncate">
                    {player.name}
                  </span>
                  {player.id === playerId && (
                    <span className="text-cyber-accent text-xs md:text-sm flex-shrink-0">(You)</span>
                  )}
                </div>

                <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
                  {player.ready ? (
                    <div className="flex items-center gap-1 md:gap-2 text-cyber-accent">
                      <Check size={16} className="md:hidden" />
                      <Check size={20} className="hidden md:block" />
                      <span className="font-bold text-xs md:text-sm">READY</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 md:gap-2 text-gray-500">
                      <X size={16} className="md:hidden" />
                      <X size={20} className="hidden md:block" />
                      <span className="text-xs md:text-sm">Not Ready</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Empty slots - Optional, shows available slots */}
            {players.length < 5 && (
              <div className="bg-cyber-bg bg-opacity-20 p-2 md:p-3 rounded-lg border border-dashed border-cyber-border">
                <p className="text-xs md:text-sm text-white text-opacity-50 text-center">
                  {5 - players.length} slot{5 - players.length !== 1 ? 's' : ''} available (optional - game can start with current players)
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Ready Button (for players) */}
        {!isAdmin && currentPlayer && (
          <button
            onClick={handleToggleReady}
            className={`w-full py-3 md:py-4 rounded-lg font-bold text-base md:text-xl transition-all duration-300 ${
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
          <div className="bg-cyber-accent bg-opacity-10 p-3 md:p-4 rounded-lg border border-cyber-accent">
            <p className="text-cyber-accent text-center font-bold text-xs md:text-sm">
              🎮 You are the Admin. Configure game settings and start when ready (works with any number of players, up to 5 max).
            </p>
          </div>
        )}

        {/* Player Note */}
        {!isAdmin && (
          <div className="bg-cyber-bg p-3 md:p-4 rounded-lg border border-cyber-border mt-3 md:mt-4">
            <p className="text-white text-opacity-70 text-center text-xs md:text-sm">
              ⚠️ Wait for the admin to start the game
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
