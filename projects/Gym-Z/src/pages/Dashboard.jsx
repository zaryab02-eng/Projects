import { useEffect, useMemo, useState } from 'react'
import AppShell from '../components/layout/AppShell.jsx'
import StatCard from '../components/dashboard/StatCard.jsx'
import ExpiryAttentionList from '../components/dashboard/ExpiryAttentionList.jsx'
import Spinner from '../components/ui/Spinner.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { subscribeToMembers } from '../firebase/firestore.js'
import { daysUntil } from '../utils/dateUtils.js'

export default function Dashboard() {
  const { gymId, gym } = useAuth()
  const [members, setMembers] = useState(null)

  useEffect(() => {
    if (!gymId) return
    const unsub = subscribeToMembers(gymId, setMembers)
    return unsub
  }, [gymId])

  const stats = useMemo(() => {
    if (!members) return null
    const total = members.length
    const active = members.filter((m) => daysUntil(m.expiryDate) >= 0).length
    const expiringSoon = members.filter((m) => { const d = daysUntil(m.expiryDate); return d >= 0 && d <= 7 }).length
    const expired = members.filter((m) => daysUntil(m.expiryDate) < 0).length
    const blacklisted = members.filter((m) => m.blacklisted).length
    return { total, active, expiringSoon, expired, blacklisted }
  }, [members])

  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="font-display text-2xl sm:text-3xl">Welcome back{gym?.ownerName ? `, ${gym.ownerName.split(' ')[0]}` : ''}</h1>
        <p className="text-ink-500 text-sm mt-1">{gym?.gymName} · {gym?.city}, {gym?.state}</p>
      </div>

      {!members ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
            <StatCard label="Total Members" value={stats.total} icon="👥" />
            <StatCard label="Active" value={stats.active} tone="copper" icon="✅" />
            <StatCard label="Expiring Soon" value={stats.expiringSoon} tone="warn" icon="⏰" />
            <StatCard label="Expired" value={stats.expired} tone="critical" icon="⚠️" />
            <StatCard label="Blacklisted" value={stats.blacklisted} tone="steel" icon="🚫" />
          </div>

          <h2 className="font-display text-lg mb-3">Needs Attention</h2>
          <ExpiryAttentionList members={members} />
        </>
      )}
    </AppShell>
  )
}
