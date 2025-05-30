import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Input from "../../components/common/Input"; // Corrected path
import Button from "../../components/common/Button"; // Corrected path
import {
  getElectionById,
  updateElection,
} from "../../services/electionService"; // Corrected path
import LoadingSpinner from "../../components/common/LoadingSpinner"; // Corrected path
import { format, parseISO } from "date-fns"; // For formatting datetime-local input
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const EditElectionPage = () => {
  const { electionId } = useParams(); // Get electionId from URL params
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false); // For form submission
  const [isFetching, setIsFetching] = useState(true); // For initial data load
  const [election, setElection] = useState(null);

  // Watch form values for conditional logic if needed
  const startTimeValue = watch("startTime");
  const endTimeValue = watch("endTime");

  useEffect(() => {
    const fetchElection = async () => {
      setIsFetching(true);
      try {
        const data = await getElectionById(electionId);
        setElection(data);
        // Pre-fill form: Date needs to be in 'yyyy-MM-ddTHH:mm' format for datetime-local
        setValue("name", data.name);
        setValue("description", data.description || ""); // Handle null description
        // Ensure dates are parsed correctly before formatting
        if (data.startTime) {
          setValue(
            "startTime",
            format(parseISO(data.startTime), "yyyy-MM-dd'T'HH:mm")
          );
        }
        if (data.endTime) {
          setValue(
            "endTime",
            format(parseISO(data.endTime), "yyyy-MM-dd'T'HH:mm")
          );
        }
      } catch (error) {
        toast.error(error.message || "Failed to fetch election details.");
        navigate("/admin/elections/manage"); // Navigate back if election not found or error
      } finally {
        setIsFetching(false);
      }
    };
    if (electionId) {
      fetchElection();
    }
  }, [electionId, setValue, navigate]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const electionData = {
        name: data.name,
        description: data.description,
        startTime: new Date(data.startTime).toISOString(),
        endTime: new Date(data.endTime).toISOString(),
      };

      if (new Date(electionData.endTime) <= new Date(electionData.startTime)) {
        toast.error("End time must be after start time.");
        setIsLoading(false);
        return;
      }

      // Further checks if election is active (backend also has robust checks)
      if (
        election &&
        (election.status === "active" || election.status === "completed")
      ) {
        const originalStartTime = election.startTime
          ? new Date(election.startTime).toISOString()
          : null;
        const originalEndTime = election.endTime
          ? new Date(election.endTime).toISOString()
          : null;

        if (
          electionData.startTime !== originalStartTime ||
          electionData.endTime !== originalEndTime
        ) {
          if (election.status === "completed") {
            toast.error("Cannot change timing for a completed election.");
            setIsLoading(false);
            return;
          }
          // For active elections, you might have more complex rules or warnings
          toast.warn(
            "Modifying timing for an active election. Ensure this is intended."
          );
        }
      }

      await updateElection(electionId, electionData);
      toast.success("Election updated successfully!");
      navigate("/admin/elections/manage");
    } catch (error) {
      toast.error(error.message || "Failed to update election.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="p-6 flex justify-center items-center h-[calc(100vh-150px)]">
        <LoadingSpinner />
      </div>
    );
  }

  if (!election) {
    return (
      <div className="p-6 text-center">Election data could not be loaded.</div>
    );
  }

  const canEditTiming = election.status === "pending";
  const isCompleted = election.status === "completed";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-gray-50 min-h-full" // Ensure full height within AdminLayout
    >
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate("/admin/elections/manage")}
        className="mb-4 inline-flex items-center"
      >
        <ArrowLeftIcon className="h-4 w-4 mr-2" /> Back to Manage Elections
      </Button>

      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-xl">
        <h1 className="text-2xl font-semibold text-gray-800 mb-1">
          Edit Election
        </h1>
        <h2 className="text-lg text-primary mb-6 capitalize">
          {election?.name}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Election Name"
            name="name"
            placeholder="e.g., Presidential Election 2024"
            {...register("name", { required: "Election name is required" })}
            error={errors.name}
            disabled={isCompleted}
          />
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description (Optional)
            </label>
            <textarea
              id="description"
              name="description"
              rows="3"
              placeholder="Brief description of the election"
              {...register("description")}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.description ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm ${
                isCompleted ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
              disabled={isCompleted}
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Start Date & Time"
              name="startTime"
              type="datetime-local"
              {...register("startTime", { required: "Start time is required" })}
              error={errors.startTime}
              disabled={!canEditTiming && !isCompleted} // Disable if active, but allow viewing if completed
              className={
                !canEditTiming || isCompleted
                  ? "bg-gray-100 cursor-not-allowed"
                  : ""
              }
            />
            <Input
              label="End Date & Time"
              name="endTime"
              type="datetime-local"
              {...register("endTime", {
                required: "End time is required",
                validate: (value) =>
                  new Date(value) > new Date(startTimeValue) ||
                  "End time must be after start time",
              })}
              error={errors.endTime}
              disabled={!canEditTiming && !isCompleted} // Disable if active, but allow viewing if completed
              className={
                !canEditTiming || isCompleted
                  ? "bg-gray-100 cursor-not-allowed"
                  : ""
              }
            />
          </div>

          {isCompleted && (
            <p className="text-sm text-red-600 text-center mt-4">
              This election is completed. Most fields cannot be modified.
            </p>
          )}
          {!canEditTiming && !isCompleted && (
            <p className="text-sm text-yellow-700 bg-yellow-100 p-2 rounded-md text-center mt-4">
              Election timing cannot be changed as it is currently active. Name
              and description can still be updated.
            </p>
          )}

          <div className="flex justify-end space-x-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/elections/manage")}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isLoading}
              disabled={isLoading || isCompleted}
            >
              Update Election
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default EditElectionPage;
