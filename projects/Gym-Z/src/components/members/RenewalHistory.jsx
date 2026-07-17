import { formatDisplayDate } from "../../utils/dateUtils.js";
import Card from "../ui/Card.jsx";

export default function RenewalHistory({ renewals }) {
  if (!renewals?.length) {
    return (
      <Card className="p-6 text-center text-ink-500 text-sm">
        No renewal history yet.
      </Card>
    );
  }
  return (
    <div className="space-y-2">
      {renewals.map((r) => (
        <Card
          key={r.id}
          className="p-3.5 flex items-center justify-between gap-3"
        >
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-semibold truncate">{r.planName}</p>
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${r.type === "new" ? "bg-copper-500/15 text-copper-400" : "bg-steel-500/15 text-steel-300"}`}
              >
                {r.type === "new" ? "Joined" : "Renewed"}
              </span>
            </div>
            <p className="text-xs text-ink-500 font-mono mt-1">
              {formatDisplayDate(r.startDate)} →{" "}
              {formatDisplayDate(r.expiryDate)}
            </p>
          </div>
          <p className="font-mono text-sm font-semibold shrink-0">
            ₹{r.amount}
          </p>
        </Card>
      ))}
    </div>
  );
}
