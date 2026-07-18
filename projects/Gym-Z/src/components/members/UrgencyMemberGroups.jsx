// Shared "grouped by urgency" member list — the polished card-with-
// validity-bar style, grouped under urgency headers. Used by both the
// Members page (includeHealthy=true, shows everyone) and the Dashboard's
// Needs Attention section (includeHealthy=false, only urgent buckets).
import { groupByUrgency, bucketLabel } from "../../utils/membershipUtils.js";
import Badge from "../ui/Badge.jsx";
import MemberCard from "./MemberCard.jsx";

const BUCKET_TONE = {
  expired: "critical",
  expires_today: "critical",
  expires_tomorrow: "warn",
  within_3_days: "warn",
  within_7_days: "neutral",
  healthy: "success",
};

const ATTENTION_ORDER = [
  "expired",
  "expires_today",
  "expires_tomorrow",
  "within_3_days",
  "within_7_days",
];
const FULL_ORDER = [...ATTENTION_ORDER, "healthy"];

export default function UrgencyMemberGroups({
  members,
  includeHealthy = false,
  emptyMessage = "No members found.",
}) {
  const groups = groupByUrgency(members);
  const order = includeHealthy ? FULL_ORDER : ATTENTION_ORDER;
  const hasAny = order.some((k) => groups[k].length > 0);

  if (!hasAny) {
    return (
      <p className="text-center text-ink-500 py-16 text-sm">{emptyMessage}</p>
    );
  }

  return (
    <div className="space-y-7">
      {order.map(
        (bucket) =>
          groups[bucket].length > 0 && (
            <div key={bucket}>
              <div className="flex items-center gap-2.5 mb-3">
                <Badge variant={BUCKET_TONE[bucket]}>
                  {bucketLabel(bucket)}
                </Badge>
                <span className="text-xs text-ink-500 font-mono">
                  {groups[bucket].length}
                </span>
                <div className="h-px flex-1 bg-ink-800" />
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {groups[bucket].map((m) => (
                  <MemberCard key={m.id} member={m} />
                ))}
              </div>
            </div>
          ),
      )}
    </div>
  );
}
