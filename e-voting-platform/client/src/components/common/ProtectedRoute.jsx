import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const ProtectedRoute = ({ roles }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>; // Or a spinner
  }

  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(user?.role)) {
    // If user is authenticated but does not have the required role
    // Redirect to a relevant page or a "forbidden" page
    // For simplicity, redirecting to their default dashboard or home
    const redirectTo =
      user?.role === "admin" ? "/admin/dashboard" : "/dashboard";
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />; // Render the child route component
};

export default ProtectedRoute;
