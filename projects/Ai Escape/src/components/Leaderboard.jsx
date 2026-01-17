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
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-cyber-accent glow-text mb-2">
          {isGameFinished ? "FINAL RESULTS" : "LIVE LEADERBOARD"}
        </h2>
        <p className="text-white text-opacity-70">
          {isGameFinished ? "Game Complete!" : "Real-time Rankings"}
        </p>
      </div>

      <div className="space-y-4">
        {leaderboard.map((player, index) => {
          const rank = index + 1;
          const isTopThree = rank <= 3;

          return (
            <div
              key={player.id}
              className={`card border-2 transition-all duration-300 ${getRankClass(rank)} ${
                isTopThree ? "animate-pulse-slow" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                {/* Rank and Icon */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-16 h-16">
                    {getRankIcon(rank)}
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">
                      {player.name}
                    </h3>
                    <p
                      className={`font-bold ${
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
                <div className="text-right">
                  <div className="text-3xl font-bold text-cyber-accent mb-1">
                    {player.completedLevels}
                  </div>
                  <div className="text-sm text-white text-opacity-70 mb-2">
                    Levels Completed
                  </div>
                  <div className="text-lg text-white">
                    ⏱️ {formatTime(player.totalTime)}
                  </div>
                </div>
              </div>

              {/* Winner Badge */}
              {rank === 1 && isGameFinished && (
                <div className="mt-4 pt-4 border-t border-yellow-400">
                  <p className="text-center text-2xl font-bold text-yellow-400 glow-text">
                    🏆 WINNER 🏆
                  </p>
                </div>
              )}
            </div>
          );
        })}

        {leaderboard.length === 0 && (
          <div className="card text-center py-12">
            <p className="text-white text-opacity-50 text-xl">No players yet</p>
          </div>
        )}
      </div>

      {isAdmin && isGameFinished && (
        <div className="mt-8 text-center">
          <p className="text-white text-opacity-70 mb-4">
            Results have been finalized
          </p>
        </div>
      )}
    </div>
  );
}
