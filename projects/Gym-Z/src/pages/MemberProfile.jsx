import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppShell from "../components/layout/AppShell.jsx";
import Card from "../components/ui/Card.jsx";
import Badge from "../components/ui/Badge.jsx";
import Button from "../components/ui/Button.jsx";
import ValidityBar from "../components/ui/ValidityBar.jsx";
import Spinner from "../components/ui/Spinner.jsx";
import Modal from "../components/ui/Modal.jsx";
import Select from "../components/ui/Select.jsx";
import Icon from "../components/ui/Icon.jsx";
import RenewalHistory from "../components/members/RenewalHistory.jsx";
import ReminderMenu from "../components/members/ReminderMenu.jsx";
import AddToBlacklistModal from "../components/blacklist/AddToBlacklistModal.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import {
  getMember,
  getMemberRenewals,
  subscribeToPlans,
  renewExpiredMembership,
  extendMembership,
  renewMembershipImmediately,
  addToBlacklist,
  removeFromBlacklist,
  deleteMember,
} from "../firebase/firestore.js";
import { formatDisplayDate, daysUntil } from "../utils/dateUtils.js";
import { downloadMemberPdf } from "../utils/pdfUtils.js";

export default function MemberProfile() {
  const { memberId } = useParams();
  const { gymId, gym } = useAuth();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [renewals, setRenewals] = useState([]);
  const [plans, setPlans] = useState([]);
  const [renewOpen, setRenewOpen] = useState(false);
  const [blacklistOpen, setBlacklistOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [renewMode, setRenewMode] = useState("extend");
  const [submitting, setSubmitting] = useState(false);
  const [pdfBusy, setPdfBusy] = useState(false);
  const menuRef = useRef(null);

  const load = useCallback(async () => {
    try {
      const [m, r] = await Promise.all([
        getMember(gymId, memberId),
        getMemberRenewals(gymId, memberId),
      ]);
      setMember(m);
      setRenewals(r);
    } catch (error) {
      console.warn("Unable to load member:", error);
    }
  }, [gymId, memberId]);

  useEffect(() => {
    if (gymId) load();
  }, [gymId, load]);
  useEffect(() => {
    if (gymId) return subscribeToPlans(gymId, setPlans);
  }, [gymId]);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const isExpired = member ? daysUntil(member.expiryDate) < 0 : false;

  const openRenewModal = () => {
    setSelectedPlanId(plans[0]?.id || "");
    setRenewMode("extend");
    setRenewOpen(true);
  };

  const handleRenew = async () => {
    const plan = plans.find((p) => p.id === selectedPlanId);
    if (!plan) return;
    setSubmitting(true);
    try {
      if (isExpired) {
        await renewExpiredMembership(gymId, memberId, member, plan);
      } else if (renewMode === "extend") {
        await extendMembership(gymId, memberId, member, plan);
      } else {
        await renewMembershipImmediately(gymId, memberId, member, plan);
      }
      setRenewOpen(false);
      await load();
    } finally {
      setSubmitting(false);
    }
  };

  const handleBlacklist = async ({ reason, notes }) => {
    setSubmitting(true);
    try {
      await addToBlacklist(gymId, memberId, { reason, notes });
      setBlacklistOpen(false);
      await load();
    } finally {
      setSubmitting(false);
    }
  };

  const handleUnblacklist = async () => {
    if (!window.confirm("Remove this member from the blacklist?")) return;
    setSubmitting(true);
    try {
      await removeFromBlacklist(gymId, memberId);
      await load();
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      await deleteMember(gymId, memberId);
      navigate("/members");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadPdf = async () => {
    setPdfBusy(true);
    try {
      await downloadMemberPdf(member, renewals, gym?.gymName || "Gym-Z");
    } catch (error) {
      console.error("PDF export failed:", error);
      alert("Could not create the PDF. Please try again.");
    } finally {
      setPdfBusy(false);
    }
  };

  if (!member) {
    return (
      <AppShell>
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      </AppShell>
    );
  }

  const remaining = daysUntil(member.expiryDate);
  const initial = member.fullName?.trim()?.[0]?.toUpperCase() || "?";
  const daysTone =
    remaining < 0
      ? "bg-vitality-critical/15 text-vitality-critical"
      : remaining <= 7
        ? "bg-vitality-warn/15 text-vitality-warn"
        : "bg-ink-700 text-ink-300";

  return (
    <AppShell>
      <button
        onClick={() => navigate("/members")}
        className="inline-flex items-center gap-0.5 text-sm font-medium text-copper-400 mb-4 -ml-1"
      >
        <Icon name="chevronLeft" size={18} strokeWidth={2.2} />
        Members
      </button>

      <div className="grid lg:grid-cols-5 gap-5 lg:gap-6 items-start">
        {/* Left column */}
        <div className="lg:col-span-3 space-y-5">
          {/* Identity + actions */}
          <Card className="p-5 sm:p-6">
            <div className="flex flex-col items-center text-center sm:flex-row sm:text-left gap-4 sm:gap-5">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-copper-400 to-copper-600 text-white flex items-center justify-center text-3xl font-semibold shrink-0">
                {initial}
              </div>
              <div className="min-w-0">
                <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                  <h1 className="text-2xl font-semibold tracking-tight break-words">
                    {member.fullName}
                  </h1>
                  {member.blacklisted && (
                    <Badge variant="critical">Blacklisted</Badge>
                  )}
                </div>
                <p className="text-ink-500 font-mono text-[15px] mt-1">
                  {member.phone}
                </p>
                {member.lastRemindedAt && (
                  <p className="text-xs text-ink-500 mt-1">
                    Last reminded {formatDisplayDate(member.lastRemindedAt)}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-ink-700/60 flex justify-center sm:justify-start items-start gap-3 sm:gap-6">
              <ActionTile
                icon="refresh"
                label="Renew"
                primary
                onClick={openRenewModal}
              />
              {!member.blacklisted && (
                <ReminderMenu
                  member={member}
                  layout="tile"
                  showLastReminded={false}
                  onReminded={load}
                />
              )}
              <ActionTile
                icon="file"
                label={pdfBusy ? "Preparing…" : "PDF"}
                onClick={handleDownloadPdf}
              />
              <div className="relative" ref={menuRef}>
                <ActionTile
                  icon="more"
                  label="More"
                  onClick={() => setMenuOpen((open) => !open)}
                />
                {menuOpen ? (
                  <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-ink-700/60 bg-ink-800 shadow-sheet p-1.5 z-20 animate-fade-up">
                    {member.blacklisted ? (
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          handleUnblacklist();
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-ink-700/60 transition-colors"
                      >
                        <Icon name="check" size={17} />
                        Remove from Blacklist
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          setBlacklistOpen(true);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-ink-700/60 transition-colors"
                      >
                        <Icon name="ban" size={17} />
                        Blacklist Member
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        setDeleteOpen(true);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-vitality-critical hover:bg-ink-700/60 transition-colors"
                    >
                      <Icon name="trash" size={17} />
                      Remove Member
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </Card>

          {/* Membership */}
          <Card className="p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                  Current Plan
                </p>
                <p className="text-lg font-semibold tracking-tight truncate mt-0.5">
                  {member.planName}
                </p>
              </div>
              <span
                className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full font-mono ${daysTone}`}
              >
                {remaining >= 0
                  ? `${remaining} days left`
                  : `${-remaining} days overdue`}
              </span>
            </div>
            <ValidityBar
              joiningDate={member.joiningDate}
              expiryDate={member.expiryDate}
            />

            <div className="grid grid-cols-3 gap-4 mt-6 pt-5 border-t border-ink-700/60">
              <Info
                label="Joined"
                value={formatDisplayDate(member.joiningDate)}
              />
              <Info
                label="Expires"
                value={formatDisplayDate(member.expiryDate)}
              />
              <Info
                label="Lifetime Paid"
                value={`₹${member.lifetimeAmountPaid || 0}`}
                accent
              />
            </div>

            {member.scheduledMembership && (
              <div className="mt-5 rounded-2xl bg-copper-500/10 p-4 flex items-center justify-between flex-wrap gap-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-copper-400">
                    Up Next
                  </p>
                  <p className="text-[15px] font-semibold mt-0.5">
                    {member.scheduledMembership.planName}
                  </p>
                </div>
                <p className="text-xs text-ink-300 font-mono">
                  {formatDisplayDate(member.scheduledMembership.startDate)} →{" "}
                  {formatDisplayDate(member.scheduledMembership.expiryDate)}
                </p>
              </div>
            )}
          </Card>

          {/* Personal info */}
          <Card className="p-5 sm:p-6">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-500 mb-4">
              Personal Information
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-5">
              <Info label="Alt Phone" value={member.altPhone || "—"} />
              <Info label="Age" value={member.age || "—"} />
              <Info
                label="Gender"
                value={
                  member.gender
                    ? member.gender[0].toUpperCase() + member.gender.slice(1)
                    : "—"
                }
              />
              <Info label="Address" value={member.address || "—"} />
            </div>
            {member.notes && (
              <div className="mt-5 pt-5 border-t border-ink-700/60">
                <p className="text-xs text-ink-500 mb-1">Notes</p>
                <p className="text-[15px] text-ink-100 leading-relaxed">
                  {member.notes}
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Right column: history */}
        <div className="lg:col-span-2 lg:sticky lg:top-20">
          <Card className="p-5 sm:p-6">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-500 mb-4">
              Renewal History
            </h2>
            <RenewalHistory renewals={renewals} />
          </Card>
        </div>
      </div>

      <Modal
        open={renewOpen}
        onClose={() => setRenewOpen(false)}
        title="Renew Membership"
        footer={
          <Button className="w-full" loading={submitting} onClick={handleRenew}>
            Confirm Renewal
          </Button>
        }
      >
        <div className="space-y-5">
          <Select
            label="Select Plan"
            value={selectedPlanId}
            onChange={(e) => setSelectedPlanId(e.target.value)}
            options={plans.map((p) => ({
              value: p.id,
              label: `${p.name} — ₹${p.fee}`,
            }))}
          />

          {isExpired ? (
            <p className="text-[13px] text-ink-300 bg-ink-900 rounded-2xl p-4 leading-relaxed">
              This membership has expired. The new plan will start{" "}
              <span className="text-ink-50 font-semibold">today</span>.
            </p>
          ) : (
            <div className="space-y-2.5">
              <p className="text-[13px] font-medium text-ink-300">
                Renewal Mode
              </p>
              <ModeOption
                selected={renewMode === "extend"}
                onClick={() => setRenewMode("extend")}
                title="Extend Current Membership"
                badge="Recommended"
              >
                Starts right after the current plan ends on{" "}
                {formatDisplayDate(
                  member.scheduledMembership?.expiryDate || member.expiryDate,
                )}
                . No remaining days are lost.
              </ModeOption>
              <ModeOption
                selected={renewMode === "immediate"}
                onClick={() => setRenewMode("immediate")}
                title="Start Immediately"
              >
                Ends the current plan today. Any remaining days are discarded.
              </ModeOption>
            </div>
          )}
        </div>
      </Modal>

      <AddToBlacklistModal
        open={blacklistOpen}
        onClose={() => setBlacklistOpen(false)}
        onSubmit={handleBlacklist}
        submitting={submitting}
      />

      <Modal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Remove Member"
        footer={
          <>
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => setDeleteOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              className="w-full"
              loading={submitting}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </>
        }
      >
        <p className="text-[15px] text-ink-300 leading-relaxed">
          This will permanently delete{" "}
          <span className="font-semibold text-ink-50">{member.fullName}</span>,
          including their full renewal history and blacklist record. This cannot
          be undone.
        </p>
      </Modal>
    </AppShell>
  );
}

function ActionTile({ icon, label, onClick, primary = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col items-center gap-1.5 w-16"
    >
      <span
        className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all group-active:scale-95 ${
          primary
            ? "bg-copper-500 text-white group-hover:bg-copper-600"
            : "bg-ink-700 text-ink-100 group-hover:bg-ink-600"
        }`}
      >
        <Icon name={icon} size={22} />
      </span>
      <span className="text-[11px] font-medium text-ink-300 whitespace-nowrap">
        {label}
      </span>
    </button>
  );
}

function ModeOption({ selected, onClick, title, badge, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left p-4 rounded-2xl border transition-colors flex gap-3 ${
        selected
          ? "border-copper-500 bg-copper-500/10"
          : "border-ink-700 hover:bg-ink-700/40"
      }`}
    >
      <span
        className={`mt-0.5 h-5 w-5 rounded-full border-2 shrink-0 flex items-center justify-center ${
          selected ? "border-copper-500" : "border-ink-600"
        }`}
      >
        {selected && (
          <span className="h-2.5 w-2.5 rounded-full bg-copper-500" />
        )}
      </span>
      <span className="min-w-0">
        <span className="flex items-center gap-2 flex-wrap">
          <span className="text-[15px] font-semibold">{title}</span>
          {badge && (
            <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-copper-500/15 text-copper-400">
              {badge}
            </span>
          )}
        </span>
        <span className="block text-xs text-ink-500 mt-1 leading-relaxed">
          {children}
        </span>
      </span>
    </button>
  );
}

function Info({ label, value, accent }) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-ink-500">{label}</p>
      <p
        className={`font-medium mt-0.5 break-words text-[15px] ${accent ? "text-copper-400 font-mono" : ""}`}
      >
        {value}
      </p>
    </div>
  );
}
