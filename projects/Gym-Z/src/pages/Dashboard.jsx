import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppShell from "../components/layout/AppShell.jsx";
import StatCard from "../components/dashboard/StatCard.jsx";
import ExpiryAttentionList from "../components/dashboard/ExpiryAttentionList.jsx";
import Spinner from "../components/ui/Spinner.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { subscribeToMembers } from "../firebase/firestore.js";
import { daysUntil } from "../utils/dateUtils.js";
import { getEffectiveExpiryDate } from "../utils/membershipUtils.js";

export default function Dashboard() {
  const { gymId, gym } = useAuth();
  const navigate = useNavigate();
  const [members, setMembers] = useState(null);

  useEffect(() => {
    if (!gymId) return;
    const unsub = subscribeToMembers(gymId, setMembers);
    return unsub;
  }, [gymId]);

  const stats = useMemo(() => {
    if (!members) return null;
    // Blacklisted members are on a separate track — they don't count toward
    // Active/Expiring/Expired.
    const nonBlacklisted = members.filter((m) => !m.blacklisted);

    const total = members.length;
    const active = nonBlacklisted.filter(
      (m) => daysUntil(getEffectiveExpiryDate(m)) >= 0,
    ).length;
    const expiringSoon = nonBlacklisted.filter((m) => {
      const d = daysUntil(getEffectiveExpiryDate(m));
      return d >= 0 && d <= 7;
    }).length;
    const expired = nonBlacklisted.filter(
      (m) => daysUntil(getEffectiveExpiryDate(m)) < 0,
    ).length;
    const blacklisted = members.filter((m) => m.blacklisted).length;
    return { total, active, expiringSoon, expired, blacklisted };
  }, [members]);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const attentionCount = stats ? stats.expired + stats.expiringSoon : 0;

  return (
    <AppShell>
      <div className="mb-7 sm:mb-9">
        <p className="text-sm font-medium text-ink-500">{today}</p>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mt-1">
          Welcome back{gym?.ownerName ? `, ${gym.ownerName.split(" ")[0]}` : ""}
        </h1>
        <p className="text-ink-500 text-[15px] mt-1.5">
          {gym?.gymName} · {gym?.city}, {gym?.state}
        </p>
      </div>

      {!members ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 mb-10">
            <StatCard
              featured
              className="col-span-2 sm:col-span-4 lg:col-span-1"
              label="Total Members"
              value={stats.total}
              icon="users"
              onClick={() => navigate("/members")}
            />
            <StatCard
              label="Active"
              value={stats.active}
              tone="copper"
              icon="check"
              onClick={() => navigate("/members?filter=active")}
            />
            <StatCard
              label="Expiring Soon"
              value={stats.expiringSoon}
              tone="warn"
              icon="clock"
              onClick={() => navigate("/members?filter=expiring")}
            />
            <StatCard
              label="Expired"
              value={stats.expired}
              tone="critical"
              icon="alert"
              onClick={() => navigate("/members?filter=expired")}
            />
            <StatCard
              label="Blacklisted"
              value={stats.blacklisted}
              tone="steel"
              icon="ban"
              onClick={() => navigate("/blacklist")}
            />
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-semibold tracking-tight">
                Needs Attention
              </h2>
              {attentionCount > 0 && (
                <span className="text-xs font-semibold font-mono px-2 py-0.5 rounded-full bg-copper-500/15 text-copper-400">
                  {attentionCount}
                </span>
              )}
            </div>
            <Link
              to="/members"
              className="text-sm font-medium text-copper-400 hover:underline"
            >
              See all
            </Link>
          </div>
          {/* Blacklisted members don't need renewal attention either */}
          <ExpiryAttentionList
            members={members.filter((m) => !m.blacklisted)}
          />
        </>
      )}
    </AppShell>
  );
}
