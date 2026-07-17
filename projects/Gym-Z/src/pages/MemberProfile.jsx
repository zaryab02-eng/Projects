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
import RenewalHistory from "../components/members/RenewalHistory.jsx";
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
import {
  formatStreak,
  DEFAULT_GRACE_PERIOD_DAYS,
} from "../utils/streakUtils.js";

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
  const menuRef = useRef(null);

  const load = useCallback(async () => {
    const [m, r] = await Promise.all([
      getMember(gymId, memberId),
      getMemberRenewals(gymId, memberId),
    ]);
    setMember(m);
    setRenewals(r);
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

  const gracePeriodDays = gym?.gracePeriodDays ?? DEFAULT_GRACE_PERIOD_DAYS;
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
        await renewExpiredMembership(
          gymId,
          memberId,
          member,
          plan,
          gracePeriodDays,
        );
      } else if (renewMode === "extend") {
        await extendMembership(gymId, memberId, member, plan, gracePeriodDays);
      } else {
        await renewMembershipImmediately(
          gymId,
          memberId,
          member,
          plan,
          gracePeriodDays,
        );
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
  const streakLabel = formatStreak(member.streakDays);

  return (
    <AppShell>
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="font-display text-2xl sm:text-3xl">
              {member.fullName}
            </h1>
            {member.blacklisted && (
              <Badge variant="critical">Blacklisted</Badge>
            )}
          </div>
          <p className="text-ink-500 font-mono text-sm mt-1">{member.phone}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={openRenewModal}>
            Renew Membership
          </Button>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Member menu"
              aria-expanded={menuOpen}
              className="h-9 w-9 rounded-lg border border-ink-700 flex items-center justify-center hover:bg-ink-800 transition-colors"
            >
              ⋮
            </button>
            {menuOpen ? (
              <div className="absolute right-0 mt-2 w-48 rounded-lg border border-ink-700 bg-ink-800 shadow-card py-1 overflow-hidden z-10">
                {member.blacklisted ? (
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      handleUnblacklist();
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-ink-50 hover:bg-ink-700 transition-colors"
                  >
                    Remove from Blacklist
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      setBlacklistOpen(true);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-ink-50 hover:bg-ink-700 transition-colors"
                  >
                    Blacklist Member
                  </button>
                )}
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    setDeleteOpen(true);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-vitality-critical hover:bg-ink-700 transition-colors"
                >
                  Remove Member
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <Card className="p-5">
            <h2 className="font-display text-lg mb-4">Current Membership</h2>
            <ValidityBar
              joiningDate={member.joiningDate}
              expiryDate={member.expiryDate}
            />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 text-sm">
              <Info label="Plan" value={member.planName} />
              <Info
                label="Joined"
                value={formatDisplayDate(member.joiningDate)}
              />
              <Info
                label="Expires"
                value={formatDisplayDate(member.expiryDate)}
              />
              <Info
                label="Status"
                value={
                  remaining >= 0
                    ? `${remaining}d left`
                    : `${-remaining}d overdue`
                }
              />
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="font-display text-lg mb-4">
              Membership & Renewal History
            </h2>
            <RenewalHistory renewals={renewals} />
          </Card>
        </div>

        <div className="space-y-5">
          {member.scheduledMembership && (
            <Card className="p-4 border-copper-500/30 bg-copper-500/5">
              <p className="text-xs uppercase text-copper-400 mb-1">
                Next Membership Scheduled
              </p>
              <p className="text-sm font-semibold">
                {member.scheduledMembership.planName}
              </p>
              <p className="text-xs text-ink-500 font-mono mt-0.5">
                Starts {formatDisplayDate(member.scheduledMembership.startDate)}{" "}
                → Ends{" "}
                {formatDisplayDate(member.scheduledMembership.expiryDate)}
              </p>
            </Card>
          )}

          <Card className="p-5 text-center">
            <p className="text-xs uppercase text-ink-500 mb-2">
              Loyalty Streak
            </p>
            <p className="text-3xl font-mono font-bold text-copper-400">
              🔥 {streakLabel || "New Member"}
            </p>
          </Card>

          <Card className="p-5 text-center">
            <p className="text-xs uppercase text-ink-500 mb-2">
              Lifetime Amount Paid
            </p>
            <p className="text-3xl font-mono font-bold">
              ₹{member.lifetimeAmountPaid || 0}
            </p>
          </Card>

          <Card className="p-5">
            <h3 className="font-display text-base mb-3">
              Personal Information
            </h3>
            <div className="space-y-2 text-sm">
              <Info label="Alt Phone" value={member.altPhone || "—"} />
              <Info label="Age" value={member.age || "—"} />
              <Info label="Gender" value={member.gender || "—"} />
              <Info label="Address" value={member.address || "—"} />
              <Info label="Notes" value={member.notes || "—"} />
            </div>
          </Card>
        </div>
      </div>

      <Modal
        open={renewOpen}
        onClose={() => setRenewOpen(false)}
        title="Renew Membership"
      >
        <div className="space-y-4">
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
            <p className="text-xs text-ink-500 bg-ink-900/50 rounded-lg p-3">
              This membership has expired. The new plan will start{" "}
              <span className="text-ink-100 font-medium">today</span>.
            </p>
          ) : (
            <div className="space-y-2">
              <p className="text-xs uppercase text-ink-500">Renewal Mode</p>
              <button
                type="button"
                onClick={() => setRenewMode("extend")}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${renewMode === "extend" ? "border-copper-500 bg-copper-500/10" : "border-ink-700 hover:bg-ink-800"}`}
              >
                <p className="text-sm font-semibold">
                  Extend Current Membership{" "}
                  <span className="text-copper-400 text-xs">(Recommended)</span>
                </p>
                <p className="text-xs text-ink-500 mt-1">
                  Starts right after the current plan ends on{" "}
                  {formatDisplayDate(
                    member.scheduledMembership?.expiryDate || member.expiryDate,
                  )}
                  . No remaining days are lost.
                </p>
              </button>
              <button
                type="button"
                onClick={() => setRenewMode("immediate")}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${renewMode === "immediate" ? "border-copper-500 bg-copper-500/10" : "border-ink-700 hover:bg-ink-800"}`}
              >
                <p className="text-sm font-semibold">Start Immediately</p>
                <p className="text-xs text-ink-500 mt-1">
                  Ends the current plan today. Any remaining days are discarded.
                </p>
              </button>
            </div>
          )}

          <Button className="w-full" loading={submitting} onClick={handleRenew}>
            Confirm Renewal
          </Button>
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
      >
        <div className="space-y-4">
          <p className="text-sm text-ink-500">
            This will permanently delete{" "}
            <span className="font-semibold text-ink-100">
              {member.fullName}
            </span>
            , including their full renewal history and blacklist record. This
            cannot be undone.
          </p>
          <div className="flex gap-2">
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
              Delete Permanently
            </Button>
          </div>
        </div>
      </Modal>
    </AppShell>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-[11px] uppercase text-ink-500">{label}</p>
      <p className="font-medium mt-0.5 break-words">{value}</p>
    </div>
  );
}
