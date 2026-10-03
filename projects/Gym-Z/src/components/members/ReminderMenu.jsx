// "Remind" button: opens a sheet with WhatsApp / SMS / Call. Safe inside a
// <Link> card: the sheet renders in a portal (so card hover-transforms can't
// break its fixed positioning) and clicks are stopped from opening the
// member profile.
import { useState } from "react";
import { createPortal } from "react-dom";
import Button from "../ui/Button.jsx";
import Modal from "../ui/Modal.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { updateMember } from "../../firebase/firestore.js";
import { formatDisplayDate, todayStr } from "../../utils/dateUtils.js";
import {
  normalizePhone,
  buildReminderMessage,
  whatsappUrl,
  smsUrl,
  telUrl,
} from "../../utils/reminderUtils.js";

export default function ReminderMenu({
  member,
  showLastReminded = true,
  onReminded,
  className = "",
}) {
  const { gym, gymId } = useAuth();
  const [open, setOpen] = useState(false);
  const [localLast, setLocalLast] = useState(null);

  if (!member || member.blacklisted) return null;

  const number = normalizePhone(member.phone);
  const message = buildReminderMessage(member, gym?.gymName);
  const lastReminded = localLast || member.lastRemindedAt;

  const stop = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Records the reminder date. Fire-and-forget so it never blocks opening
  // WhatsApp/SMS (browsers only allow window.open directly in a click).
  const markReminded = () => {
    const today = todayStr();
    setLocalLast(today);
    updateMember(gymId, member.id, { lastRemindedAt: today })
      .then(() => onReminded?.())
      .catch((err) => console.warn("Could not save last reminded:", err));
  };

  const openWhatsApp = () => {
    window.open(whatsappUrl(number, message), "_blank", "noopener");
    markReminded();
    setOpen(false);
  };
  const openSms = () => {
    markReminded();
    window.location.href = smsUrl(number, message);
    setOpen(false);
  };
  const openCall = () => {
    window.location.href = telUrl(number);
    setOpen(false);
  };

  const rowClass =
    "w-full text-left px-4 py-3 text-sm rounded-lg border border-ink-700 hover:bg-ink-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed";

  return (
    <div onClick={stop} className={`flex items-center gap-2 ${className}`}>
      <Button
        size="sm"
        variant="secondary"
        onClick={(e) => {
          stop(e);
          setOpen(true);
        }}
      >
        Remind
      </Button>
      {showLastReminded && lastReminded && (
        <span className="text-[11px] text-ink-500 font-mono">
          Reminded {formatDisplayDate(lastReminded)}
        </span>
      )}

      {createPortal(
        <Modal open={open} onClose={() => setOpen(false)} title="Send Reminder">
          <div className="space-y-3">
            <p className="text-xs text-ink-500 bg-ink-900/50 rounded-lg p-3 leading-relaxed">
              {message}
            </p>

            <p className="text-[11px] text-ink-500">
              {lastReminded
                ? `Last reminded: ${formatDisplayDate(lastReminded)}`
                : "Not reminded yet"}
            </p>

            {!number && (
              <p className="text-xs text-vitality-critical">
                This phone number looks invalid, so a reminder can&apos;t be
                sent. Please check the number on the member&apos;s profile.
              </p>
            )}

            <button
              className={rowClass}
              disabled={!number}
              onClick={openWhatsApp}
            >
              WhatsApp
            </button>
            <button className={rowClass} disabled={!number} onClick={openSms}>
              SMS (works even without WhatsApp)
            </button>
            <button className={rowClass} disabled={!number} onClick={openCall}>
              Call
            </button>
          </div>
        </Modal>,
        document.body,
      )}
    </div>
  );
}
