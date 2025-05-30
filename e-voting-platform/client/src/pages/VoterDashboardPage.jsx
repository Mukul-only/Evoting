import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ElectionCard from "../components/voter/ElectionCard";
import { getActiveElectionsForVoter } from "../services/electionService";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "../components/common/LoadingSpinner"; // Create this simple component

const VoterDashboardPage = () => {
  const [elections, setElections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchElections = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getActiveElectionsForVoter();
        setElections(data);
      } catch (err) {
        setError(err.message || "Failed to fetch elections.");
        toast.error(err.message || "Failed to fetch elections.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchElections();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center h-[calc(100vh-200px)]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto p-6 pt-10"
    >
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Voter Dashboard</h1>
      <p className="text-gray-600 mb-8">
        Welcome, {user?.name}! View active elections and cast your vote.
      </p>

      {elections.length === 0 && !isLoading && (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-16 h-16 mx-auto text-gray-400 mb-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
            />
          </svg>
          <p className="text-xl font-semibold text-gray-700">
            No Active Elections
          </p>
          <p className="text-gray-500">
            There are currently no elections open for voting. Please check back
            later.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {elections.map((election) => (
          <ElectionCard
            key={election._id}
            election={election}
            userRole="voter"
            hasVoted={user?.hasVoted?.includes(election._id)}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default VoterDashboardPage;
