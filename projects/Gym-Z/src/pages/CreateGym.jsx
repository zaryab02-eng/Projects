// Gym onboarding: sign in with Google, then collect gym profile details
// and create the Firestore workspace document.
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar.jsx";
import Footer from "../components/layout/Footer.jsx";
import Card from "../components/ui/Card.jsx";
import Input from "../components/ui/Input.jsx";
import Button from "../components/ui/Button.jsx";
import {
  signInWithGoogle,
  completeGoogleRedirectSignIn,
  getGoogleAuthErrorMessage,
} from "../firebase/auth.js";
import { createGymDoc } from "../firebase/firestore.js";
import { updateProfile } from "firebase/auth";
import { useAuth } from "../context/AuthContext.jsx";

const STEPS = { AUTH: "auth", DETAILS: "details" };

export default function CreateGym() {
  const navigate = useNavigate();
  const { user, gym, loading: authLoading, refreshGym } = useAuth();
  const [step, setStep] = useState(STEPS.AUTH);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    gymName: "",
    ownerName: "",
    phone: "",
    city: "",
    state: "",
    shortAddress: "",
  });
  const handleField = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const result = await completeGoogleRedirectSignIn();
        if (cancelled || !result?.user) return;
        setForm((f) => ({
          ...f,
          ownerName: f.ownerName || result.user.displayName || "",
        }));
      } catch (err) {
        if (!cancelled) {
          console.error("Google redirect sign-in failed:", err);
          setError(getGoogleAuthErrorMessage(err));
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (user && gym) {
      navigate("/dashboard");
      return;
    }
    if (user) {
      setStep(STEPS.DETAILS);
      setForm((f) => ({
        ...f,
        ownerName: f.ownerName || user.displayName || "",
      }));
    }
  }, [user, gym, authLoading, navigate]);

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error("Google sign-in failed:", err);
      setError(getGoogleAuthErrorMessage(err));
      setLoading(false);
    }
  };

  const handleCreateGym = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const ownerUid = user?.uid;
      if (!ownerUid) {
        setError("Please sign in with Google first.");
        return;
      }
      if (user) {
        await updateProfile(user, { displayName: form.ownerName });
      }
      await createGymDoc(ownerUid, {
        gymName: form.gymName,
        ownerName: form.ownerName,
        ownerEmail: user?.email || "",
        phone: form.phone.trim(),
        phoneVerified: false,
        city: form.city,
        state: form.state,
        shortAddress: form.shortAddress,
        activeMemberCount: 0,
      });
      await refreshGym();
      navigate("/dashboard");
    } catch (err) {
      setError("Could not create the gym account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-ink-900">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-ink-500 text-sm">Loading…</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-ink-900">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <Card className="w-full max-w-md p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-6">
            {[STEPS.AUTH, STEPS.DETAILS].map((s, i) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full ${
                  [STEPS.AUTH, STEPS.DETAILS].indexOf(step) >= i
                    ? "bg-copper-500"
                    : "bg-ink-700"
                }`}
              />
            ))}
          </div>

          {step === STEPS.AUTH && (
            <>
              <h1 className="font-display text-2xl mb-1">Create your gym</h1>
              <p className="text-ink-500 text-sm mb-6">
                Sign in with Google to get started. We'll ask for your gym
                details next.
              </p>
              <div className="space-y-4">
                <Button
                  type="button"
                  variant="secondary"
                  loading={loading}
                  className="w-full"
                  onClick={handleGoogleSignIn}
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </Button>
                {error && (
                  <p className="text-xs text-vitality-critical">{error}</p>
                )}
              </div>
            </>
          )}

          {step === STEPS.DETAILS && (
            <>
              <h1 className="font-display text-2xl mb-1">Set up your gym</h1>
              <p className="text-ink-500 text-sm mb-6">
                Signed in as {user?.email}. Just a few more details.
              </p>
              <form onSubmit={handleCreateGym} className="space-y-4">
                <Input
                  label="Gym Name"
                  required
                  value={form.gymName}
                  onChange={handleField("gymName")}
                />
                <Input
                  label="Owner Name"
                  required
                  value={form.ownerName}
                  onChange={handleField("ownerName")}
                />
                <Input
                  label="Contact Phone (optional)"
                  value={form.phone}
                  onChange={handleField("phone")}
                  placeholder="+91XXXXXXXXXX"
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="City"
                    required
                    value={form.city}
                    onChange={handleField("city")}
                  />
                  <Input
                    label="State"
                    required
                    value={form.state}
                    onChange={handleField("state")}
                  />
                </div>
                <Input
                  label="Short Address"
                  required
                  value={form.shortAddress}
                  onChange={handleField("shortAddress")}
                />
                {error && (
                  <p className="text-xs text-vitality-critical">{error}</p>
                )}
                <Button type="submit" loading={loading} className="w-full">
                  Create Gym Account
                </Button>
              </form>
            </>
          )}
        </Card>
      </main>
      <Footer />
    </div>
  );
}
