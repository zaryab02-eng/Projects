import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/layout/AppShell.jsx";
import Card from "../components/ui/Card.jsx";
import MemberForm from "../components/members/MemberForm.jsx";
import DuplicateMemberModal from "../components/members/DuplicateMemberModal.jsx";
import PlanFormModal from "../components/plans/PlanFormModal.jsx";
import Spinner from "../components/ui/Spinner.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import {
  subscribeToPlans,
  findMemberByPhone,
  addMember,
  addPlan,
  renewExpiredMembership,
  extendMembership,
} from "../firebase/firestore.js";
import { addDays, daysUntil } from "../utils/dateUtils.js";
import { DEFAULT_GRACE_PERIOD_DAYS } from "../utils/streakUtils.js";

export default function AddMember() {
  const { gymId, gym } = useAuth();
  const navigate = useNavigate();
  const [plans, setPlans] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [duplicate, setDuplicate] = useState(null);
  const [pendingValues, setPendingValues] = useState(null);
  const [creatingPlan, setCreatingPlan] = useState(false);

  useEffect(() => {
    if (!gymId) return;
    return subscribeToPlans(gymId, setPlans);
  }, [gymId]);

  // No plans exist yet: this becomes true, which opens the New Plan modal
  // below automatically. Once a plan is created, the live subscription
  // updates `plans` and this flips back to false on its own, closing the
  // modal and revealing the actual Add Member form — no extra step needed.
  const noPlansYet = plans !== null && plans.length === 0;

  const handleCreatePlan = async (values) => {
    setCreatingPlan(true);
    try {
      await addPlan(gymId, values);
    } finally {
      setCreatingPlan(false);
    }
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    setPendingValues(values);
    try {
      const existing = await findMemberByPhone(gymId, values.phone.trim());
      if (existing) {
        setDuplicate(existing);
        setSubmitting(false);
        return;
      }
      const plan = plans.find((p) => p.id === values.planId);
      const expiryDate = addDays(values.joiningDate, plan.durationDays);
      await addMember(gymId, { ...values, expiryDate });
      navigate("/members");
    } catch (err) {
      alert("Could not add member. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRenewFromDuplicate = async (member) => {
    const plan = plans.find((p) => p.id === pendingValues.planId);
    const gracePeriodDays = gym?.gracePeriodDays ?? DEFAULT_GRACE_PERIOD_DAYS;
    const isExpired = daysUntil(member.expiryDate) < 0;

    if (isExpired) {
      await renewExpiredMembership(
        gymId,
        member.id,
        member,
        plan,
        gracePeriodDays,
      );
    } else {
      // Existing member's membership is still active: default to Extend
      // (no days lost) rather than silently discarding remaining coverage.
      await extendMembership(gymId, member.id, member, plan, gracePeriodDays);
    }
    navigate(`/members/${member.id}`);
  };

  return (
    <AppShell>
      <h1 className="font-display text-2xl sm:text-3xl mb-6">Add Member</h1>
      {!plans ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : noPlansYet ? (
        <Card className="p-6 text-center text-ink-500 text-sm">
          You need at least one membership plan before adding members.
        </Card>
      ) : (
        <Card className="p-5 sm:p-6 max-w-2xl">
          <MemberForm
            plans={plans}
            onSubmit={handleSubmit}
            onCancel={() => navigate("/members")}
            submitting={submitting}
          />
        </Card>
      )}

      <PlanFormModal
        open={noPlansYet}
        onClose={() => navigate("/members")}
        onSubmit={handleCreatePlan}
        initialValues={null}
        submitting={creatingPlan}
        cancelLabel="Cancel"
      />

      <DuplicateMemberModal
        member={duplicate}
        open={!!duplicate}
        onClose={() => setDuplicate(null)}
        onRenew={handleRenewFromDuplicate}
      />
    </AppShell>
  );
}
