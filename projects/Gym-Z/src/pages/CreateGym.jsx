// Gym onboarding: logged-in owner fills in gym details and creates the
// Firestore workspace. Sign-in happens on /login first.
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar.jsx";
import Footer from "../components/layout/Footer.jsx";
import Card from "../components/ui/Card.jsx";
import Input from "../components/ui/Input.jsx";
import Button from "../components/ui/Button.jsx";
import { createGymDoc } from "../firebase/firestore.js";
import { updateProfile } from "firebase/auth";
import { useAuth } from "../context/AuthContext.jsx";

export default function CreateGym() {
  const navigate = useNavigate();
  const { user, refreshGym } = useAuth();
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
    setForm((f) => ({
      ...f,
      ownerName: f.ownerName || user?.displayName || "",
    }));
  }, [user]);

  const handleCreateGym = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const ownerUid = user?.uid;
      if (!ownerUid) {
        setError("Please sign in first.");
        return;
      }
      await updateProfile(user, { displayName: form.ownerName });
      await createGymDoc(ownerUid, {
        gymName: form.gymName,
        ownerName: form.ownerName,
        ownerEmail: user?.email || "",
        phone: form.phone.trim(),
        city: form.city,
        state: form.state,
        shortAddress: form.shortAddress,
        activeMemberCount: 0,
      });
      await refreshGym();
      navigate("/dashboard");
    } catch (err) {
      console.error("Create gym failed:", err);
      setError("Could not create the gym account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-ink-900">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <Card className="w-full max-w-md p-6 sm:p-8">
          <h1 className="font-display text-2xl mb-1">Set up your gym</h1>
          <p className="text-ink-500 text-sm mb-6">
            Signed in as {user?.email}. Tell us about your gym to get started.
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
              Create Gym &amp; Open Dashboard
            </Button>
          </form>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
