import Card from "../ui/Card.jsx";

export default function GymRankCard({ gym, rank }) {
  return (
    <Card className="p-5 flex items-center gap-4 hover:border-copper-500/40 transition-colors">
      <div className="h-11 w-11 rounded-full bg-ink-900 border border-ink-700 flex items-center justify-center font-mono font-semibold text-copper-400 shrink-0">
        #{rank}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-display text-base truncate">{gym.gymName}</h4>
        <p className="text-xs text-ink-500 mt-0.5">
          {gym.shortAddress ? `${gym.shortAddress}, ` : ""}
          {gym.city}, {gym.state}
        </p>
      </div>
      <div className="text-right shrink-0">
        <p className="font-mono text-xl font-semibold text-copper-400">
          {gym.activeMemberCount || 0}
        </p>
        <p className="text-[11px] text-ink-500 uppercase">Active</p>
      </div>
    </Card>
  );
}
