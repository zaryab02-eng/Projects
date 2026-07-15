// Two-step registration: (1) verify the owner's phone number via Firebase
// Phone Auth OTP, (2) collect the rest of the gym profile and create the
// account + the gym's Firestore workspace document.
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar.jsx";
import Footer from "../components/layout/Footer.jsx";
import Card from "../components/ui/Card.jsx";
import Input from "../components/ui/Input.jsx";
import Button from "../components/ui/Button.jsx";
import { sendOtp, confirmOtp, registerWithEmail } from "../firebase/auth.js";
import { createGymDoc } from "../firebase/firestore.js";
import { updateProfile } from "firebase/auth";

const STEPS = { PHONE: "phone", OTP: "otp", DETAILS: "details" };

export default function CreateGym() {
  const navigate = useNavigate();
  const [step, setStep] = useState(STEPS.PHONE);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    gymName: "",
    ownerName: "",
    email: "",
    password: "",
    city: "",
    state: "",
    shortAddress: "",
  });
  const handleField = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

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
      setStep(STEPS.OTP);
    } catch (err) {
      console.error("OTP send failed:", err);
      const message =
        err?.code === "auth/invalid-phone-number"
          ? "Please use a valid international number such as +91XXXXXXXXXX."
          : err?.code === "auth/operation-not-allowed"
            ? "Firebase is blocking SMS for this project. In the Firebase Console, enable Phone Authentication and make sure your project region allows SMS sending."
            : "Could not send OTP. Check the phone number and make sure phone auth is enabled in Firebase.";
      setError(message);
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
      setStep(STEPS.DETAILS);
    } catch (err) {
      setError("Incorrect OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGym = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // NOTE: the phone-auth sign-in above proves ownership of the number
      // but Firebase's email/password provider needs an email to log in
      // with going forward. Since the spec keeps email optional, we fall
      // back to a phone-derived pseudo-email (not shown to the user) so the
      // owner can still log in with just their phone + password if they
      // skip the email field. A real email is always preferred when given.
      const loginEmail =
        form.email.trim() || `${phone.replace(/[^0-9]/g, "")}@gymz.app`;
      const cred = await registerWithEmail(loginEmail, form.password);
      await updateProfile(cred.user, { displayName: form.ownerName });
      await createGymDoc(cred.user.uid, {
        gymName: form.gymName,
        ownerName: form.ownerName,
        phone,
        phoneVerified: true,
        email: form.email.trim() || null,
        loginEmail,
        city: form.city,
        state: form.state,
        shortAddress: form.shortAddress,
        activeMemberCount: 0,
      });
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.code === "auth/email-already-in-use"
          ? "An account already exists with this email."
          : "Could not create the gym account. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-ink-900">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <Card className="w-full max-w-md p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-6">
            {[STEPS.PHONE, STEPS.OTP, STEPS.DETAILS].map((s, i) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full ${
                  [STEPS.PHONE, STEPS.OTP, STEPS.DETAILS].indexOf(step) >= i
                    ? "bg-copper-500"
                    : "bg-ink-700"
                }`}
              />
            ))}
          </div>

          {step === STEPS.PHONE && (
            <>
              <h1 className="font-display text-2xl mb-1">Verify your number</h1>
              <p className="text-ink-500 text-sm mb-6">
                We'll text you a one-time code to confirm it's really you.
              </p>
              <form onSubmit={handleSendOtp} className="space-y-4">
                <Input
                  label="Owner Phone Number"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91XXXXXXXXXX"
                />
                <p className="text-[11px] text-ink-500">
                  Use an international format like +91XXXXXXXXXX for the OTP
                  test.
                </p>
                {error && (
                  <p className="text-xs text-vitality-critical">{error}</p>
                )}
                <div id="recaptcha-container" />
                <Button type="submit" loading={loading} className="w-full">
                  Send OTP
                </Button>
              </form>
            </>
          )}

          {step === STEPS.OTP && (
            <>
              <h1 className="font-display text-2xl mb-1">Enter the code</h1>
              <p className="text-ink-500 text-sm mb-6">Sent to {phone}</p>
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <Input
                  label="6-digit OTP"
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
                  Verify
                </Button>
              </form>
            </>
          )}

          {step === STEPS.DETAILS && (
            <>
              <h1 className="font-display text-2xl mb-1">Set up your gym</h1>
              <p className="text-ink-500 text-sm mb-6">
                Phone number verified ✓. Just a few more details.
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
                  label="Email (optional)"
                  type="email"
                  value={form.email}
                  onChange={handleField("email")}
                />
                <Input
                  label="Password"
                  type="password"
                  required
                  value={form.password}
                  onChange={handleField("password")}
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
