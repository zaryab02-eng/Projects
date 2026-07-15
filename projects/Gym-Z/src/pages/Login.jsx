import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar.jsx";
import Footer from "../components/layout/Footer.jsx";
import Card from "../components/ui/Card.jsx";
import Input from "../components/ui/Input.jsx";
import Button from "../components/ui/Button.jsx";
import { sendOtp, confirmOtp } from "../firebase/auth.js";
import { getOwnerPrimaryGym } from "../firebase/firestore.js";
import { auth } from "../firebase/config.js";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const normalizePhoneNumber = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return "";
    if (/^\+/.test(trimmed)) return trimmed;
    if (/^0[0-9]{10}$/.test(trimmed)) return `+91${trimmed.slice(1)}`;
    if (/^[0-9]{10}$/.test(trimmed)) return `+91${trimmed}`;
    return trimmed;
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const normalizedPhone = normalizePhoneNumber(phone);
      setPhone(normalizedPhone);
      const result = await sendOtp(normalizedPhone, "recaptcha-container");
      setConfirmationResult(result);
      setOtp("");
    } catch (err) {
      setError(
        err?.code === "auth/invalid-phone-number"
          ? "Please use a valid international number such as +91XXXXXXXXXX."
          : "Could not send OTP. Check the phone number and Firebase phone-auth settings.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await confirmOtp(confirmationResult, otp);
      const user = auth.currentUser;
      if (user) {
        const gym = await getOwnerPrimaryGym(user.uid);
        navigate(gym ? "/dashboard" : "/create-gym");
      } else {
        navigate("/create-gym");
      }
    } catch {
      setError("Incorrect OTP. Please try again.");
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
            Sign in with your phone number and OTP.
          </p>
          {!confirmationResult ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <Input
                label="Phone Number"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91XXXXXXXXXX"
              />
              {error && (
                <p className="text-xs text-vitality-critical">{error}</p>
              )}
              <div id="recaptcha-container" />
              <Button type="submit" loading={loading} className="w-full">
                Send OTP
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <Input
                label="OTP"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                maxLength={6}
              />
              {error && (
                <p className="text-xs text-vitality-critical">{error}</p>
              )}
              <Button type="submit" loading={loading} className="w-full">
                Verify OTP
              </Button>
            </form>
          )}
        </Card>
      </main>
      <Footer />
    </div>
  );
}
