// Plain list row for the Members page. Render rows inside a single
// <Card className="divide-y ..."> so they form one grouped list.
import { Link } from "react-router-dom";
import Badge from "../ui/Badge.jsx";
import Icon from "../ui/Icon.jsx";
import { formatDisplayDate, daysUntil } from "../../utils/dateUtils.js";
import { getEffectiveExpiryDate } from "../../utils/membershipUtils.js";

export default function MemberListItem({ member }) {
  const remaining = daysUntil(getEffectiveExpiryDate(member));
  const initial = member.fullName?.trim()?.[0]?.toUpperCase() || "?";

  const pill =
    remaining < 0
      ? "bg-vitality-critical/15 text-vitality-critical"
      : remaining <= 7
        ? "bg-vitality-warn/15 text-vitality-warn"
        : "bg-ink-700 text-ink-300";

  return (
    <Link
      to={`/members/${member.id}`}
      className="flex items-center gap-3.5 px-4 py-3.5 hover:bg-ink-700/40 active:bg-ink-700/60 transition-colors"
    >
      <div className="h-11 w-11 rounded-full bg-gradient-to-br from-copper-400/25 to-copper-600/25 flex items-center justify-center text-base font-semibold text-copper-400 shrink-0">
        {initial}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-[15px] truncate">
            {member.fullName}
          </p>
          {member.blacklisted && <Badge variant="critical">Blacklisted</Badge>}
        </div>
        <p className="text-xs text-ink-500 mt-0.5 truncate">
          <span className="font-mono">{member.phone}</span> · {member.planName}
          <span className="hidden sm:inline">
            {" "}
            · Joined {formatDisplayDate(member.joiningDate)}
          </span>
        </p>
      </div>

      <span
        className={`shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full font-mono ${pill}`}
      >
        {remaining >= 0 ? `${remaining}d left` : `${-remaining}d overdue`}
      </span>
      <Icon
        name="chevronRight"
        size={16}
        className="text-ink-500 shrink-0 hidden sm:block"
      />
    </Link>
  );
}
