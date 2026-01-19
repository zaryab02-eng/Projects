import { Medal, Trophy } from "lucide-react";
import { formatTime } from "../hooks/useGameState";

/**
 * Multiplayer leaderboard UI (same layout style as solo GlobalLeaderboardPage):
 * - Mobile: podium top 3 + list
 * - Desktop: top 3 cards + rankings list
 *
 * NOTE: This is purely presentational and does NOT affect solo/global leaderboard logic.
 */
export default function RoomLeaderboard({ leaderboard, totalLevels = 0, currentPlayerId = null }) {
  const players = Array.isArray(leaderboard) ? leaderboard : [];
  const top3 = players.slice(0, 3);
  const rest = players.slice(3);

  const renderName = (p) => {
    if (!p) return "";
    const name = p.name || "Unknown";
    const you = currentPlayerId && p.id === currentPlayerId;
    return (
      <>
        {name}
        {you && <span className="text-[#00ff88] ml-1.5 text-xs">(You)</span>}
        {p.gaveUp && <span className="text-white/50 ml-1.5 text-xs">(Gave up)</span>}
      </>
    );
  };

  return (
    <div className="w-full">
      {/* Mobile Layout */}
      <div className="md:hidden">
        {/* Podium - Top 3 */}
        {top3.length > 0 && (
          <div className="mb-6">
            <div className="flex items-end justify-center gap-2 px-2">
              {/* 2nd Place */}
              {top3[1] && (
                <div className="flex-1 max-w-[100px]">
                  <div className="bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] rounded-t-lg border-t-2 border-[#c0c0c0] p-3 shadow-lg">
                    <div className="text-center mb-2">
                      <Medal className="text-[#c0c0c0] mx-auto mb-1" size={24} />
                      <div className="text-[#c0c0c0] font-bold text-xs">#2</div>
                    </div>
                    <div className="text-white font-bold text-sm truncate mb-1">
                      {renderName(top3[1])}
                    </div>
                    <div className="text-[#00ff88] font-semibold text-xs mb-1">
                      {formatTime(top3[1].totalTime || 0)}
                    </div>
                    <div className="text-white/50 text-[10px]">
                      {(top3[1].completedLevels || 0)}/{totalLevels} • {top3[1].totalWrongAnswers || 0} wrong
                    </div>
                  </div>
                  <div className="bg-[#c0c0c0] h-16 rounded-b-lg" />
                </div>
              )}

              {/* 1st Place */}
              {top3[0] && (
                <div className="flex-1 max-w-[120px]">
                  <div className="bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] rounded-t-lg border-t-2 border-[#ffd700] p-4 shadow-xl shadow-[#ffd700]/20">
                    <div className="text-center mb-2">
                      <Trophy className="text-[#ffd700] mx-auto mb-1" size={32} />
                      <div className="text-[#ffd700] font-bold text-sm">#1</div>
                    </div>
                    <div className="text-white font-bold text-base truncate mb-1">
                      {renderName(top3[0])}
                    </div>
                    <div className="text-[#00ff88] font-semibold text-sm mb-1">
                      {formatTime(top3[0].totalTime || 0)}
                    </div>
                    <div className="text-white/50 text-[10px]">
                      {(top3[0].completedLevels || 0)}/{totalLevels} • {top3[0].totalWrongAnswers || 0} wrong
                    </div>
                  </div>
                  <div className="bg-[#ffd700] h-20 rounded-b-lg" />
                </div>
              )}

              {/* 3rd Place */}
              {top3[2] && (
                <div className="flex-1 max-w-[100px]">
                  <div className="bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] rounded-t-lg border-t-2 border-[#cd7f32] p-3 shadow-lg">
                    <div className="text-center mb-2">
                      <Medal className="text-[#cd7f32] mx-auto mb-1" size={24} />
                      <div className="text-[#cd7f32] font-bold text-xs">#3</div>
                    </div>
                    <div className="text-white font-bold text-sm truncate mb-1">
                      {renderName(top3[2])}
                    </div>
                    <div className="text-[#00ff88] font-semibold text-xs mb-1">
                      {formatTime(top3[2].totalTime || 0)}
                    </div>
                    <div className="text-white/50 text-[10px]">
                      {(top3[2].completedLevels || 0)}/{totalLevels} • {top3[2].totalWrongAnswers || 0} wrong
                    </div>
                  </div>
                  <div className="bg-[#cd7f32] h-12 rounded-b-lg" />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Rank List #4+ */}
        {rest.length > 0 && (
          <div className="space-y-1.5">
            {rest.map((p, index) => {
              const rank = index + 4;
              const isYou = currentPlayerId && p.id === currentPlayerId;
              return (
                <div
                  key={p.id || `${rank}-${p.name}`}
                  className={`bg-[#1a1a1a] rounded-lg px-3 py-2.5 border ${
                    isYou ? "border-[#00ff88]/50 bg-[#1a2a1a]" : "border-[#2a2a2a]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="text-white/40 font-bold text-xs w-6">#{rank}</div>
                      <div className="min-w-0 flex-1">
                        <div className="text-white font-semibold text-sm truncate">
                          {renderName(p)}
                        </div>
                        <div className="text-white/40 text-[10px] mt-0.5">
                          {(p.completedLevels || 0)}/{totalLevels} levels
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-[#00ff88] font-semibold text-xs">
                        {formatTime(p.totalTime || 0)}
                      </div>
                      <div className="text-white/40 text-[10px] mt-0.5">
                        {p.totalWrongAnswers || 0} wrong
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {players.length === 0 && (
          <div className="text-center py-10">
            <p className="text-white/50 text-sm">No players yet.</p>
          </div>
        )}
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block">
        {top3.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white/90 tracking-wide">TOP 3</h2>
            <div className="grid grid-cols-3 gap-4">
              {/* 1st Place */}
              {top3[0] && (
                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-xl border-2 border-[#ffd700]/40 p-5 shadow-xl shadow-[#ffd700]/10 hover:shadow-[#ffd700]/20 transition-all duration-300">
                  <div className="text-center mb-3">
                    <Trophy className="text-[#ffd700] mx-auto mb-2" size={32} />
                    <div className="text-[#ffd700] font-bold text-lg mb-1">#1</div>
                  </div>
                  <div className="text-white font-bold text-base mb-2 truncate">
                    {renderName(top3[0])}
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-white/70">
                      <span>Time</span>
                      <span className="text-[#00ff88] font-semibold">
                        {formatTime(top3[0].totalTime || 0)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-white/70">
                      <span>Levels</span>
                      <span className="text-white">
                        {(top3[0].completedLevels || 0)}/{totalLevels}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-white/70">
                      <span>Wrong</span>
                      <span className="text-white">{top3[0].totalWrongAnswers || 0}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 2nd Place */}
              {top3[1] && (
                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-xl border-2 border-[#c0c0c0]/40 p-5 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="text-center mb-3">
                    <Medal className="text-[#c0c0c0] mx-auto mb-2" size={28} />
                    <div className="text-[#c0c0c0] font-bold text-base mb-1">#2</div>
                  </div>
                  <div className="text-white font-bold text-sm mb-2 truncate">
                    {renderName(top3[1])}
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-white/70">
                      <span>Time</span>
                      <span className="text-[#00ff88] font-semibold">
                        {formatTime(top3[1].totalTime || 0)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-white/70">
                      <span>Levels</span>
                      <span className="text-white">
                        {(top3[1].completedLevels || 0)}/{totalLevels}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-white/70">
                      <span>Wrong</span>
                      <span className="text-white">{top3[1].totalWrongAnswers || 0}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 3rd Place */}
              {top3[2] && (
                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-xl border-2 border-[#cd7f32]/40 p-5 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="text-center mb-3">
                    <Medal className="text-[#cd7f32] mx-auto mb-2" size={28} />
                    <div className="text-[#cd7f32] font-bold text-base mb-1">#3</div>
                  </div>
                  <div className="text-white font-bold text-sm mb-2 truncate">
                    {renderName(top3[2])}
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-white/70">
                      <span>Time</span>
                      <span className="text-[#00ff88] font-semibold">
                        {formatTime(top3[2].totalTime || 0)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-white/70">
                      <span>Levels</span>
                      <span className="text-white">
                        {(top3[2].completedLevels || 0)}/{totalLevels}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-white/70">
                      <span>Wrong</span>
                      <span className="text-white">{top3[2].totalWrongAnswers || 0}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Rankings */}
        {rest.length > 0 && (
          <div className="space-y-3 mt-6">
            <h2 className="text-lg font-semibold text-white/90 tracking-wide">RANKINGS</h2>
            <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] overflow-hidden">
              <div className="divide-y divide-[#2a2a2a]">
                {rest.map((p, index) => {
                  const rank = index + 4;
                  const isYou = currentPlayerId && p.id === currentPlayerId;
                  return (
                    <div
                      key={p.id || `${rank}-${p.name}`}
                      className={`px-5 py-4 hover:bg-[#1f1f1f] transition-colors ${
                        isYou ? "bg-[#1a2a1a]/50 border-l-2 border-l-[#00ff88]" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className="text-white/40 font-bold text-sm w-8 flex-shrink-0">
                            #{rank}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-white font-semibold text-base truncate">
                              {renderName(p)}
                            </div>
                            <div className="text-white/50 text-xs mt-0.5">
                              {(p.completedLevels || 0)}/{totalLevels} levels • {p.totalWrongAnswers || 0} wrong
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-[#00ff88] font-semibold text-base">
                            {formatTime(p.totalTime || 0)}
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

        {players.length === 0 && (
          <div className="text-center py-10">
            <p className="text-white/50 text-base">No players yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

