import { Link } from "react-router-dom";
import Card from "../ui/Card.jsx";
import ValidityBar from "../ui/ValidityBar.jsx";
import Badge from "../ui/Badge.jsx";
import { formatStreak } from "../../utils/streakUtils.js";
import { daysUntil } from "../../utils/dateUtils.js";

export default function MemberCard({ member }) {
  const remaining = daysUntil(member.expiryDate);
  const streakLabel = formatStreak(member.streakDays);
  const initial = member.fullName?.trim()?.[0]?.toUpperCase() || "?";

  return (
    <Link to={`/members/${member.id}`} className="block group">
      <Card className="p-4 hover:border-copper-500/50 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-full bg-ink-700 flex items-center justify-center font-display text-sm text-copper-400 shrink-0">
            {initial}
          </div>
          <div className="min-w-0 flex-1 flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-semibold truncate group-hover:text-copper-400 transition-colors">
                {member.fullName}
              </p>
              <p className="text-xs text-ink-500 font-mono">{member.phone}</p>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              {member.blacklisted && (
                <Badge variant="critical">Blacklisted</Badge>
              )}
              {streakLabel && (
                <span className="text-xs font-mono text-copper-400 whitespace-nowrap">
                  🔥 {streakLabel}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-3.5">
          <ValidityBar
            joiningDate={member.joiningDate}
            expiryDate={member.expiryDate}
          />
        </div>

        <div className="flex items-center justify-between mt-2.5 text-xs text-ink-500">
          <span className="truncate">{member.planName}</span>
          <span className="font-mono shrink-0">
            {remaining >= 0 ? `${remaining}d left` : `${-remaining}d overdue`}
          </span>
        </div>
      </Card>
    </Link>
  );
}
