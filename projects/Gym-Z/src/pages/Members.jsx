// Instant search stays fast at scale by filtering the already-subscribed
// in-memory member list (Firestore onSnapshot keeps it live) rather than
// issuing a new query per keystroke.
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import AppShell from "../components/layout/AppShell.jsx";
import MemberCard from "../components/members/MemberCard.jsx";
import Input from "../components/ui/Input.jsx";
import Button from "../components/ui/Button.jsx";
import Spinner from "../components/ui/Spinner.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { subscribeToMembers } from "../firebase/firestore.js";
import {
  sortByUrgency,
  getEffectiveExpiryDate,
} from "../utils/membershipUtils.js";
import { daysUntil } from "../utils/dateUtils.js";

const FILTER_LABELS = {
  active: "Active",
  expiring: "Expiring Soon",
  expired: "Expired",
};

export default function Members() {
  const { gymId } = useAuth();
  const [members, setMembers] = useState(null);
  const [search, setSearch] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const filter = searchParams.get("filter") || "";

  useEffect(() => {
    if (!gymId) return;
    return subscribeToMembers(gymId, setMembers);
  }, [gymId]);

  const filtered = useMemo(() => {
    if (!members) return [];
    let list = sortByUrgency(members);

    // Active / Expiring / Expired filters mirror the Dashboard's stat
    // cards: blacklisted members are excluded, since they're on a
    // separate track and shouldn't appear as needing renewal attention.
    if (filter === "active") {
      list = list.filter(
        (m) => !m.blacklisted && daysUntil(getEffectiveExpiryDate(m)) >= 0,
      );
    } else if (filter === "expiring") {
      list = list.filter((m) => {
        if (m.blacklisted) return false;
        const d = daysUntil(getEffectiveExpiryDate(m));
        return d >= 0 && d <= 7;
      });
    } else if (filter === "expired") {
      list = list.filter(
        (m) => !m.blacklisted && daysUntil(getEffectiveExpiryDate(m)) < 0,
      );
    }

    if (!search.trim()) return list;
    const q = search.trim().toLowerCase();
    return list.filter(
      (m) => m.fullName?.toLowerCase().includes(q) || m.phone?.includes(q),
    );
  }, [members, search, filter]);

  const clearFilter = () => setSearchParams({});

  return (
    <AppShell>
      <div className="flex items-center justify-between mb-5 gap-3">
        <h1 className="font-display text-2xl sm:text-3xl">Members</h1>
        <Link to="/members/add">
          <Button size="sm">+ Add Member</Button>
        </Link>
      </div>

      {filter && FILTER_LABELS[filter] ? (
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-semibold uppercase tracking-wide text-copper-400 bg-copper-500/10 px-3 py-1.5 rounded-full">
            {FILTER_LABELS[filter]}
          </span>
          <button
            onClick={clearFilter}
            className="text-xs font-semibold text-ink-500 hover:text-ink-50"
          >
            Clear filter
          </button>
        </div>
      ) : null}

      <Input
        placeholder="Search by name or phone..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6"
      />

      {!members ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-center text-ink-500 py-16 text-sm">
          No members found.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((m) => (
            <MemberCard key={m.id} member={m} />
          ))}
        </div>
      )}
    </AppShell>
  );
}
