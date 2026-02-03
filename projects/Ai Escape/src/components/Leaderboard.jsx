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

  const shouldScroll = leaderboard.length > 5;

  return (
    <div
      className={`w-full max-w-full mx-auto overflow-x-hidden ${
        shouldScroll ? "max-h-[60vh] overflow-y-auto pr-1" : ""
      }`}
    >
      {!isGameFinished && (
        <div className="text-center mb-3 md:mb-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-cyber-accent glow-text mb-1 tracking-tight">
            LIVE LEADERBOARD
          </h2>
          <p className="text-xs md:text-sm text-white text-opacity-80 font-medium">
            Real-time Rankings
          </p>
        </div>
      )}

      <div className="space-y-2 md:space-y-3 w-full">
        {leaderboard.map((player, index) => {
          const rank = index + 1;
          const isTopThree = rank <= 3;

          return (
            <div
              key={player.id}
              className={`card border-2 transition-all duration-300 ${getRankClass(rank)} ${
                isTopThree ? "animate-pulse-slow" : ""
              } w-full max-w-full overflow-hidden rounded-xl`}
            >
              <div className="flex items-center justify-between gap-2 md:gap-3 w-full max-w-full overflow-hidden">
                {/* Rank and Icon */}
                <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0 overflow-hidden">
                  <div className="flex items-center justify-center w-10 h-10 md:w-14 md:h-14 flex-shrink-0">
                    {getRankIcon(rank)}
                  </div>

                  <div className="min-w-0 flex-1 overflow-hidden">
                    <h3 className="text-base md:text-lg lg:text-xl font-bold text-white mb-1 truncate">
                      {player.name}
                      {player.disqualified && (
                        <span className="text-red-400 ml-1.5 text-xs md:text-sm">(Disqualified)</span>
                      )}
                      {player.gaveUp && (
                        <span className="text-white/50 ml-1.5 text-xs md:text-sm">(Gave up)</span>
                      )}
                    </h3>
                    <p
                      className={`font-bold text-xs md:text-sm truncate ${
                        isTopThree
                          ? "text-cyber-accent"
                          : "text-white text-opacity-60"
                      }`}
                    >
                      {getRankLabel(rank)}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="text-right flex-shrink-0 ml-2">
                  <div className="text-lg md:text-2xl font-bold text-cyber-accent mb-1 leading-tight">
                    {player.completedLevels}
                  </div>
                  <div className="text-xs md:text-sm text-white text-opacity-70 mb-1 leading-tight">
                    Levels
                  </div>
                  <div className="text-xs md:text-sm text-white mb-1 leading-tight">
                    {formatTime(player.totalTime)}
                  </div>
                  {player.totalWrongAnswers !== undefined && (
                    <div className="text-xs text-white text-opacity-60 leading-tight">
                      {player.totalWrongAnswers || 0} wrong
                    </div>
                  )}
                </div>
              </div>

              {/* Winner Badge */}
              {rank === 1 && isGameFinished && (
                <div className="mt-2 md:mt-3 pt-2 md:pt-3 border-t border-yellow-400">
                  <p className="text-center text-sm md:text-base font-bold text-yellow-400 glow-text">
                    🏆 WINNER 🏆
                  </p>
                </div>
              )}
            </div>
          );
        })}

        {leaderboard.length === 0 && (
          <div className="card text-center py-6 md:py-8 rounded-xl">
            <p className="text-white text-opacity-60 text-sm md:text-base">No players yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
