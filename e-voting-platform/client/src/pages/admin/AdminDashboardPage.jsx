import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import StatCard from "../../components/admin/StatCard";
import { getAdminDashboardStats } from "../../services/adminService";
import { getElections } from "../../services/electionService"; // For listing recent elections
import LoadingSpinner from "../../components/common/LoadingSpinner";
import {
  UsersIcon,
  ClipboardDocumentListIcon,
  CheckBadgeIcon,
  UserGroupIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [recentElections, setRecentElections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [statsData, electionsData] = await Promise.all([
          getAdminDashboardStats(),
          getElections({ limit: 5, sort: "-createdAt" }), // Example: Get 5 most recent
        ]);
        setStats(statsData);
        setRecentElections(electionsData.slice(0, 5)); // Assuming backend returns all if no limit query
      } catch (err) {
        toast.error(err.message || "Failed to fetch dashboard data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center h-[calc(100vh-150px)]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6"
    >
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Admin Dashboard
      </h1>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Elections"
            value={stats.totalElections}
            icon={<ClipboardDocumentListIcon />}
            color="primary"
          />
          <StatCard
            title="Active Elections"
            value={stats.activeElections}
            icon={<CheckBadgeIcon />}
            color="green"
          />
          <StatCard
            title="Total Candidates"
            value={stats.totalCandidates}
            icon={<UserGroupIcon />}
            color="yellow"
          />
          <StatCard
            title="Total Voters"
            value={stats.totalVoters}
            icon={<UsersIcon />}
            color="purple"
          />
        </div>
      )}

      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Recent Elections
          </h2>
          <Link to="/admin/elections/create" className="btn btn-sm btn-primary">
            <CalendarDaysIcon className="h-4 w-4 mr-2" /> Create New Election
          </Link>
        </div>
        {recentElections.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {recentElections.map((election) => (
              <li
                key={election._id}
                className="py-3 flex justify-between items-center"
              >
                <div>
                  <p className="text-md font-medium text-primary capitalize">
                    {election.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    Status:{" "}
                    <span
                      className={`font-semibold ${
                        election.status === "active"
                          ? "text-green-600"
                          : election.status === "pending"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {election.status.charAt(0).toUpperCase() +
                        election.status.slice(1)}
                    </span>
                  </p>
                </div>
                <Link
                  to={`/admin/elections/${election._id}/manage`}
                  className="text-sm text-indigo-600 hover:text-indigo-800"
                >
                  Manage
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No elections found.</p>
        )}
      </div>
      {/* TODO: Add more sections like voter management quick view, etc. */}
    </motion.div>
  );
};

export default AdminDashboardPage;
