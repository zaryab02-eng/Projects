// Membership validity indicator: a slim rounded track with a colored fill.
import { getValidityIndicator } from "../../utils/membershipUtils.js";

export default function ValidityBar({
  joiningDate,
  expiryDate,
  showLabel = true,
}) {
  const { percent, hex, label } = getValidityIndicator(joiningDate, expiryDate);
  return (
    <div className="w-full">
      <div className="h-1.5 w-full rounded-full bg-ink-700 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${percent}%`, backgroundColor: hex }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between mt-1.5">
          <span className="text-[11px] font-medium text-ink-500 font-mono">
            {percent}% remaining
          </span>
          <span
            className="text-[11px] font-semibold font-mono"
            style={{ color: hex }}
          >
            {label}
          </span>
        </div>
      )}
    </div>
  );
}
