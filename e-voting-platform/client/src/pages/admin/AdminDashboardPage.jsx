import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import StatCard from "../../components/admin/StatCard";
import { getAdminDashboardStats } from "../../services/adminService";
import { getElections } from "../../services/electionService";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import {
  UsersIcon,
  ClipboardDocumentListIcon,
  CheckBadgeIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import ElectionResultSummaryCard from "../../components/admin/ElectionResultSummaryCard"; // Import the new component
import { format } from "date-fns"; // For sorting by date

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [recentElectionsList, setRecentElectionsList] = useState([]); // Renamed for clarity
  const [latestCompletedElection, setLatestCompletedElection] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [statsData, allElectionsData] = await Promise.all([
          getAdminDashboardStats(),
          getElections(), // Fetch all elections
        ]);
        setStats(statsData);

        // Process elections for "Recent Elections" list (e.g., sort by creation, take top 5)
        const sortedByCreation = [...allElectionsData].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setRecentElectionsList(sortedByCreation.slice(0, 5));

        // Find the most recently completed election
        const completedElections = allElectionsData.filter(
          (e) => e.status === "completed"
        );
        if (completedElections.length > 0) {
          completedElections.sort(
            (a, b) => new Date(b.endTime) - new Date(a.endTime)
          ); // Sort by end time, most recent first
          setLatestCompletedElection(completedElections[0]);
        }
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
      className="p-6 space-y-8"
    >
      {" "}
      {/* Added space-y-8 */}
      <div>
        <h1 className="mb-6 text-2xl font-semibold text-gray-800">
          Admin Dashboard
        </h1>
        {stats && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
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
      </div>
      {/* Results Panel for Latest Completed Election */}
      <div>
        <h2 className="flex items-center mb-4 text-xl font-semibold text-gray-700">
          <TrophyIcon className="w-6 h-6 mr-2 text-amber-500" /> Latest Election
          Results
        </h2>
        {latestCompletedElection ? (
          <ElectionResultSummaryCard election={latestCompletedElection} />
        ) : (
          <div className="p-6 text-center text-gray-500 bg-white rounded-lg shadow-lg">
            No elections have been completed yet.
          </div>
        )}
      </div>
      {/* Recent Elections List Panel */}
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Recent Elections Activity
          </h2>
          <Link
            to="/admin/elections/create"
            className="btn-primary text-sm inline-flex items-center px-3 py-1.5 rounded-md"
          >
            <CalendarDaysIcon className="w-4 h-4 mr-2" /> Create New
          </Link>
        </div>
        {recentElectionsList.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {recentElectionsList.map((election) => (
              <li
                key={election._id}
                className="flex items-center justify-between py-3"
              >
                <div>
                  <p className="font-medium capitalize text-md text-primary hover:underline">
                    <Link to={`/admin/elections/${election._id}/edit`}>
                      {election.name}
                    </Link>
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
                    <span className="mx-2 text-gray-300">|</span>
                    Ends: {format(new Date(election.endTime), "MMM d, yyyy p")}
                  </p>
                </div>
                <Link
                  to={`/admin/elections/${election._id}/results`}
                  className="text-sm text-indigo-600 hover:text-indigo-800"
                >
                  View Details
                </Link>
              </li>
            ))}
            <div className="mt-4 text-right">
              <Link
                to="/admin/elections/manage"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
              >
                View All Elections →
              </Link>
            </div>
          </ul>
        ) : (
          <p className="text-gray-500">No elections found.</p>
        )}
      </div>
    </motion.div>
  );
};

export default AdminDashboardPage;
