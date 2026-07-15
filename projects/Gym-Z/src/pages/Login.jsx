import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar.jsx";
import Footer from "../components/layout/Footer.jsx";
import Card from "../components/ui/Card.jsx";
import Input from "../components/ui/Input.jsx";
import Button from "../components/ui/Button.jsx";
import { loginWithEmail } from "../firebase/auth.js";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await loginWithEmail(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-ink-900">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <Card className="w-full max-w-sm p-6 sm:p-8">
          <h1 className="font-display text-2xl mb-1">Welcome back</h1>
          <p className="text-ink-500 text-sm mb-6">
            Log in to your gym's workspace.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="owner@gym.com"
            />
            <Input
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
            {error && <p className="text-xs text-vitality-critical">{error}</p>}
            <Button type="submit" loading={loading} className="w-full">
              Login
            </Button>
          </form>
          <div className="flex justify-between mt-5 text-sm">
            <Link
              to="/forgot-password"
              className="text-steel-300 hover:text-steel-200"
            >
              Forgot password?
            </Link>
            <Link
              to="/create-gym"
              className="text-copper-400 hover:text-copper-300"
            >
              Create gym
            </Link>
          </div>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
