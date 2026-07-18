// Instant search stays fast at scale by filtering the already-subscribed
// in-memory member list (Firestore onSnapshot keeps it live) rather than
// issuing a new query per keystroke.
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import AppShell from "../components/layout/AppShell.jsx";
import MemberListItem from "../components/members/MemberListItem.jsx";
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

const SORT_OPTIONS = [
  { value: "urgency", label: "Needs Attention" },
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
];

export default function Members() {
  const { gymId } = useAuth();
  const [members, setMembers] = useState(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("urgency");
  const [searchParams, setSearchParams] = useSearchParams();
  const filter = searchParams.get("filter") || "";

  useEffect(() => {
    if (!gymId) return;
    return subscribeToMembers(gymId, setMembers);
  }, [gymId]);

  const filtered = useMemo(() => {
    if (!members) return [];

    let list = members;
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

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (m) => m.fullName?.toLowerCase().includes(q) || m.phone?.includes(q),
      );
    }

    // joiningDate is a plain "YYYY-MM-DD" string, so lexical comparison
    // sorts chronologically without needing to parse Date objects.
    if (sortBy === "newest") {
      list = [...list].sort((a, b) =>
        (b.joiningDate || "").localeCompare(a.joiningDate || ""),
      );
    } else if (sortBy === "oldest") {
      list = [...list].sort((a, b) =>
        (a.joiningDate || "").localeCompare(b.joiningDate || ""),
      );
    } else {
      list = sortByUrgency(list);
    }

    return list;
  }, [members, search, filter, sortBy]);

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

      <div className="flex items-center gap-2 mb-6">
        <Input
          placeholder="Search by name or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
        {/* Small native select, not the shared <Select> component —
            keeps this compact and inline instead of full-width with a
            label block, which is how <Select> renders everywhere else. */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          aria-label="Sort members"
          className="shrink-0 bg-ink-900 border border-ink-600 rounded-lg pl-3 pr-7 py-2.5 text-xs font-medium text-ink-50 focus:border-copper-500 focus:ring-1 focus:ring-copper-500 outline-none appearance-none bg-no-repeat bg-[right_0.5rem_center] bg-[length:14px]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E\")",
          }}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {!members ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-center text-ink-500 py-16 text-sm">
          No members found.
        </p>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((m) => (
            <MemberListItem key={m.id} member={m} />
          ))}
        </div>
      )}
    </AppShell>
  );
}
