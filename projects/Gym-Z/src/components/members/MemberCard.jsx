import { Link } from "react-router-dom";
import Card from "../ui/Card.jsx";
import ValidityBar from "../ui/ValidityBar.jsx";
import Badge from "../ui/Badge.jsx";
import Avatar from "../ui/Avatar.jsx";
import ReminderMenu from "./ReminderMenu.jsx";
import { daysUntil } from "../../utils/dateUtils.js";
import { getValidityIndicator } from "../../utils/membershipUtils.js";

// showRemind is set by UrgencyMemberGroups for expired / expiring-within-3-days
// buckets only, so the 4 to 7 day cards stay clean.
export default function MemberCard({ member, showRemind = false }) {
  const remaining = daysUntil(member.expiryDate);
  const { hex } = getValidityIndicator(member.joiningDate, member.expiryDate);

  const chip =
    remaining < 0
      ? "bg-vitality-critical/15 text-vitality-critical"
      : remaining <= 3
        ? "bg-vitality-warn/15 text-vitality-warn"
        : "bg-ink-700 text-ink-300";

  return (
    <Link to={`/members/${member.id}`} className="block group">
      <Card className="p-4 hover:border-ink-600 active:scale-[0.99] transition-all duration-200">
        <div className="flex items-center gap-3">
          <Avatar
            member={member}
            size={44}
            fallbackClassName=""
            fallbackStyle={{ backgroundColor: `${hex}26`, color: hex }}
          />
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-[15px] truncate">
              {member.fullName}
            </p>
            <p className="text-xs text-ink-500 font-mono mt-0.5">
              {member.phone}
            </p>
          </div>
          <span
            className={`shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full font-mono ${chip}`}
          >
            {remaining >= 0 ? `${remaining}d left` : `${-remaining}d overdue`}
          </span>
        </div>

        <div className="mt-4">
          <ValidityBar
            joiningDate={member.joiningDate}
            expiryDate={member.expiryDate}
            showLabel={false}
          />
        </div>

        <div className="flex items-center justify-between gap-3 mt-3.5 min-h-[36px]">
          <div className="min-w-0 flex items-center gap-2">
            <span className="text-xs text-ink-500 truncate">
              {member.planName}
            </span>
            {member.blacklisted && (
              <Badge variant="critical">Blacklisted</Badge>
            )}
            {member.frozen && <Badge variant="steel">Frozen</Badge>}
          </div>
          {showRemind && !member.blacklisted && !member.frozen && (
            <ReminderMenu member={member} />
          )}
        </div>
      </Card>
    </Link>
  );
}
