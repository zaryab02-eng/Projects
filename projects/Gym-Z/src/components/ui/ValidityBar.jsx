// The signature visual element: a horizontal "knurled bar" membership
// validity indicator, styled like a loaded barbell — the fill is the
// weight sleeve, colored along the dark-green -> red -> grey scale.
import { getValidityIndicator } from '../../utils/membershipUtils.js'

export default function ValidityBar({ joiningDate, expiryDate, showLabel = true }) {
  const { percent, hex, label } = getValidityIndicator(joiningDate, expiryDate)
  return (
    <div className="w-full">
      <div className="h-2 w-full rounded-full bg-ink-700 overflow-hidden relative">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${percent}%`, backgroundColor: hex }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between mt-1">
          <span className="text-[11px] font-mono text-ink-500">{percent}% remaining</span>
          <span className="text-[11px] font-mono font-semibold" style={{ color: hex }}>{label}</span>
        </div>
      )}
    </div>
  )
}
