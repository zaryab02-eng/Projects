import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar.jsx";
import Footer from "../components/layout/Footer.jsx";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import {
  signInWithGoogle,
  completeGoogleRedirectSignIn,
  routeAfterGoogleSignIn,
  getGoogleAuthErrorMessage,
} from "../firebase/auth.js";

export default function Login() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const result = await completeGoogleRedirectSignIn();
        if (cancelled || !result?.user) return;
        await routeAfterGoogleSignIn(result.user, navigate);
      } catch (err) {
        if (!cancelled) {
          console.error("Google redirect sign-in failed:", err);
          setError(getGoogleAuthErrorMessage(err));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

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

  return (
    <div className="min-h-screen flex flex-col bg-ink-900">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <Card className="w-full max-w-sm p-6 sm:p-8">
          <h1 className="font-display text-2xl mb-1">Welcome back</h1>
          <p className="text-ink-500 text-sm mb-6">
            Sign in with your Google account to manage your gym.
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
        </Card>
      </main>
      <Footer />
    </div>
  );
}
