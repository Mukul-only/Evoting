import React from "react";
import { motion } from "framer-motion";
import {
  ChartBarIcon,
  UsersIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

// Placeholder for chart components - you'd use a library like Chart.js, Recharts, etc.
const PlaceholderChart = ({ title }) => (
  <div className="bg-gray-100 p-6 rounded-lg h-64 flex flex-col items-center justify-center">
    <ChartBarIcon className="h-16 w-16 text-gray-400 mb-2" />
    <p className="text-gray-600 font-semibold">{title}</p>
    <p className="text-xs text-gray-400">(Chart Data Unavailable)</p>
  </div>
);

const AdminAnalyticsPage = () => {
  // In a real app, you'd fetch aggregated data from the backend here
  // e.g., voter turnout per election, demographics, etc.

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6"
    >
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Election Analytics
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Example Stats - these would come from backend */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center mb-2">
            <UsersIcon className="h-6 w-6 text-blue-500 mr-3" />
            <h3 className="text-lg font-semibold text-gray-700">
              Overall Voter Turnout
            </h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">72.5%</p>
          <p className="text-sm text-gray-500">
            Across all completed elections
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center mb-2">
            <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3" />
            <h3 className="text-lg font-semibold text-gray-700">
              Most Active Election
            </h3>
          </div>
          <p className="text-xl font-bold text-green-600">
            Presidential Election 2024
          </p>
          <p className="text-sm text-gray-500">85% participation</p>
        </div>
        {/* Add more summary stats */}
      </div>

      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        Detailed Breakdowns
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PlaceholderChart title="Voter Turnout Over Time" />
        <PlaceholderChart title="Participation by Election Type" />
        {/* Add more charts as needed */}
      </div>
      <p className="mt-8 text-sm text-gray-500">
        Note: This is a placeholder analytics page. Real data and charts would
        require backend aggregation and integration with a charting library
        (e.g., Chart.js, Recharts).
      </p>
    </motion.div>
  );
};

export default AdminAnalyticsPage;
