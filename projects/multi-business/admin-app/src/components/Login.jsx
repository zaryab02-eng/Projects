import { useState } from "react";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../firebase";
import { Spinner } from "./ui";

const errorText = (code = "") => {
  if (
    code.includes("invalid-credential") ||
    code.includes("wrong-password") ||
    code.includes("user-not-found")
  )
    return "Email or password is not correct.";
  if (code.includes("too-many-requests"))
    return "Too many attempts. Please wait a few minutes and try again.";
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
    if (!email.trim())
      return setError("Type your email first, then tap “Forgot password?”.");
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setInfo(
        "We sent you an email to reset your password. Please check your inbox and spam folder.",
      );
    } catch (err) {
      setError(errorText(err.code));
    }
  };

  return (
    <div className="safe-top flex min-h-full flex-col bg-ink px-6 text-paper">
      <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-10">
        <img
          src="/icon-192.png"
          alt=""
          className="mb-6 h-16 w-16 rounded-2xl"
        />
        <h1 className="text-4xl leading-tight">Website Admin</h1>
        <p className="mt-2 text-lg text-paper/80">
          Sign in to change your website.
        </p>

        <form onSubmit={submit} className="mt-8 space-y-5">
          <label className="block">
            <span className="mb-2 block text-base font-bold">Email</span>
            <input
              type="email"
              required
              autoComplete="email"
              inputMode="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-base font-bold">Password</span>
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input pr-24"
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute right-2 top-1/2 h-11 -translate-y-1/2 rounded-xl px-3 text-base font-bold text-brand-dark"
              >
                {show ? "Hide" : "Show"}
              </button>
            </div>
          </label>

          {error && (
            <p className="rounded-2xl bg-[#b4141a] px-4 py-3 text-base font-semibold text-white">
              {error}
            </p>
          )}
          {info && (
            <p className="rounded-2xl bg-brand-dark px-4 py-3 text-base font-semibold text-white">
              {info}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="btn w-full bg-brand text-ink hover:bg-white"
          >
            {busy ? <Spinner /> : "Sign in"}
          </button>
          <button
            type="button"
            onClick={reset}
            className="w-full py-3 text-base font-semibold text-paper/80 underline underline-offset-4"
          >
            Forgot password?
          </button>
        </form>
      </div>
    </div>
  );
}
