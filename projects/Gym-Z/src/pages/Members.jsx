// Instant search stays fast at scale by filtering the already-subscribed
// in-memory member list (Firestore onSnapshot keeps it live) rather than
// issuing a new query per keystroke.
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import AppShell from '../components/layout/AppShell.jsx'
import MemberCard from '../components/members/MemberCard.jsx'
import Input from '../components/ui/Input.jsx'
import Button from '../components/ui/Button.jsx'
import Spinner from '../components/ui/Spinner.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { subscribeToMembers } from '../firebase/firestore.js'
import { sortByUrgency } from '../utils/membershipUtils.js'

export default function Members() {
  const { gymId } = useAuth()
  const [members, setMembers] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!gymId) return
    return subscribeToMembers(gymId, setMembers)
  }, [gymId])

  const filtered = useMemo(() => {
    if (!members) return []
    const sorted = sortByUrgency(members)
    if (!search.trim()) return sorted
    const q = search.trim().toLowerCase()
    return sorted.filter((m) => m.fullName?.toLowerCase().includes(q) || m.phone?.includes(q))
  }, [members, search])

  return (
    <AppShell>
      <div className="flex items-center justify-between mb-5 gap-3">
        <h1 className="font-display text-2xl sm:text-3xl">Members</h1>
        <Link to="/members/add"><Button size="sm">+ Add Member</Button></Link>
      </div>

      <Input
        placeholder="Search by name or phone..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6"
      />

      {!members ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : filtered.length === 0 ? (
        <p className="text-center text-ink-500 py-16 text-sm">No members found.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((m) => <MemberCard key={m.id} member={m} />)}
        </div>
      )}
    </AppShell>
  )
}
