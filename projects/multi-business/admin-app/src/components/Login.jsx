import { useState } from "react";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { Eye, EyeOff } from "lucide-react";
import { auth } from "../firebase";
import { Spinner } from "./ui";

const errorText = (code = "") => {
  if (code.includes("invalid-credential") || code.includes("wrong-password") || code.includes("user-not-found"))
    return "Email or password is not correct.";
  if (code.includes("too-many-requests")) return "Too many attempts. Please wait a few minutes and try again.";
  if (code.includes("network")) return "No internet connection.";
  return "Could not sign in. Please try again.";
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    setInfo("");
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (err) {
      setError(errorText(err.code));
    } finally {
      setBusy(false);
    }
  };

  const reset = async () => {
    setError("");
    setInfo("");
    if (!email.trim()) return setError("Type your email above first, then tap “Forgot password”.");
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setInfo("Password reset email sent. Check your inbox (and spam folder).");
    } catch (err) {
      setError(errorText(err.code));
    }
  };

  return (
    <div className="safe-top flex min-h-full flex-col bg-ink px-6 text-paper">
      <div className="flex flex-1 flex-col justify-center py-10">
        <img src="/icon-192.png" alt="" className="mb-8 h-16 w-16 rounded-2xl" />
        <h1 className="text-4xl leading-tight">Website Admin</h1>
        <p className="mt-2 text-paper/65">Sign in to update your website’s products and gallery.</p>

        <form onSubmit={submit} className="mt-9 space-y-4">
          <input
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3.5 text-paper outline-none placeholder:text-paper/40 focus:border-brand"
          />
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              required
              autoComplete="current-password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3.5 pr-12 text-paper outline-none placeholder:text-paper/40 focus:border-brand"
            />
            <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"}
              className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center text-paper/60">
              {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          {error && <p className="rounded-xl bg-rose/15 px-4 py-3 text-sm text-[#ffb3b6]">{error}</p>}
          {info && <p className="rounded-xl bg-brand/20 px-4 py-3 text-sm text-[#bfeff2]">{info}</p>}

          <button type="submit" disabled={busy} className="btn-rose w-full">
            {busy ? <Spinner /> : "Sign in"}
          </button>
          <button type="button" onClick={reset} className="w-full py-2 text-sm text-paper/65 underline-offset-4 hover:underline">
            Forgot password?
          </button>
        </form>
      </div>
    </div>
  );
}
