/**
 * Shared ranking comparator used by BOTH:
 * - Solo global leaderboard (stored under soloLeaderboards/*)
 * - Multiplayer realtime room leaderboard (derived from rooms/<roomCode>/players)
 *
 * Ranking priority:
 * 1) Higher completed levels (desc)
 * 2) Lower total time (asc)
 * 3) Fewer wrong attempts (asc)
 * 4) Newer progress ranks higher (desc)
 */
export function compareEscapeRanking(a, b) {
  const aLevels = Number(a?.completedLevels ?? 0) || 0;
  const bLevels = Number(b?.completedLevels ?? 0) || 0;
  if (bLevels !== aLevels) return bLevels - aLevels;

  const aTime = Number(a?.totalTime ?? 0) || 0;
  const bTime = Number(b?.totalTime ?? 0) || 0;
  if (aTime !== bTime) return aTime - bTime;

  const aWrong = Number(a?.totalWrongAnswers ?? 0) || 0;
  const bWrong = Number(b?.totalWrongAnswers ?? 0) || 0;
  if (aWrong !== bWrong) return aWrong - bWrong;

  const aTs =
    Number(a?.timestamp ?? a?.lastProgressAt ?? a?.joinedAt ?? a?.updatedAt ?? 0) || 0;
  const bTs =
    Number(b?.timestamp ?? b?.lastProgressAt ?? b?.joinedAt ?? b?.updatedAt ?? 0) || 0;
  return bTs - aTs;
}

