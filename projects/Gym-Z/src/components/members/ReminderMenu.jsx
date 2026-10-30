// "Remind" trigger (button or iOS-style tile) that opens a sheet with
// WhatsApp / SMS / Call. Safe inside a <Link> card: the sheet renders in a
// portal and clicks are stopped from opening the member profile.
import { useState } from "react";
import { createPortal } from "react-dom";
import Button from "../ui/Button.jsx";
import Modal from "../ui/Modal.jsx";
import Icon from "../ui/Icon.jsx";
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
  layout = "button", // "button" | "tile"
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

  // Fire-and-forget so it never blocks opening WhatsApp/SMS.
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
    "w-full flex items-center gap-3 p-3 rounded-2xl bg-ink-900 hover:bg-ink-700/60 text-left transition-colors disabled:opacity-40 disabled:cursor-not-allowed";

  const Row = ({ icon, tint, title, sub, onClick }) => (
    <button className={rowClass} disabled={!number} onClick={onClick}>
      <span
        className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${tint}`}
      >
        <Icon name={icon} size={19} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-semibold">{title}</span>
        <span className="block text-xs text-ink-500">{sub}</span>
      </span>
      <Icon name="chevronRight" size={16} className="text-ink-500" />
    </button>
  );

  return (
    <div onClick={stop} className={`flex items-center gap-2 ${className}`}>
      {layout === "tile" ? (
        <button
          type="button"
          onClick={(e) => {
            stop(e);
            setOpen(true);
          }}
          className="group flex flex-col items-center gap-1.5 w-16"
        >
          <span className="h-12 w-12 rounded-2xl bg-ink-700 text-ink-100 group-hover:bg-ink-600 group-active:scale-95 flex items-center justify-center transition-all">
            <Icon name="bell" size={22} />
          </span>
          <span className="text-[11px] font-medium text-ink-300">Remind</span>
        </button>
      ) : (
        <Button
          size="sm"
          variant="secondary"
          onClick={(e) => {
            stop(e);
            setOpen(true);
          }}
        >
          <Icon name="bell" size={15} />
          Remind
        </Button>
      )}
      {layout !== "tile" && showLastReminded && lastReminded && (
        <span className="text-[11px] text-ink-500 font-mono">
          Reminded {formatDisplayDate(lastReminded)}
        </span>
      )}

      {createPortal(
        <Modal open={open} onClose={() => setOpen(false)} title="Send Reminder">
          <div className="space-y-3">
            <p className="text-[13px] text-ink-200 bg-ink-900 rounded-2xl p-4 leading-relaxed">
              {message}
            </p>

            <p className="text-xs text-ink-500 px-1">
              {lastReminded
                ? `Last reminded: ${formatDisplayDate(lastReminded)}`
                : "Not reminded yet"}
            </p>

            {!number && (
              <p className="text-xs text-vitality-critical px-1">
                This phone number looks invalid, so a reminder can&apos;t be
                sent. Please check the number on the member&apos;s profile.
              </p>
            )}

            <Row
              icon="chat"
              tint="bg-[#25D366]/15 text-[#1FA855]"
              title="WhatsApp"
              sub="Send the message on WhatsApp"
              onClick={openWhatsApp}
            />
            <Row
              icon="chat"
              tint="bg-steel-500/15 text-steel-300"
              title="SMS"
              sub="Works even without WhatsApp"
              onClick={openSms}
            />
            <Row
              icon="phone"
              tint="bg-copper-500/15 text-copper-400"
              title="Call"
              sub="Call this member"
              onClick={openCall}
            />
          </div>
        </Modal>,
        document.body,
      )}
    </div>
  );
}
