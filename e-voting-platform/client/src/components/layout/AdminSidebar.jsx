import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  ChartPieIcon,
  Cog6ToothIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  ArrowLeftOnRectangleIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";

const AdminSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.info("Logged out successfully.");
    navigate("/admin/login");
  };

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: ChartPieIcon },
    {
      name: "Manage Elections",
      href: "/admin/elections/manage",
      icon: ClipboardDocumentListIcon,
    },
    { name: "Voter Database", href: "/admin/voters", icon: UsersIcon },
    { name: "Analytics", href: "/admin/analytics", icon: ChartPieIcon }, // Re-using icon, pick a better one
    { name: "Profile", href: "/admin/profile", icon: UserCircleIcon }, // Assuming /admin/profile route
    { name: "Settings", href: "/admin/settings", icon: Cog6ToothIcon }, // Placeholder
  ];

  return (
    <div className="flex flex-col w-64 bg-slate-800 text-slate-100 h-screen">
      <div className="flex items-center justify-center h-20 border-b border-slate-700">
        <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `group flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out
               ${
                 isActive
                   ? "bg-primary text-white shadow-lg"
                   : "text-slate-200 hover:bg-slate-700 hover:text-white"
               }`
            }
          >
            <item.icon
              className="mr-3 flex-shrink-0 h-5 w-5"
              aria-hidden="true"
            />
            {item.name}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center mb-3">
          <UserCircleIcon className="h-8 w-8 rounded-full text-slate-400 mr-2" />
          <div>
            <p className="text-sm font-medium text-white">
              {user?.name || "Admin User"}
            </p>
            <p className="text-xs text-slate-400">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full group flex items-center justify-center px-3 py-2.5 text-sm font-medium rounded-md text-slate-200 hover:bg-red-600 hover:text-white transition-colors duration-150 ease-in-out border border-slate-600 hover:border-red-600"
        >
          <ArrowLeftOnRectangleIcon
            className="mr-3 flex-shrink-0 h-5 w-5"
            aria-hidden="true"
          />
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
