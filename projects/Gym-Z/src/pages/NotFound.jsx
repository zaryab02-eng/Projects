import { Link } from 'react-router-dom'
import Button from '../components/ui/Button.jsx'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-ink-900 text-center px-4">
      <p className="font-mono text-copper-400 text-sm mb-2">404</p>
      <h1 className="font-display text-2xl mb-4">Page not found</h1>
      <Link to="/"><Button>Back to Home</Button></Link>
    </div>
  )
}
