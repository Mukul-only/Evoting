import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form"; // Import useFieldArray
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import {
  createElection,
  addCandidateToElection,
} from "../../services/electionService";
import {
  PlusCircleIcon,
  TrashIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";

const CreateElectionPage = () => {
  const {
    register,
    control, // control is needed for useFieldArray
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      startTime: "",
      endTime: "",
      candidates: [{ name: "", party: "" }], // Initialize with one candidate field
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "candidates",
  });

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const startTimeValue = watch("startTime"); // For end time validation

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const electionDetails = {
        name: data.name,
        description: data.description,
        startTime: new Date(data.startTime).toISOString(),
        endTime: new Date(data.endTime).toISOString(),
      };

      if (
        new Date(electionDetails.endTime) <= new Date(electionDetails.startTime)
      ) {
        toast.error("End time must be after start time.");
        setIsLoading(false);
        return;
      }

      // Step 1: Create the election
      const createdElection = await createElection(electionDetails);
      toast.success("Election created successfully!");

      // Step 2: Add candidates if any are provided and valid
      if (data.candidates && data.candidates.length > 0) {
        let candidatesAddedCount = 0;
        for (const candidate of data.candidates) {
          if (candidate.name && candidate.name.trim() !== "") {
            // Only add if name is present
            try {
              await addCandidateToElection(createdElection._id, {
                name: candidate.name,
                party: candidate.party || "", // Send empty string if party is not filled
                // symbolUrl: candidate.symbolUrl || '', // If you add symbolUrl field
              });
              candidatesAddedCount++;
            } catch (candidateError) {
              toast.error(
                `Failed to add candidate "${candidate.name}": ${
                  candidateError.message || "Unknown error"
                }`
              );
              // Decide if you want to stop or continue adding other candidates
            }
          }
        }
        if (candidatesAddedCount > 0) {
          toast.info(
            `${candidatesAddedCount} candidate(s) added to the election.`
          );
        }
      }

      reset(); // Reset the entire form
      navigate("/admin/elections/manage"); // Or to the manage candidates page for this new election
    } catch (error) {
      toast.error(
        error.message || "Failed to create election or add candidates."
      );
      console.error("Create election/candidate error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-gray-50 min-h-full"
    >
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-xl">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Create New Election
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Election Details */}
          <fieldset className="space-y-4 p-4 border border-gray-200 rounded-md">
            <legend className="text-lg font-medium text-gray-700 px-2">
              Election Details
            </legend>
            <Input
              label="Election Name*"
              name="name"
              placeholder="e.g., Presidential Election 2024"
              {...register("name", { required: "Election name is required" })}
              error={errors.name}
            />
            {/* Textarea for Description */}
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
                } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
              />
              {errors.description && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Start Date & Time*"
                name="startTime"
                type="datetime-local"
                {...register("startTime", {
                  required: "Start time is required",
                })}
                error={errors.startTime}
              />
              <Input
                label="End Date & Time*"
                name="endTime"
                type="datetime-local"
                {...register("endTime", {
                  required: "End time is required",
                  validate: (value) =>
                    new Date(value) > new Date(startTimeValue) ||
                    "End time must be after start time",
                })}
                error={errors.endTime}
              />
            </div>
          </fieldset>

          {/* Candidate Details */}
          <fieldset className="space-y-4 p-4 border border-gray-200 rounded-md">
            <legend className="text-lg font-medium text-gray-700 px-2 flex justify-between items-center w-full ">
              <span>Candidates</span>
              <Button
                type="button"
                variant="ghost" // A subtle button style
                size="sm"
                onClick={() => append({ name: "", party: "" })}
                className="text-primary hover:bg-indigo-50 flex items-center "
              >
                <UserPlusIcon className="h-5 w-5 mr-1" />
                Add Candidate
              </Button>
            </legend>

            {fields.map((field, index) => (
              <div
                key={field.id}
                className="p-3 border border-gray-100 rounded-md space-y-3 relative bg-slate-50"
              >
                <h4 className="text-sm font-medium text-gray-600">
                  Candidate {index + 1}
                </h4>
                <Input
                  label="Candidate Name*"
                  name={`candidates.${index}.name`}
                  placeholder="Full Name"
                  {...register(`candidates.${index}.name`, {
                    required:
                      fields.length > 1 || index === 0
                        ? "Candidate name is required"
                        : false, // Required if it's not the only one or if it's the first one. Adjust logic if needed.
                  })}
                  error={errors.candidates?.[index]?.name}
                />
                <Input
                  label="Party (Optional)"
                  name={`candidates.${index}.party`}
                  placeholder="Political Party"
                  {...register(`candidates.${index}.party`)}
                  error={errors.candidates?.[index]?.party}
                />
                {/* Add Symbol URL input if needed */}
                {/* <Input
                  label="Symbol URL (Optional)"
                  name={`candidates.${index}.symbolUrl`}
                  placeholder="http://..."
                  {...register(`candidates.${index}.symbolUrl`)}
                  error={errors.candidates?.[index]?.symbolUrl}
                /> */}
                {fields.length > 1 && ( // Show remove button only if there's more than one candidate
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => remove(index)}
                    className="absolute top-2 right-2 !p-1" // Adjusted padding
                    title="Remove Candidate"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            {fields.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-2">
                No candidates added yet. Click "Add Candidate" to begin.
              </p>
            )}
          </fieldset>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset(); // Reset form if navigating away
                navigate(-1);
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading} disabled={isLoading}>
              Create Election & Add Candidates
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default CreateElectionPage;
