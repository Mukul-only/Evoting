import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { getElections, deleteElection } from "../../services/electionService";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import {
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
  PlusCircleIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { format, parseISO, isValid } from "date-fns"; // Import isValid

// Helper function to safely format dates
const safeFormatDate = (dateString, formatPattern = "PPp") => {
  if (!dateString) {
    return "N/A";
  }
  try {
    const date = parseISO(dateString);
    if (isValid(date)) {
      // Check if the parsed date is valid
      return format(date, formatPattern);
    }
    return "Invalid Date"; // Or 'N/A' or log an error
  } catch (error) {
    console.error("Error parsing or formatting date:", dateString, error);
    return "Error"; // Or 'N/A'
  }
};

const ManageElectionsPage = () => {
  const [elections, setElections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [electionToDelete, setElectionToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchElectionsAdmin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getElections();
      console.log("Fetched elections:", data); // Log fetched data to inspect date values
      setElections(data);
    } catch (err) {
      setError(err.message || "Failed to fetch elections.");
      toast.error(err.message || "Failed to fetch elections.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchElectionsAdmin();
  }, []);

  const handleDeleteClick = (election) => {
    setElectionToDelete(election);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!electionToDelete) return;
    setIsDeleting(true);
    try {
      await deleteElection(electionToDelete._id);
      toast.success(
        `Election "${electionToDelete.name}" deleted successfully.`
      );
      fetchElectionsAdmin();
    } catch (err) {
      toast.error(err.message || "Failed to delete election.");
    } finally {
      setIsModalOpen(false);
      setElectionToDelete(null);
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center h-[calc(100vh-150px)]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Manage Elections
        </h1>
        <Link to="/admin/elections/create">
          <Button variant="primary">
            <PlusCircleIcon className="h-5 w-5 mr-2" /> Create New Election
          </Button>
        </Link>
      </div>

      {elections.length === 0 ? (
        <div className="text-center py-10 bg-white shadow rounded-lg">
          <p className="text-xl font-semibold text-gray-700">
            No Elections Found
          </p>
          <p className="text-gray-500">Create an election to get started.</p>
        </div>
      ) : (
        <div className="bg-white shadow-lg rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Start Time
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  End Time
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {elections.map((election) => (
                <tr key={election._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 capitalize">
                      {election.name}
                    </div>
                    <div className="text-xs text-gray-500 truncate max-w-xs">
                      {election.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        election.status === "active"
                          ? "bg-green-100 text-green-800"
                          : election.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : election.status === "completed"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {election.status
                        ? election.status.charAt(0).toUpperCase() +
                          election.status.slice(1)
                        : "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {safeFormatDate(election.startTime)} {/* USE HELPER */}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {safeFormatDate(election.endTime)} {/* USE HELPER */}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        navigate(`/admin/elections/${election._id}/edit`)
                      }
                      title="Edit Election"
                    >
                      <PencilSquareIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        navigate(`/admin/elections/${election._id}/candidates`)
                      }
                      title="Manage Candidates"
                    >
                      <UserGroupIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        navigate(`/admin/elections/${election._id}/results`)
                      }
                      title="View Results"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </Button>
                    {election.status === "pending" && (
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDeleteClick(election)}
                        title="Delete Election"
                        isLoading={
                          isDeleting && electionToDelete?._id === election._id
                        }
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        confirmText="Delete"
        isLoading={isDeleting}
        variant="danger"
      >
        <p>
          Are you sure you want to delete the election "{electionToDelete?.name}
          "? This action cannot be undone and will also remove associated
          candidates.
        </p>
      </Modal>
    </motion.div>
  );
};

export default ManageElectionsPage;
