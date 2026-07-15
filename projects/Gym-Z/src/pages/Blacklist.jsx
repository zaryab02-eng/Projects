import { useEffect, useState } from 'react'
import AppShell from '../components/layout/AppShell.jsx'
import BlacklistEntryCard from '../components/blacklist/BlacklistEntryCard.jsx'
import Spinner from '../components/ui/Spinner.jsx'
import Card from '../components/ui/Card.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { subscribeToBlacklist, subscribeToMembers, removeFromBlacklist } from '../firebase/firestore.js'

export default function Blacklist() {
  const { gymId } = useAuth()
  const [entries, setEntries] = useState(null)
  const [members, setMembers] = useState([])

  useEffect(() => { if (gymId) return subscribeToBlacklist(gymId, setEntries) }, [gymId])
  useEffect(() => { if (gymId) return subscribeToMembers(gymId, setMembers) }, [gymId])

  const memberMap = Object.fromEntries(members.map((m) => [m.id, m]))

  const handleRemove = async (entry) => {
    if (confirm('Remove this member from the blacklist?')) {
      await removeFromBlacklist(gymId, entry.id, entry.memberId)
    }
  }

  return (
    <AppShell>
      <h1 className="font-display text-2xl sm:text-3xl mb-6">Blacklist</h1>
      {!entries ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : entries.length === 0 ? (
        <Card className="p-10 text-center text-ink-500 text-sm">
          No blacklisted members. Blacklist entries are added from a member's profile page.
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {entries.map((e) => (
            <BlacklistEntryCard key={e.id} entry={e} member={memberMap[e.memberId]} onRemove={handleRemove} />
          ))}
        </div>
      )}
    </AppShell>
  )
}
