import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import AdminSidebar from "../components/layout/AdminSidebar";
import { useAuth } from "../contexts/AuthContext";

const AdminLayout = () => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading admin area...</p>
      </div>
    ); // Or a spinner
  }

  if (!isAuthenticated || user?.role !== "admin") {
    // This should ideally be caught by ProtectedRoute, but as a fallback
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Optional: Admin Header/Navbar can go here */}
        {/* <AdminHeader /> */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-0">
          {/* Outlet renders the matched child route component (e.g., AdminDashboardPage) */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
