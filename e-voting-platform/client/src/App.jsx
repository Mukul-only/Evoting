import React from "react"; // Ensure React is imported
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import useSmoothScroll from "./hooks/useSmoothScroll";

// Layouts
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";
import AuthLayout from "./layouts/AuthLayout";

// Common Pages
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import ProfilePage from "./pages/ProfilePage"; // Used by both voter and admin

// Voter Pages
import VoterLoginPage from "./pages/VoterLoginPage";
import VoterRegisterPage from "./pages/VoterRegisterPage";
import VoterDashboardPage from "./pages/VoterDashboardPage";
import VotingPage from "./pages/VotingPage";

// Admin Pages
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import CreateElectionPage from "./pages/admin/CreateElectionPage";
import ManageElectionsPage from "./pages/admin/ManageElectionsPage"; // Added
import EditElectionPage from "./pages/admin/EditElectionPage"; // Added
import ManageCandidatesPage from "./pages/admin/ManageCandidatesPage";
import EditCandidatePage from "./pages/admin/EditCandidatePage";
import VoterDatabasePage from "./pages/admin/VoterDatabasePage";
import AdminAnalyticsPage from "./pages/admin/AdminAnalyticsPage";
import AdminSettingsPlaceholderPage from "./pages/admin/AdminSettingsPlaceholderPage";

// Common Components
import ProtectedRoute from "./components/common/ProtectedRoute";

// Contexts & Services
import { useAuth } from "./contexts/AuthContext";

// Notifications
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const location = useLocation();
  const { user, loading } = useAuth(); // Get loading and user state from AuthContext

  useSmoothScroll(); // Initialize smooth scroll

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutralBg">
        <div className="text-xl font-semibold text-primary">
          Loading Application...
        </div>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public Routes with MainLayout */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
          </Route>

          {/* Auth Routes with AuthLayout (Login/Register) */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<VoterLoginPage />} />
            <Route path="/register" element={<VoterRegisterPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
          </Route>

          {/* Voter Protected Routes (Accessible only by 'voter' role) */}
          <Route element={<ProtectedRoute roles={["voter"]} />}>
            <Route element={<MainLayout />}>
              {" "}
              {/* Voters use the MainLayout */}
              <Route path="/dashboard" element={<VoterDashboardPage />} />
              <Route path="/election/:id/vote" element={<VotingPage />} />
              <Route path="/profile" element={<ProfilePage />} />{" "}
              {/* Voter's own profile */}
              {/* Add other voter-specific routes here */}
            </Route>
          </Route>

          {/* Admin Protected Routes (Accessible only by 'admin' role) */}
          <Route element={<ProtectedRoute roles={["admin"]} />}>
            <Route path="/admin" element={<AdminLayout />}>
              {" "}
              {/* Base for all /admin/* routes */}
              <Route index element={<AdminDashboardPage />} />{" "}
              {/* Default page for /admin */}
              <Route path="dashboard" element={<AdminDashboardPage />} />{" "}
              {/* Explicit path for /admin/dashboard */}
              <Route path="elections/create" element={<CreateElectionPage />} />
              <Route
                path="elections/manage"
                element={<ManageElectionsPage />}
              />
              <Route
                path="elections/:electionId/edit"
                element={<EditElectionPage />}
              />
              <Route
                path="elections/:electionId/candidates"
                element={<ManageCandidatesPage />}
              />
              <Route
                path="elections/:electionId/candidates/:candidateId/edit"
                element={<EditCandidatePage />}
              />
              {/* Consider a route for election results specifically for admin: */}
              {/* <Route path="elections/:electionId/results" element={<AdminElectionResultsPage />} /> */}
              <Route path="voters" element={<VoterDatabasePage />} />
              <Route path="analytics" element={<AdminAnalyticsPage />} />
              <Route path="profile" element={<ProfilePage />} />{" "}
              {/* Admin's own profile */}
              <Route
                path="settings"
                element={<AdminSettingsPlaceholderPage />}
              />
              {/* Add other admin-specific routes here */}
            </Route>
          </Route>

          {/* Fallback for any route not matched above */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AnimatePresence>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}

export default App;
