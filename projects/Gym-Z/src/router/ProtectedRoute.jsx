import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Spinner from "../components/ui/Spinner.jsx";

function AuthLoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-ink-900">
      <Spinner size="lg" />
    </div>
  );
}

export default function ProtectedRoute({ children }) {
  const { user, gym, loading } = useAuth();

  if (loading) return <AuthLoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (!gym) return <Navigate to="/create-gym" replace />;
  return children;
}

export function OnboardingRoute({ children }) {
  const { user, gym, loading } = useAuth();

  if (loading) return <AuthLoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (gym) return <Navigate to="/dashboard" replace />;
  return children;
}

export function GuestRoute({ children }) {
  const { user, gym, loading } = useAuth();

  if (loading) return <AuthLoadingScreen />;
  if (user) return <Navigate to={gym ? "/dashboard" : "/create-gym"} replace />;
  return children;
}
