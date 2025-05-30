import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { getElectionById } from "../services/electionService";
import { castVote } from "../services/voteService";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/common/Button";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { UserCircleIcon } from "@heroicons/react/24/solid"; // For candidate placeholder

const VotingPage = () => {
  const { id: electionId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchElectionData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getElectionById(electionId);
        setElection(data); // data object should have .candidates array
        setCandidates(data.candidates || []);

        const now = new Date();
        if (new Date(data.endTime) < now) {
          toast.error("This election has ended.");
          navigate("/dashboard");
          return;
        }
        if (new Date(data.startTime) > now) {
          toast.error("This election has not started yet.");
          navigate("/dashboard");
          return;
        }
        if (user?.hasVoted?.includes(electionId)) {
          toast.info("You have already voted in this election.");
          navigate("/dashboard"); // Or to a "already voted" page
          return;
        }
      } catch (err) {
        setError(err.message || "Failed to fetch election details.");
        toast.error(err.message || "Failed to fetch election details.");
        navigate("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    if (electionId) {
      fetchElectionData();
    }
  }, [electionId, navigate, user]);

  const handleVoteSubmit = async () => {
    if (!selectedCandidate) {
      toast.warn("Please select a candidate to vote for.");
      return;
    }
    setIsSubmitting(true);
    try {
      await castVote({ electionId, candidateId: selectedCandidate });
      toast.success("Your vote has been cast successfully!");
      // Update user context or refetch user to update hasVoted (important!)
      // For now, just navigate away
      navigate("/dashboard");
    } catch (err) {
      toast.error(
        err.message ||
          "Failed to cast vote. You might have already voted or an error occurred."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center h-[calc(100vh-200px)]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !election) {
    return (
      <div className="container mx-auto p-6 text-center text-red-500">
        {error || "Election not found."}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto p-6 pt-10"
    >
      <h1 className="text-3xl font-bold text-primary mb-2 capitalize">
        {election.name}
      </h1>
      <p className="text-gray-600 mb-8">
        {election.description || "Select a candidate and cast your vote."}
      </p>

      {candidates.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-xl font-semibold text-gray-700">
            No Candidates Available
          </p>
          <p className="text-gray-500">
            There are no candidates listed for this election yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {candidates.map((candidate) => (
            <div
              key={candidate._id}
              onClick={() => setSelectedCandidate(candidate._id)}
              className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ease-in-out flex items-center space-x-4
                            ${
                              selectedCandidate === candidate._id
                                ? "bg-indigo-100 border-primary ring-2 ring-primary"
                                : "bg-white hover:bg-gray-50 border-gray-300"
                            }`}
            >
              {candidate.symbolUrl ? (
                <img
                  src={candidate.symbolUrl}
                  alt={candidate.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <UserCircleIcon className="w-16 h-16 text-gray-400" />
              )}
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {candidate.name}
                </h3>
                {candidate.party && (
                  <p className="text-sm text-gray-600">{candidate.party}</p>
                )}
              </div>
              {selectedCandidate === candidate._id && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-6 h-6 text-primary ml-auto"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.06 0l4.001-5.5a.75.75 0 0 0-.124-.882Z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
          ))}
        </div>
      )}

      {candidates.length > 0 && (
        <div className="mt-8 text-center">
          <Button
            onClick={handleVoteSubmit}
            isLoading={isSubmitting}
            disabled={isSubmitting || !selectedCandidate}
            size="lg"
          >
            Confirm and Cast Vote
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default VotingPage;
