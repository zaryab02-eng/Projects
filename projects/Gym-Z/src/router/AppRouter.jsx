import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.jsx";

import Landing from "../pages/Landing.jsx";
import Login from "../pages/Login.jsx";
import ForgotPassword from "../pages/ForgotPassword.jsx";
import CreateGym from "../pages/CreateGym.jsx";
import GymRankings from "../pages/GymRankings.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import Members from "../pages/Members.jsx";
import AddMember from "../pages/AddMember.jsx";
import MemberProfile from "../pages/MemberProfile.jsx";
import MembershipPlans from "../pages/MembershipPlans.jsx";
import Blacklist from "../pages/Blacklist.jsx";
import NotFound from "../pages/NotFound.jsx";

export default function AppRouter() {
  return (
    <Routes>
      {/* Public routes — accessible without login */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/create-gym" element={<CreateGym />} />
      <Route path="/rankings" element={<GymRankings />} />

      {/* Protected — require a logged-in gym owner */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/members"
        element={
          <ProtectedRoute>
            <Members />
          </ProtectedRoute>
        }
      />
      <Route
        path="/members/add"
        element={
          <ProtectedRoute>
            <AddMember />
          </ProtectedRoute>
        }
      />
      <Route
        path="/members/:memberId"
        element={
          <ProtectedRoute>
            <MemberProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/plans"
        element={
          <ProtectedRoute>
            <MembershipPlans />
          </ProtectedRoute>
        }
      />
      <Route
        path="/blacklist"
        element={
          <ProtectedRoute>
            <Blacklist />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
