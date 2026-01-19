import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trophy, Medal, Award, ArrowLeft } from "lucide-react";
import { getGlobalLeaderboard, getLeaderboardCategories } from "../services/leaderboardService";
import { formatTime } from "../hooks/useGameState";
import { getCurrentUser } from "../services/authService";

/**
 * Global Leaderboard Page - Shows solo mode leaderboards
 */
export default function GlobalLeaderboardPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [leaderboardData, setLeaderboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const categories = getLeaderboardCategories();

  useEffect(() => {
    // Select first category by default
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0]);
    }
  }, [categories, selectedCategory]);

  useEffect(() => {
    if (selectedCategory) {
      loadLeaderboard();
    }
  }, [selectedCategory]);

  const loadLeaderboard = async () => {
    if (!selectedCategory) return;

    setLoading(true);
    setError("");

    try {
      const currentUser = getCurrentUser();
      const userId = currentUser?.uid || null;

      const data = await getGlobalLeaderboard(
        selectedCategory.difficulty,
        selectedCategory.totalLevels,
        userId
      );

      setLeaderboardData(data);
    } catch (err) {
      setError(err.message || "Failed to load leaderboard");
    } finally {
      setLoading(false);
    }
  };

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

  const getRankClass = (rank) => {
    switch (rank) {
      case 1:
        return "border-yellow-400 bg-yellow-400 bg-opacity-10";
      case 2:
        return "border-gray-300 bg-gray-300 bg-opacity-10";
      case 3:
        return "border-orange-400 bg-orange-400 bg-opacity-10";
      default:
        return "border-cyber-border bg-cyber-surface";
    }
  };

  return (
    <div className="viewport-container flex items-center justify-center cyber-grid overflow-y-auto">
      <div className="w-full max-w-4xl px-4 py-3 md:py-4">
        <div className="text-center mb-3 md:mb-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-cyber-accent glow-text mb-1 md:mb-2">
            GLOBAL LEADERBOARD
          </h1>
          <p className="text-xs md:text-sm text-white text-opacity-70">
            Solo Mode Rankings
          </p>
        </div>

        {/* Category Selection */}
        <div className="card fade-in p-4 md:p-5 mb-3 md:mb-4">
          <h2 className="text-lg md:text-xl font-bold text-white mb-3">SELECT CATEGORY</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
            {categories.map((cat) => (
              <button
                key={`${cat.difficulty}-${cat.totalLevels}`}
                onClick={() => setSelectedCategory(cat)}
                className={`p-2 md:p-3 rounded-lg border-2 transition-all ${
                  selectedCategory?.difficulty === cat.difficulty &&
                  selectedCategory?.totalLevels === cat.totalLevels
                    ? "border-cyber-accent bg-cyber-accent bg-opacity-20"
                    : "border-cyber-border bg-cyber-surface hover:border-cyber-accent"
                }`}
              >
                <div className="text-white font-bold text-xs md:text-sm">
                  {cat.difficulty}
                </div>
                <div className="text-cyber-accent text-xs">
                  {cat.totalLevels} Levels
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="card fade-in p-4 md:p-5">
          {loading ? (
            <div className="text-center py-8">
              <p className="text-white text-opacity-70">Loading leaderboard...</p>
            </div>
          ) : error ? (
            <div className="bg-cyber-danger bg-opacity-20 p-3 rounded-lg border border-cyber-danger">
              <p className="text-cyber-danger text-sm">{error}</p>
            </div>
          ) : leaderboardData ? (
            <>
              <div className="mb-3 md:mb-4">
                <h2 className="text-xl md:text-2xl font-bold text-cyber-accent mb-1">
                  {selectedCategory?.difficulty} - {selectedCategory?.totalLevels} Levels
                </h2>
                <p className="text-white text-opacity-60 text-xs md:text-sm">
                  Total Players: {leaderboardData.totalPlayers}
                </p>
              </div>

              {leaderboardData.topPlayers.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-white text-opacity-70">No players yet. Be the first!</p>
                </div>
              ) : (
                <div className="space-y-2 md:space-y-3">
                  {leaderboardData.topPlayers.map((player, index) => {
                    const rank = index + 1;
                    return (
                      <div
                        key={player.id}
                        className={`card border-2 ${getRankClass(rank)} transition-all`}
                      >
                        <div className="flex items-center justify-between gap-2 md:gap-3">
                          <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                            <div className="flex items-center justify-center w-8 h-8 md:w-12 md:h-12 flex-shrink-0">
                              {getRankIcon(rank)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="text-sm md:text-base lg:text-lg font-bold text-white truncate">
                                  {player.displayName}
                                </h3>
                                {rank <= 3 && (
                                  <span className="text-xs md:text-sm text-cyber-accent font-bold">
                                    #{rank}
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-white text-opacity-60">
                                {player.completedLevels} / {player.totalLevels} Levels
                              </div>
                            </div>
                          </div>

                          <div className="text-right flex-shrink-0">
                            <div className="text-base md:text-xl font-bold text-cyber-accent">
                              {formatTime(player.totalTime)}
                            </div>
                            <div className="text-xs text-white text-opacity-60">
                              {player.totalWrongAnswers || 0} wrong
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {leaderboardData.playerRank && leaderboardData.playerRank > 20 && (
                    <div className="mt-4 pt-4 border-t border-cyber-border">
                      <div className="bg-cyber-bg bg-opacity-50 p-3 md:p-4 rounded-lg border border-cyber-accent">
                        <p className="text-center text-cyber-accent font-bold text-sm md:text-base">
                          Your current rank: {leaderboardData.playerRank}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : null}
        </div>

        {/* Back Button */}
        <div className="mt-3 md:mt-4 text-center">
          <button
            onClick={() => navigate("/")}
            className="btn-secondary inline-flex items-center gap-2 text-xs md:text-sm py-2"
          >
            <ArrowLeft size={16} />
            BACK TO HOME
          </button>
        </div>
      </div>
    </div>
  );
}
