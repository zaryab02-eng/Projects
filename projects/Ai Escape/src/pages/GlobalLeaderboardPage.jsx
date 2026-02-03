import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Trophy,
  Medal,
  Award,
  ArrowLeft,
  Users,
  Clock,
  Target,
} from "lucide-react";
import {
  getGlobalLeaderboard,
  getLeaderboardCategories,
} from "../services/leaderboardService";
import { formatTime } from "../hooks/useGameState";
import { getCurrentUser } from "../services/authService";

/**
 * Global Leaderboard Page - Premium design
 * Mobile: Podium-style top 3 with list below
 * Desktop/Laptop: Two-column layout with category selector and stats on right
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
        userId,
      );

      setLeaderboardData(data);
    } catch (err) {
      setError(err.message || "Failed to load leaderboard");
    } finally {
      setLoading(false);
    }
  };

  const formatPlayerCount = (count) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  const top3Players = leaderboardData?.topPlayers.slice(0, 3) || [];
  const remainingPlayers = leaderboardData?.topPlayers.slice(3) || [];
  const currentUser = getCurrentUser();

  // Player data is either in topPlayers (if in top 20) or in playerData (if below top 20)
  const playerData =
    leaderboardData?.topPlayers.find((p) => p.userId === currentUser?.uid) ||
    leaderboardData?.playerData;

  // Calculate player rank: if in top 20, find index in topPlayers; otherwise use playerRank from API
  let playerRank = null;
  if (currentUser?.uid) {
    if (playerData && leaderboardData?.topPlayers) {
      const indexInTop = leaderboardData.topPlayers.findIndex(
        (p) => p.userId === currentUser.uid,
      );
      if (indexInTop >= 0) {
        playerRank = indexInTop + 1; // Rank is 1-based
      } else if (leaderboardData?.playerRank) {
        playerRank = leaderboardData.playerRank; // Player is below top 20
      }
    }
  }

  return (
    <div className="min-h-screen max-h-screen bg-[#0a0a0a] text-white overflow-hidden flex flex-col">
      {/* Header - Mobile & Desktop */}
      <div className="flex-shrink-0 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-[#1a1a1a] px-4 py-3 md:py-4">
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <h1 className="text-xl md:text-2xl font-bold text-[#00ff88]">
            LEADERBOARD
          </h1>
          <button
            onClick={() => navigate("/")}
            className="text-white/60 text-xs md:text-sm hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-[#1a1a1a]"
          >
            HOME
          </button>
        </div>

        {/* Mobile: Horizontal Category Selector */}
        <div className="md:hidden overflow-x-auto -mx-4 px-4 pb-2">
          <div className="flex gap-2 min-w-max">
            {categories.map((cat) => {
              const isSelected =
                selectedCategory?.difficulty === cat.difficulty &&
                selectedCategory?.totalLevels === cat.totalLevels;
              return (
                <button
                  key={`${cat.difficulty}-${cat.totalLevels}`}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    isSelected
                      ? "bg-[#00ff88] text-black shadow-lg shadow-[#00ff88]/30"
                      : "bg-[#1a1a1a] text-white/70 border border-[#2a2a2a]"
                  }`}
                >
                  {cat.difficulty}-{cat.totalLevels}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 pb-24 md:pb-6 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 md:py-24">
            <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-b-2 border-[#00ff88]"></div>
          </div>
        ) : error ? (
          <div className="bg-[#1a1a1a] border border-red-500/30 rounded-lg p-4 mt-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        ) : leaderboardData ? (
          <>
            {/* Mobile Layout - Podium + scrollable rankings list */}
            <div className="md:hidden flex flex-col h-full">
              {/* Total Players Count */}
              {leaderboardData.totalPlayers > 0 && (
                <div className="flex-shrink-0 text-center py-3 text-xs text-white/50">
                  {formatPlayerCount(leaderboardData.totalPlayers)} players
                  competing
                </div>
              )}

              {/* Podium - Top 3 */}
              {top3Players.length > 0 && (
                <div className="flex-shrink-0 mb-6">
                  <div className="flex items-end justify-center gap-2 px-2">
                    {/* 2nd Place */}
                    {top3Players[1] && (
                      <div className="flex-1 max-w-[100px]">
                        <div className="bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] rounded-t-lg border-t-2 border-[#c0c0c0] p-3 shadow-lg">
                          <div className="text-center mb-2">
                            <Medal
                              className="text-[#c0c0c0] mx-auto mb-1"
                              size={24}
                            />
                            <div className="text-[#c0c0c0] font-bold text-xs">
                              #2
                            </div>
                          </div>
                          <div className="text-white font-bold text-sm truncate mb-1">
                            {top3Players[1].displayName}
                          </div>
                          <div className="text-[#00ff88] font-semibold text-xs mb-1">
                            {formatTime(top3Players[1].totalTime)}
                          </div>
                          <div className="text-white/50 text-[10px]">
                            {top3Players[1].completedLevels}/
                            {top3Players[1].totalLevels} •{" "}
                            {top3Players[1].totalWrongAnswers || 0} wrong
                          </div>
                        </div>
                        <div className="bg-[#c0c0c0] h-16 rounded-b-lg"></div>
                      </div>
                    )}

                    {/* 1st Place */}
                    {top3Players[0] && (
                      <div className="flex-1 max-w-[120px]">
                        <div className="bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] rounded-t-lg border-t-2 border-[#ffd700] p-4 shadow-xl shadow-[#ffd700]/20">
                          <div className="text-center mb-2">
                            <Trophy
                              className="text-[#ffd700] mx-auto mb-1"
                              size={32}
                            />
                            <div className="text-[#ffd700] font-bold text-sm">
                              #1
                            </div>
                          </div>
                          <div className="text-white font-bold text-base truncate mb-1">
                            {top3Players[0].displayName}
                          </div>
                          <div className="text-[#00ff88] font-semibold text-sm mb-1">
                            {formatTime(top3Players[0].totalTime)}
                          </div>
                          <div className="text-white/50 text-[10px]">
                            {top3Players[0].completedLevels}/
                            {top3Players[0].totalLevels} •{" "}
                            {top3Players[0].totalWrongAnswers || 0} wrong
                          </div>
                        </div>
                        <div className="bg-[#ffd700] h-20 rounded-b-lg"></div>
                      </div>
                    )}

                    {/* 3rd Place */}
                    {top3Players[2] && (
                      <div className="flex-1 max-w-[100px]">
                        <div className="bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] rounded-t-lg border-t-2 border-[#cd7f32] p-3 shadow-lg">
                          <div className="text-center mb-2">
                            <Medal
                              className="text-[#cd7f32] mx-auto mb-1"
                              size={24}
                            />
                            <div className="text-[#cd7f32] font-bold text-xs">
                              #3
                            </div>
                          </div>
                          <div className="text-white font-bold text-sm truncate mb-1">
                            {top3Players[2].displayName}
                          </div>
                          <div className="text-[#00ff88] font-semibold text-xs mb-1">
                            {formatTime(top3Players[2].totalTime)}
                          </div>
                          <div className="text-white/50 text-[10px]">
                            {top3Players[2].completedLevels}/
                            {top3Players[2].totalLevels} •{" "}
                            {top3Players[2].totalWrongAnswers || 0} wrong
                          </div>
                        </div>
                        <div className="bg-[#cd7f32] h-12 rounded-b-lg"></div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Rank List #4-20 - scrollable list below podium on mobile */}
              {remainingPlayers.length > 0 && (
                <div className="flex-1 min-h-0 overflow-y-auto pr-1 pb-2 -webkit-overflow-scrolling-touch">
                  <div className="space-y-1.5">
                    {remainingPlayers.map((player, index) => {
                      const rank = index + 4;
                      const isCurrentUser =
                        currentUser && player.userId === currentUser.uid;
                      return (
                        <div
                          key={player.id}
                          className={`bg-[#1a1a1a] rounded-lg px-3 py-2.5 border ${
                            isCurrentUser
                              ? "border-[#00ff88]/50 bg-[#1a2a1a]"
                              : "border-[#2a2a2a]"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className="text-white/40 font-bold text-xs w-6">
                                #{rank}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="text-white font-semibold text-sm truncate">
                                  {player.displayName}
                                  {isCurrentUser && (
                                    <span className="text-[#00ff88] ml-1.5 text-xs">
                                      (You)
                                    </span>
                                  )}
                                </div>
                                <div className="text-white/40 text-[10px] mt-0.5">
                                  {player.completedLevels}/{player.totalLevels}{" "}
                                  levels
                                </div>
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <div className="text-[#00ff88] font-semibold text-xs">
                                {formatTime(player.totalTime)}
                              </div>
                              <div className="text-white/40 text-[10px] mt-0.5">
                                {player.totalWrongAnswers || 0} wrong
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Empty State */}
              {leaderboardData.topPlayers.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-white/50 text-sm">
                    No players yet. Be the first!
                  </p>
                </div>
              )}
            </div>

            {/* Desktop/Laptop Layout - Two Column */}
            <div className="hidden md:block max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                {/* Left Column: Leaderboard (2/3 width) */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Top 3 Players - Premium Cards */}
                  {top3Players.length > 0 && (
                    <div className="space-y-4">
                      <h2 className="text-lg font-semibold text-white/90 tracking-wide">
                        TOP 3
                      </h2>
                      <div className="grid grid-cols-3 gap-4">
                        {/* 1st Place */}
                        {top3Players[0] && (
                          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-xl border-2 border-[#ffd700]/40 p-5 shadow-xl shadow-[#ffd700]/10 hover:shadow-[#ffd700]/20 transition-all duration-300">
                            <div className="text-center mb-3">
                              <Trophy
                                className="text-[#ffd700] mx-auto mb-2"
                                size={32}
                              />
                              <div className="text-[#ffd700] font-bold text-lg mb-1">
                                #1
                              </div>
                            </div>
                            <div className="text-white font-bold text-base mb-2 truncate">
                              {top3Players[0].displayName}
                            </div>
                            <div className="space-y-1.5 text-xs">
                              <div className="flex items-center justify-between text-white/70">
                                <span>Time</span>
                                <span className="text-[#00ff88] font-semibold">
                                  {formatTime(top3Players[0].totalTime)}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-white/70">
                                <span>Levels</span>
                                <span className="text-white">
                                  {top3Players[0].completedLevels}/
                                  {top3Players[0].totalLevels}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-white/70">
                                <span>Wrong</span>
                                <span className="text-white">
                                  {top3Players[0].totalWrongAnswers || 0}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 2nd Place */}
                        {top3Players[1] && (
                          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-xl border-2 border-[#c0c0c0]/40 p-5 shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="text-center mb-3">
                              <Medal
                                className="text-[#c0c0c0] mx-auto mb-2"
                                size={28}
                              />
                              <div className="text-[#c0c0c0] font-bold text-base mb-1">
                                #2
                              </div>
                            </div>
                            <div className="text-white font-bold text-sm mb-2 truncate">
                              {top3Players[1].displayName}
                            </div>
                            <div className="space-y-1.5 text-xs">
                              <div className="flex items-center justify-between text-white/70">
                                <span>Time</span>
                                <span className="text-[#00ff88] font-semibold">
                                  {formatTime(top3Players[1].totalTime)}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-white/70">
                                <span>Levels</span>
                                <span className="text-white">
                                  {top3Players[1].completedLevels}/
                                  {top3Players[1].totalLevels}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-white/70">
                                <span>Wrong</span>
                                <span className="text-white">
                                  {top3Players[1].totalWrongAnswers || 0}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 3rd Place */}
                        {top3Players[2] && (
                          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-xl border-2 border-[#cd7f32]/40 p-5 shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="text-center mb-3">
                              <Medal
                                className="text-[#cd7f32] mx-auto mb-2"
                                size={28}
                              />
                              <div className="text-[#cd7f32] font-bold text-base mb-1">
                                #3
                              </div>
                            </div>
                            <div className="text-white font-bold text-sm mb-2 truncate">
                              {top3Players[2].displayName}
                            </div>
                            <div className="space-y-1.5 text-xs">
                              <div className="flex items-center justify-between text-white/70">
                                <span>Time</span>
                                <span className="text-[#00ff88] font-semibold">
                                  {formatTime(top3Players[2].totalTime)}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-white/70">
                                <span>Levels</span>
                                <span className="text-white">
                                  {top3Players[2].completedLevels}/
                                  {top3Players[2].totalLevels}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-white/70">
                                <span>Wrong</span>
                                <span className="text-white">
                                  {top3Players[2].totalWrongAnswers || 0}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Rank List #4-20 */}
                  {remainingPlayers.length > 0 && (
                    <div className="space-y-3">
                      <h2 className="text-lg font-semibold text-white/90 tracking-wide">
                        RANKINGS
                      </h2>
                      <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] overflow-hidden">
                        <div className="divide-y divide-[#2a2a2a]">
                          {remainingPlayers.map((player, index) => {
                            const rank = index + 4;
                            const isCurrentUser =
                              currentUser && player.userId === currentUser.uid;
                            return (
                              <div
                                key={player.id}
                                className={`px-5 py-4 hover:bg-[#1f1f1f] transition-colors ${
                                  isCurrentUser
                                    ? "bg-[#1a2a1a]/50 border-l-2 border-l-[#00ff88]"
                                    : ""
                                }`}
                              >
                                <div className="flex items-center justify-between gap-4">
                                  <div className="flex items-center gap-4 flex-1 min-w-0">
                                    <div className="text-white/40 font-bold text-sm w-8 flex-shrink-0">
                                      #{rank}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <div className="text-white font-semibold text-base truncate">
                                        {player.displayName}
                                        {isCurrentUser && (
                                          <span className="text-[#00ff88] ml-2 text-sm">
                                            (You)
                                          </span>
                                        )}
                                      </div>
                                      <div className="text-white/50 text-xs mt-0.5">
                                        {player.completedLevels}/
                                        {player.totalLevels} levels •{" "}
                                        {player.totalWrongAnswers || 0} wrong
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-right flex-shrink-0">
                                    <div className="text-[#00ff88] font-semibold text-base">
                                      {formatTime(player.totalTime)}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Empty State */}
                  {leaderboardData.topPlayers.length === 0 && (
                    <div className="text-center py-16">
                      <p className="text-white/50 text-base">
                        No players yet. Be the first!
                      </p>
                    </div>
                  )}
                </div>

                {/* Right Column: Category Selector + Stats (1/3 width) */}
                <div className="lg:col-span-1 space-y-6">
                  {/* Category Selector */}
                  <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] p-5">
                    <h3 className="text-base font-semibold text-white/90 mb-4 tracking-wide">
                      CATEGORY
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {categories.map((cat) => {
                        const isSelected =
                          selectedCategory?.difficulty === cat.difficulty &&
                          selectedCategory?.totalLevels === cat.totalLevels;
                        return (
                          <button
                            key={`${cat.difficulty}-${cat.totalLevels}`}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                              isSelected
                                ? "bg-[#00ff88] text-black shadow-md shadow-[#00ff88]/20"
                                : "bg-[#0f0f0f] text-white/70 border border-[#2a2a2a] hover:border-[#00ff88]/30"
                            }`}
                          >
                            {cat.difficulty}-{cat.totalLevels}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Player Stats */}
                  {playerData && (
                    <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] p-5">
                      <h3 className="text-base font-semibold text-white/90 mb-4 tracking-wide">
                        YOUR STATS
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <div className="text-white/60 text-xs mb-1">RANK</div>
                          <div className="text-[#00ff88] font-bold text-2xl">
                            #{playerRank || "—"}
                          </div>
                        </div>
                        <div className="space-y-3 pt-3 border-t border-[#2a2a2a]">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-white/70">
                              <Clock size={16} />
                              <span className="text-sm">Time</span>
                            </div>
                            <span className="text-white font-semibold text-sm">
                              {formatTime(playerData.totalTime)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-white/70">
                              <Target size={16} />
                              <span className="text-sm">Levels</span>
                            </div>
                            <span className="text-white font-semibold text-sm">
                              {playerData.completedLevels}/
                              {playerData.totalLevels}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-white/70">
                              <Users size={16} />
                              <span className="text-sm">Wrong</span>
                            </div>
                            <span className="text-white font-semibold text-sm">
                              {playerData.totalWrongAnswers || 0}
                            </span>
                          </div>
                        </div>
                        {leaderboardData.totalPlayers > 0 && (
                          <div className="pt-3 border-t border-[#2a2a2a]">
                            <div className="text-white/50 text-xs">
                              {formatPlayerCount(leaderboardData.totalPlayers)}{" "}
                              total players
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Your Rank Panel (if below top 20) */}
                  {playerRank && playerRank > 20 && playerData && (
                    <div className="bg-gradient-to-br from-[#1a2a1a] to-[#1a1a1a] rounded-xl border border-[#00ff88]/30 p-5 shadow-lg shadow-[#00ff88]/5">
                      <h3 className="text-base font-semibold text-[#00ff88] mb-3 tracking-wide">
                        YOUR RANK
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <div className="text-[#00ff88] font-bold text-3xl mb-1">
                            #{playerRank}
                          </div>
                          <div className="text-white/60 text-xs">
                            {playerData.completedLevels}/
                            {playerData.totalLevels} levels •{" "}
                            {playerData.totalWrongAnswers || 0} wrong
                          </div>
                        </div>
                        <div className="pt-3 border-t border-[#00ff88]/20">
                          <div className="text-white/70 text-xs mb-1">
                            Total Time
                          </div>
                          <div className="text-[#00ff88] font-bold text-xl">
                            {formatTime(playerData.totalTime)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>

      {/* Mobile: Sticky Your Rank Card (if below top 20) */}
      {playerRank && playerRank > 20 && playerData && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#0a0a0a] border-t border-[#00ff88]/30 shadow-lg shadow-[#00ff88]/10">
          <div className="px-4 py-3">
            <div className="bg-gradient-to-r from-[#1a2a1a] to-[#1a1a1a] rounded-lg border border-[#00ff88]/50 p-3">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="text-[#00ff88] text-xs font-medium mb-1">
                    YOUR RANK
                  </div>
                  <div className="text-white font-bold text-lg">
                    #{playerRank}
                  </div>
                  <div className="text-white/60 text-xs mt-1">
                    {playerData.completedLevels}/{playerData.totalLevels} levels
                    • {playerData.totalWrongAnswers || 0} wrong
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <div className="text-[#00ff88] font-bold text-lg">
                    {formatTime(playerData.totalTime)}
                  </div>
                  <div className="text-white/40 text-xs mt-0.5">Time</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
