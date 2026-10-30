// Instant search stays fast at scale by filtering the already-subscribed
// in-memory member list (Firestore onSnapshot keeps it live) rather than
// issuing a new query per keystroke.
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import AppShell from "../components/layout/AppShell.jsx";
import MemberListItem from "../components/members/MemberListItem.jsx";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import Icon from "../components/ui/Icon.jsx";
import Spinner from "../components/ui/Spinner.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { subscribeToMembers } from "../firebase/firestore.js";
import {
  sortByUrgency,
  getEffectiveExpiryDate,
} from "../utils/membershipUtils.js";
import { daysUntil } from "../utils/dateUtils.js";
import { downloadMembersListPdf } from "../utils/pdfUtils.js";

const FILTER_LABELS = {
  active: "Active",
  expiring: "Expiring Soon",
  expired: "Expired",
};

const FILTER_CHIPS = [
  { key: "", label: "All" },
  { key: "active", label: "Active" },
  { key: "expiring", label: "Expiring" },
  { key: "expired", label: "Expired" },
];

const SORT_OPTIONS = [
  { value: "urgency", label: "Needs Attention" },
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
];

export default function Members() {
  const { gymId, gym } = useAuth();
  const [members, setMembers] = useState(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("urgency");
  const [downloading, setDownloading] = useState(false);
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

  const setFilter = (key) => setSearchParams(key ? { filter: key } : {});

  // Exports exactly what is on screen (current filter + search + sort).
  const handleDownloadPdf = async () => {
    if (!filtered.length) return;
    setDownloading(true);
    try {
      await downloadMembersListPdf(
        filtered,
        gym?.gymName || "Gym-Z",
        filter && FILTER_LABELS[filter] ? FILTER_LABELS[filter] : "All Members",
      );
    } catch (error) {
      console.error("PDF export failed:", error);
      alert("Could not create the PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <AppShell>
      <div className="flex items-end justify-between mb-6 gap-3">
        <div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            Members
          </h1>
          <p className="text-sm text-ink-500 mt-1">
            {members
              ? `${filtered.length} ${filtered.length === 1 ? "member" : "members"}`
              : "Loading…"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            loading={downloading}
            disabled={!filtered.length}
            onClick={handleDownloadPdf}
          >
            {!downloading && <Icon name="file" size={15} />}
            PDF
          </Button>
          <Link to="/members/add">
            <Button size="sm">
              <Icon name="plus" size={15} strokeWidth={2.4} />
              <span>
                Add<span className="hidden sm:inline"> Member</span>
              </span>
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <div className="relative flex-1 min-w-0">
          <Icon
            name="search"
            size={17}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500 pointer-events-none"
          />
          <input
            type="search"
            placeholder="Search name or phone"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 rounded-xl bg-ink-800 border border-ink-700/60 pl-10 pr-4 text-[15px] placeholder:text-ink-500 outline-none focus:border-copper-500 focus:ring-4 focus:ring-copper-500/15 transition"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          aria-label="Sort members"
          className="select-chevron shrink-0 h-11 rounded-xl bg-ink-800 border border-ink-700/60 pl-3.5 text-[13px] font-medium text-ink-50 outline-none focus:border-copper-500 focus:ring-4 focus:ring-copper-500/15 transition"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 mb-5 pb-1">
        {FILTER_CHIPS.map((chip) => {
          const active = (filter || "") === chip.key;
          return (
            <button
              key={chip.key || "all"}
              onClick={() => setFilter(chip.key)}
              className={`shrink-0 h-9 px-4 rounded-full text-[13px] font-semibold transition-colors ${
                active
                  ? "bg-ink-50 text-ink-900"
                  : "bg-ink-800 border border-ink-700/60 text-ink-300 hover:text-ink-50"
              }`}
            >
              {chip.label}
            </button>
          );
        })}
      </div>

      {!members ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : filtered.length === 0 ? (
        <Card className="py-16 px-6 text-center">
          <div className="h-12 w-12 rounded-full bg-ink-700 text-ink-500 flex items-center justify-center mx-auto mb-3">
            <Icon name="users" size={22} />
          </div>
          <p className="font-semibold">No members found</p>
          <p className="text-sm text-ink-500 mt-1">
            Try a different search or filter.
          </p>
        </Card>
      ) : (
        <Card className="overflow-hidden divide-y divide-ink-700/60">
          {filtered.map((m) => (
            <MemberListItem key={m.id} member={m} />
          ))}
        </Card>
      )}
    </AppShell>
  );
}
