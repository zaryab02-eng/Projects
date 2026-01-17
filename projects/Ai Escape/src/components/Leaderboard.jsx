import { Trophy, Medal, Award } from "lucide-react";
import { formatTime } from "../hooks/useGameState";

/**
 * Leaderboard component - shows player rankings
 */
export default function Leaderboard({ leaderboard, isAdmin, isGameFinished }) {
  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy className="text-yellow-400" size={32} />;
      case 2:
        return <Medal className="text-gray-300" size={28} />;
      case 3:
        return <Medal className="text-orange-400" size={24} />;
      default:
        return <Award className="text-gray-500" size={20} />;
    }
  };

  const getRankLabel = (rank) => {
    if (rank <= 3) return `${rank}${["st", "nd", "rd"][rank - 1]} Place`;
    return "Participant";
  };

  const getRankClass = (rank) => {
    switch (rank) {
      case 1:
        return "border-yellow-400 bg-yellow-400 bg-opacity-10 scale-105";
      case 2:
        return "border-gray-300 bg-gray-300 bg-opacity-10";
      case 3:
        return "border-orange-400 bg-orange-400 bg-opacity-10";
      default:
        return "border-cyber-border bg-cyber-surface";
    }
  };

  return (
    <div className="w-full max-w-full mx-auto overflow-x-hidden">
      {!isGameFinished && (
        <div className="text-center mb-2 md:mb-3">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-cyber-accent glow-text mb-1">
            LIVE LEADERBOARD
          </h2>
          <p className="text-xs md:text-sm text-white text-opacity-70">
            Real-time Rankings
          </p>
        </div>
      )}

      <div className="space-y-1.5 md:space-y-2 w-full">
        {leaderboard.map((player, index) => {
          const rank = index + 1;
          const isTopThree = rank <= 3;

          return (
            <div
              key={player.id}
              className={`card border-2 transition-all duration-300 ${getRankClass(rank)} ${
                isTopThree ? "animate-pulse-slow" : ""
              } w-full max-w-full overflow-hidden`}
            >
              <div className="flex items-center justify-between gap-1.5 md:gap-2 w-full max-w-full overflow-hidden">
                {/* Rank and Icon */}
                <div className="flex items-center gap-1.5 md:gap-2 flex-1 min-w-0 overflow-hidden">
                  <div className="flex items-center justify-center w-8 h-8 md:w-12 md:h-12 flex-shrink-0">
                    {getRankIcon(rank)}
                  </div>

                  <div className="min-w-0 flex-1 overflow-hidden">
                    <h3 className="text-sm md:text-base lg:text-lg font-bold text-white mb-0.5 truncate">
                      {player.name}
                    </h3>
                    <p
                      className={`font-bold text-xs truncate ${
                        isTopThree
                          ? "text-cyber-accent"
                          : "text-white text-opacity-50"
                      }`}
                    >
                      {getRankLabel(rank)}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="text-right flex-shrink-0 ml-1">
                  <div className="text-base md:text-xl font-bold text-cyber-accent mb-0.5 leading-tight">
                    {player.completedLevels}
                  </div>
                  <div className="text-xs text-white text-opacity-70 mb-0.5 leading-tight">
                    Levels
                  </div>
                  <div className="text-xs md:text-sm text-white leading-tight">
                    {formatTime(player.totalTime)}
                  </div>
                </div>
              </div>

              {/* Winner Badge */}
              {rank === 1 && isGameFinished && (
                <div className="mt-1.5 md:mt-2 pt-1.5 md:pt-2 border-t border-yellow-400">
                  <p className="text-center text-sm md:text-base font-bold text-yellow-400 glow-text">
                    🏆 WINNER 🏆
                  </p>
                </div>
              )}
            </div>
          );
        })}

        {leaderboard.length === 0 && (
          <div className="card text-center py-4 md:py-6">
            <p className="text-white text-opacity-50 text-sm md:text-base">No players yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
