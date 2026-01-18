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
    <div className="h-full flex flex-col min-h-0 overflow-hidden">
      <div className="card fade-in flex flex-col h-full min-h-0 flex-1 overflow-hidden">
        {/* Header - Fixed - Compact on mobile */}
        <div className="text-center mb-2 md:mb-3 flex-shrink-0">
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-cyber-accent glow-text mb-1">
            WAITING LOBBY
          </h2>
          <p className="text-xs md:text-sm text-white text-opacity-70">
            Room Code:{" "}
            <span className="text-cyber-accent font-bold text-sm md:text-base lg:text-xl">
              {roomData.roomCode}
            </span>
          </p>
          <p className="text-xs text-white text-opacity-50 mt-0.5 md:mt-1 hidden sm:block">
            Share this code with other players to join
          </p>
        </div>

        {/* Players List - Scrollable with proper flex */}
        <div className="flex-1 min-h-0 flex flex-col mb-2 md:mb-3 overflow-hidden">
          <div className="flex items-center gap-2 mb-2 flex-shrink-0">
            <Users className="text-cyber-accent" size={16} />
            <h3 className="text-sm md:text-base lg:text-lg font-bold text-white">
              Players ({players.length}/5)
            </h3>
          </div>

          {/* Scrollable container with max height */}
          <div
            className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden space-y-1.5 md:space-y-2 pr-1 
                          scrollbar-thin scrollbar-thumb-cyber-accent scrollbar-track-cyber-bg"
          >
            {players.map((player) => (
              <div
                key={player.id}
                className="bg-cyber-bg p-2 md:p-3 rounded-lg border-2 border-cyber-border 
                         hover:border-cyber-accent transition-all duration-300 flex items-center 
                         justify-between flex-shrink-0 min-h-[44px] md:min-h-[52px]"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0 overflow-hidden">
                  <div
                    className={`w-2 h-2 md:w-3 md:h-3 rounded-full flex-shrink-0 ${
                      player.ready ? "bg-cyber-accent" : "bg-gray-500"
                    }`}
                  />
                  <span className="text-xs sm:text-sm md:text-base text-white font-bold truncate">
                    {player.name}
                  </span>
                  {player.id === playerId && (
                    <span className="text-cyber-accent text-[10px] sm:text-xs flex-shrink-0">
                      (You)
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                  {player.ready ? (
                    <div className="flex items-center gap-1 text-cyber-accent">
                      <Check size={14} className="sm:hidden" />
                      <Check size={16} className="hidden sm:block md:hidden" />
                      <Check size={18} className="hidden md:block" />
                      <span className="font-bold text-[10px] sm:text-xs">
                        READY
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-gray-500">
                      <X size={14} className="sm:hidden" />
                      <X size={16} className="hidden sm:block md:hidden" />
                      <X size={18} className="hidden md:block" />
                      <span className="text-[10px] sm:text-xs">Not Ready</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Empty slots - Shows available slots */}
            {players.length < 5 && (
              <div
                className="bg-cyber-bg bg-opacity-20 p-2 rounded-lg border border-dashed 
                            border-cyber-border flex-shrink-0 min-h-[36px] flex items-center justify-center"
              >
                <p className="text-[10px] sm:text-xs text-white text-opacity-50 text-center">
                  {5 - players.length} slot{5 - players.length !== 1 ? "s" : ""}{" "}
                  available
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Ready Button (for players) - Fixed at bottom - Compact on mobile */}
        {!isAdmin && currentPlayer && (
          <button
            onClick={handleToggleReady}
            className={`w-full py-2 sm:py-2.5 md:py-3 rounded-lg font-bold text-xs sm:text-sm md:text-base 
                       transition-all duration-300 flex-shrink-0 ${
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

        {/* Admin Note - Fixed at bottom - Compact on mobile */}
        {isAdmin && (
          <div
            className="bg-cyber-accent bg-opacity-10 p-2 md:p-3 rounded-lg border border-cyber-accent 
                        flex-shrink-0 flex items-center justify-center min-h-[44px] md:min-h-[52px]"
          >
            <p className="text-cyber-accent text-center font-bold text-[10px] sm:text-xs md:text-sm">
              🎮 You are the Admin. Configure game settings and start when
              ready.
            </p>
          </div>
        )}

        {/* Player Note - Fixed at bottom - Compact on mobile */}
        {!isAdmin && (
          <div
            className="bg-cyber-bg p-2 md:p-3 rounded-lg border border-cyber-border 
                        flex-shrink-0 mt-1.5 md:mt-2 flex items-center justify-center min-h-[40px] md:min-h-[48px]"
          >
            <p className="text-white text-opacity-70 text-center text-[10px] sm:text-xs md:text-sm">
              ⚠️ Wait for the admin to start the game
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
