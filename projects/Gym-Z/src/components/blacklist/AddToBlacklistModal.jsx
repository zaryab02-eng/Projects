import { useState } from 'react'
import Modal from '../ui/Modal.jsx'
import Input from '../ui/Input.jsx'
import Button from '../ui/Button.jsx'

export default function AddToBlacklistModal({ open, onClose, onSubmit, submitting }) {
  const [reason, setReason] = useState('')
  const [notes, setNotes] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ reason, notes })
    setReason(''); setNotes('')
  }

  return (
    <Modal open={open} onClose={onClose} title="Add to Blacklist">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Reason" required placeholder="e.g. Payment dispute" value={reason} onChange={(e) => setReason(e.target.value)} />
        <Input label="Notes" placeholder="Optional" value={notes} onChange={(e) => setNotes(e.target.value)} />
        <Button type="submit" variant="danger" loading={submitting} className="w-full">Add to Blacklist</Button>
      </form>
    </Modal>
  )
}
