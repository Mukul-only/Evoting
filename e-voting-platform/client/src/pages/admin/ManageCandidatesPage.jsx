import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  getElectionById,
  addCandidateToElection,
  deleteCandidateFromElection,
  getCandidatesForElection,
} from "../../services/electionService";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input"; // Assuming Input can handle textareas or simple text
import {
  PencilSquareIcon,
  TrashIcon,
  UserPlusIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import ConfirmationModal from "../../components/common/Modal"; // Assuming you made Modal.jsx

const ManageCandidatesPage = () => {
  const { electionId } = useParams(); // Renamed from 'id' for clarity
  const navigate = useNavigate();

  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCandidate, setNewCandidate] = useState({
    name: "",
    party: "",
    symbolUrl: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [candidateToDelete, setCandidateToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fetchElectionAndCandidates = async () => {
    setIsLoading(true);
    try {
      const [electionData, candidatesData] = await Promise.all([
        getElectionById(electionId),
        getCandidatesForElection(electionId),
      ]);
      setElection(electionData);
      setCandidates(candidatesData);
      if (electionData.status !== "pending") {
        toast.info(
          "Candidate management is only fully available for 'pending' elections."
        );
      }
    } catch (err) {
      toast.error(err.message || "Failed to fetch data.");
      navigate("/admin/elections/manage");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchElectionAndCandidates();
  }, [electionId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCandidate((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCandidate = async (e) => {
    e.preventDefault();
    if (!newCandidate.name) {
      toast.warn("Candidate name is required.");
      return;
    }
    setIsSubmitting(true);
    try {
      await addCandidateToElection(electionId, newCandidate);
      toast.success("Candidate added successfully!");
      setNewCandidate({ name: "", party: "", symbolUrl: "" });
      setShowAddForm(false);
      fetchElectionAndCandidates(); // Refresh list
    } catch (err) {
      toast.error(err.message || "Failed to add candidate.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDeleteModal = (candidate) => {
    setCandidateToDelete(candidate);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteCandidate = async () => {
    if (!candidateToDelete) return;
    setIsSubmitting(true);
    try {
      await deleteCandidateFromElection(electionId, candidateToDelete._id);
      toast.success("Candidate deleted successfully!");
      fetchElectionAndCandidates(); // Refresh
    } catch (err) {
      toast.error(err.message || "Failed to delete candidate.");
    } finally {
      setIsSubmitting(false);
      setIsDeleteModalOpen(false);
      setCandidateToDelete(null);
    }
  };

  if (isLoading)
    return (
      <div className="p-6 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  if (!election)
    return <div className="p-6 text-center">Election not found.</div>;

  const canModifyCandidates = election.status === "pending";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6"
    >
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate("/admin/elections/manage")}
        className="mb-4"
      >
        <ArrowLeftIcon className="h-4 w-4 mr-2" /> Back to Elections
      </Button>
      <h1 className="text-2xl font-semibold text-gray-800 mb-1">
        Manage Candidates
      </h1>
      <h2 className="text-lg text-primary mb-6 capitalize">{election.name}</h2>

      {canModifyCandidates && (
        <div className="mb-6">
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            <UserPlusIcon className="h-5 w-5 mr-2" />{" "}
            {showAddForm ? "Cancel Adding" : "Add New Candidate"}
          </Button>
          {showAddForm && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              onSubmit={handleAddCandidate}
              className="mt-4 p-4 bg-gray-50 rounded-lg shadow space-y-3"
            >
              <Input
                label="Candidate Name*"
                name="name"
                value={newCandidate.name}
                onChange={handleInputChange}
                placeholder="Full Name"
              />
              <Input
                label="Party (Optional)"
                name="party"
                value={newCandidate.party}
                onChange={handleInputChange}
                placeholder="Political Party"
              />
              <Input
                label="Symbol URL (Optional)"
                name="symbolUrl"
                value={newCandidate.symbolUrl}
                onChange={handleInputChange}
                placeholder="http://.../symbol.png"
              />
              <Button
                type="submit"
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                Add Candidate
              </Button>
            </motion.form>
          )}
        </div>
      )}
      {!canModifyCandidates && (
        <p className="mb-4 p-3 bg-yellow-100 text-yellow-700 rounded-md text-sm">
          Candidates can only be added, edited, or deleted when the election
          status is 'pending'.
        </p>
      )}

      {candidates.length === 0 ? (
        <p className="text-gray-600">
          No candidates added to this election yet.
        </p>
      ) : (
        <div className="bg-white shadow-lg rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            {/* ... table head ... */}
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Party
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {candidates.map((candidate) => (
                <tr key={candidate._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {candidate.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {candidate.party || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {canModifyCandidates && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            navigate(
                              `/admin/elections/${electionId}/candidates/${candidate._id}/edit`
                            )
                          }
                          title="Edit"
                        >
                          <PencilSquareIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => openDeleteModal(candidate)}
                          title="Delete"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    {!canModifyCandidates && (
                      <span className="text-xs text-gray-400">View Only</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteCandidate}
        title="Confirm Delete Candidate"
        message={`Are you sure you want to delete candidate "${candidateToDelete?.name}"?`}
        isLoading={isSubmitting}
      />
    </motion.div>
  );
};
export default ManageCandidatesPage;
