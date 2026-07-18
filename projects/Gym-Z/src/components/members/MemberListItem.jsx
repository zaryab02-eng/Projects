import { Link } from "react-router-dom";
import Card from "../ui/Card.jsx";
import Badge from "../ui/Badge.jsx";
import { formatStreak } from "../../utils/streakUtils.js";
import { formatDisplayDate, daysUntil } from "../../utils/dateUtils.js";
import { getEffectiveExpiryDate } from "../../utils/membershipUtils.js";

export default function MemberListItem({ member }) {
  const remaining = daysUntil(getEffectiveExpiryDate(member));
  const streakLabel = formatStreak(member.streakDays);
  const initial = member.fullName?.trim()?.[0]?.toUpperCase() || "?";

  return (
    <Link to={`/members/${member.id}`} className="block group">
      <Card className="p-3.5 flex items-center gap-3 hover:border-copper-500/50 transition-colors">
        <div className="h-10 w-10 rounded-full bg-ink-700 flex items-center justify-center font-display text-sm text-copper-400 shrink-0">
          {initial}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold truncate group-hover:text-copper-400 transition-colors">
              {member.fullName}
            </p>
            {member.blacklisted && (
              <Badge variant="critical">Blacklisted</Badge>
            )}
          </div>
          <p className="text-xs text-ink-500 font-mono mt-0.5">
            {member.phone} · {member.planName} · Joined{" "}
            {formatDisplayDate(member.joiningDate)}
          </p>
        </div>

        <div className="flex flex-col items-end gap-1 shrink-0 text-right">
          <span className="text-xs font-mono text-ink-500">
            {remaining >= 0 ? `${remaining}d left` : `${-remaining}d overdue`}
          </span>
          {streakLabel && (
            <span className="text-xs font-mono text-copper-400">
              🔥 {streakLabel}
            </span>
          )}
        </div>
      </Card>
    </Link>
  );
}
