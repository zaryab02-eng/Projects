import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar.jsx'
import Footer from '../components/layout/Footer.jsx'
import Card from '../components/ui/Card.jsx'
import Input from '../components/ui/Input.jsx'
import Button from '../components/ui/Button.jsx'
import { resetPassword } from '../firebase/auth.js'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await resetPassword(email)
      setSent(true)
    } catch {
      setError('Could not send reset email. Check the address and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-ink-900">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <Card className="w-full max-w-sm p-6 sm:p-8">
          <h1 className="font-display text-2xl mb-1">Reset password</h1>
          <p className="text-ink-500 text-sm mb-6">We'll email you a link to reset it.</p>
          {sent ? (
            <p className="text-sm text-vitality-full bg-vitality-full/10 border border-vitality-full/30 rounded-lg p-3">
              Reset link sent to {email}. Check your inbox.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              {error && <p className="text-xs text-vitality-critical">{error}</p>}
              <Button type="submit" loading={loading} className="w-full">Send Reset Link</Button>
            </form>
          )}
          <Link to="/login" className="block text-center text-sm text-steel-300 hover:text-steel-200 mt-5">Back to login</Link>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
