import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  getElectionById,
  getElectionResults,
} from "../../services/electionService";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Button from "../../components/common/Button"; // If needed for actions
import {
  ArrowLeftIcon,
  UserCircleIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";

const AdminElectionResultsPage = () => {
  const { electionId } = useParams(); // Assuming route is /admin/elections/:electionId/results
  const [election, setElection] = useState(null);
  const [resultsData, setResultsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (!electionId) return;
      setIsLoading(true);
      try {
        // Fetch election details for context (name, etc.)
        const electionDetails = await getElectionById(electionId);
        setElection(electionDetails);

        const data = await getElectionResults(electionId);
        setResultsData(data);
      } catch (err) {
        toast.error(err.message || "Failed to fetch election results.");
        setResultsData(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResults();
  }, [electionId]);

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[calc(100vh-200px)]">
        <LoadingSpinner />
      </div>
    );
  }

  if (!resultsData || !election) {
    return (
      <div className="p-6 text-center text-red-500">
        Could not load election results.
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6"
    >
      <Link
        to="/admin/dashboard"
        className="inline-flex items-center mb-4 text-sm text-indigo-600 hover:text-indigo-800"
      >
        <ArrowLeftIcon className="w-4 h-4 mr-1" /> Back to Dashboard
      </Link>
      <div className="p-6 bg-white rounded-lg shadow-xl md:p-8">
        <div className="mb-6 text-center">
          <TrophyIcon className="w-12 h-12 mx-auto mb-2 text-amber-500" />
          <h1 className="text-3xl font-bold capitalize text-primary">
            {election.name}
          </h1>
          <p className="text-lg text-gray-600">Official Election Results</p>
          <p className="mt-1 text-sm text-gray-500">
            Completed on: {new Date(election.endTime).toLocaleDateString()}
          </p>
        </div>

        <div className="p-4 mb-6 rounded-md bg-indigo-50">
          <p className="text-xl font-semibold text-center text-indigo-700">
            Total Votes Cast:{" "}
            <span className="text-2xl">{resultsData.totalVotesCast}</span>
          </p>
        </div>

        {resultsData.results && resultsData.results.length > 0 ? (
          <div className="space-y-4">
            {resultsData.results.map((candidate, index) => (
              <div
                key={candidate._id}
                className="flex items-center justify-between p-4 transition-shadow bg-white border rounded-lg shadow-sm hover:shadow-md"
              >
                <div className="flex items-center space-x-3">
                  {candidate.symbolUrl ? (
                    <img
                      src={candidate.symbolUrl}
                      alt={candidate.name}
                      className="object-cover w-12 h-12 border rounded-full"
                    />
                  ) : (
                    <UserCircleIcon className="w-12 h-12 text-gray-400" />
                  )}
                  <div>
                    <h3
                      className={`text-lg font-semibold ${
                        index === 0 ? "text-green-600" : "text-gray-800"
                      }`}
                    >
                      {index + 1}. {candidate.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {candidate.party || "Independent"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-indigo-600">
                    {candidate.voteCount} votes
                  </p>
                  <p className="text-sm text-gray-500">
                    (
                    {(
                      (candidate.voteCount /
                        (resultsData.totalVotesCast || 1)) *
                      100
                    ).toFixed(2)}
                    %)
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="py-8 text-center text-gray-500">
            No votes were cast in this election.
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default AdminElectionResultsPage;
