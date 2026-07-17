import { Link } from "react-router-dom";
import Card from "../ui/Card.jsx";
import Button from "../ui/Button.jsx";
import { formatDisplayDate } from "../../utils/dateUtils.js";

export default function BlacklistEntryCard({ entry, member, onRemove }) {
  return (
    <Card className="p-4">
      <Link to={`/members/${entry.memberId}`} className="block">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-semibold hover:text-copper-400 transition-colors">
              {member?.fullName || "Unknown member"}
            </p>
            <p className="text-xs text-ink-500 font-mono">{member?.phone}</p>
          </div>
          <span className="text-xs text-ink-500 font-mono shrink-0">
            {entry.dateAdded?.toDate
              ? formatDisplayDate(
                  entry.dateAdded.toDate().toISOString().slice(0, 10),
                )
              : ""}
          </span>
        </div>
        <div className="mt-3 bg-ink-900 rounded-lg p-3 text-sm">
          <p>
            <span className="text-ink-500">Reason: </span>
            {entry.reason}
          </p>
          {entry.notes && <p className="mt-1 text-ink-500">{entry.notes}</p>}
        </div>
      </Link>
      <Button
        variant="ghost"
        size="sm"
        className="w-full mt-3"
        onClick={() => onRemove(entry)}
      >
        Remove from Blacklist
      </Button>
    </Card>
  );
}
