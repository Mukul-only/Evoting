import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getElectionResults } from "../../services/electionService";
import LoadingSpinner from "../common/LoadingSpinner";
import { ChartBarIcon, EyeIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

const ElectionResultSummaryCard = ({ election }) => {
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (election && election._id) {
      setIsLoading(true);
      getElectionResults(election._id)
        .then((data) => {
          setResults(data);
        })
        .catch((err) => {
          console.error("Failed to fetch results for dashboard card:", err);
          toast.error(`Could not load results for ${election.name}`);
          setResults(null); // Clear previous results on error
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false); // No election to load results for
    }
  }, [election]);

  if (!election) {
    return (
      <div className="p-6 text-center text-gray-500 bg-white rounded-lg shadow-lg">
        No completed election found to display results.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center justify-center min-h-[200px]">
        <LoadingSpinner />
        <p className="mt-2 text-sm text-gray-500">
          Loading results for {election.name}...
        </p>
      </div>
    );
  }

  if (!results || !results.results || results.results.length === 0) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h3 className="mb-2 text-lg font-semibold capitalize text-primary">
          {election.name} - Results
        </h3>
        <p className="text-sm text-gray-500">
          No votes were cast, or results are not yet processed for this
          election.
        </p>
        <Link
          to={`/admin/elections/${election._id}/results`} // Link to a detailed results page
          className="inline-flex items-center mt-3 text-sm font-medium text-indigo-600 hover:text-indigo-800"
        >
          View Details <EyeIcon className="w-4 h-4 ml-1" />
        </Link>
      </div>
    );
  }

  // Display top 1-3 candidates or a summary
  const topCandidates = results.results.slice(0, 3);

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="mb-1 text-lg font-semibold capitalize text-primary">
            {election.name} - Results
          </h3>
          <p className="text-xs text-gray-500">
            Total Votes: {results.totalVotesCast}
          </p>
        </div>
        <Link
          to={`/admin/elections/${election._id}/results`} // Link to a detailed results page
          className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800"
        >
          Full Report <EyeIcon className="w-4 h-4 ml-1" />
        </Link>
      </div>

      {topCandidates.length > 0 ? (
        <ul className="space-y-2">
          {topCandidates.map((candidate, index) => (
            <li
              key={candidate._id}
              className="flex items-center justify-between p-2 text-sm rounded bg-gray-50"
            >
              <span className="font-medium text-gray-700">
                {index + 1}. {candidate.name} (
                {candidate.party || "Independent"})
              </span>
              <span className="font-semibold text-indigo-600">
                {candidate.voteCount} votes (
                {(
                  (candidate.voteCount / (results.totalVotesCast || 1)) *
                  100
                ).toFixed(1)}
                %)
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="py-4 text-sm text-center text-gray-500">
          No votes cast in this election.
        </p>
      )}

      {results.results.length > 3 && (
        <p className="mt-2 text-xs text-center text-gray-400">
          ... and more candidates.
        </p>
      )}
    </div>
  );
};

export default ElectionResultSummaryCard;
