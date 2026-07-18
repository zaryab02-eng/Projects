import Card from "../ui/Card.jsx";
import UrgencyMemberGroups from "../members/UrgencyMemberGroups.jsx";
import { groupByUrgency } from "../../utils/membershipUtils.js";

const ATTENTION_ORDER = [
  "expired",
  "expires_today",
  "expires_tomorrow",
  "within_3_days",
  "within_7_days",
];

export default function ExpiryAttentionList({ members }) {
  const groups = groupByUrgency(members);
  const hasAny = ATTENTION_ORDER.some((k) => groups[k].length > 0);

  if (!hasAny) {
    return (
      <Card className="p-8 text-center text-ink-500">
        No members need attention right now. Every membership is healthy. 💪
      </Card>
    );
  }

  return <UrgencyMemberGroups members={members} includeHealthy={false} />;
}
