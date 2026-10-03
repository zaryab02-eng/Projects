// Builds the reminder message and contact links (WhatsApp / SMS / Call).
// Everything here is a plain string or link: no API, no backend.
import { formatDisplayDate, daysUntil } from "./dateUtils.js";
import { getEffectiveExpiryDate } from "./membershipUtils.js";

// Added to 10-digit numbers. Change this if your members are not in India.
export const DEFAULT_COUNTRY_CODE = "91";

/** Returns a digits-only number with country code, or null if unusable. */
export function normalizePhone(phone) {
  let digits = String(phone || "").replace(/\D/g, "");
  if (!digits) return null;
  if (digits.startsWith("00")) digits = digits.slice(2);

  if (digits.length === 10) return DEFAULT_COUNTRY_CODE + digits;
  if (digits.length === 11 && digits.startsWith("0")) {
    return DEFAULT_COUNTRY_CODE + digits.slice(1);
  }
  if (digits.length >= 11 && digits.length <= 15) return digits;
  return null;
}

// Hinglish phrase that depends on how close the expiry is.
function getStatusText(remaining, date) {
  if (remaining < 0) return `${date} ko expire ho chuki hai`;
  if (remaining === 0) return `aaj (${date}) expire ho rahi hai`;
  if (remaining === 1) return `kal (${date}) expire ho rahi hai`;
  return `${date} ko expire ho rahi hai (${remaining} din baaki)`;
}

/** Builds the Hinglish reminder using the member's EFFECTIVE expiry date. */
export function buildReminderMessage(member, gymName) {
  const expiry = getEffectiveExpiryDate(member);
  const remaining = daysUntil(expiry);
  const date = formatDisplayDate(expiry);

  const name = member.fullName?.trim()?.split(/\s+/)[0] || "there";
  const plan = member.scheduledMembership?.planName || member.planName || "gym";
  const gym = gymName || "hamare gym";

  return `Hi ${name}, aapki ${plan} membership ${gym} me ${getStatusText(remaining, date)}. Please renew kar lijiye. Thank you!`;
}

export const whatsappUrl = (number, message) =>
  `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

export const smsUrl = (number, message) =>
  `sms:+${number}?body=${encodeURIComponent(message)}`;

export const telUrl = (number) => `tel:+${number}`;
