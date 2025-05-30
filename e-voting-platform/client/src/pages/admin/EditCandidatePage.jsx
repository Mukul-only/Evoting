import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import {
  getCandidateById,
  updateCandidateInElection,
} from "../../services/electionService";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const EditCandidatePage = () => {
  const { electionId, candidateId } = useParams();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [candidateName, setCandidateName] = useState("");

  useEffect(() => {
    const fetchCandidate = async () => {
      setIsFetching(true);
      try {
        const data = await getCandidateById(electionId, candidateId);
        setValue("name", data.name);
        setValue("party", data.party);
        setValue("symbolUrl", data.symbolUrl);
        setCandidateName(data.name); // For display in title
      } catch (error) {
        toast.error(error.message || "Failed to fetch candidate details.");
        navigate(`/admin/elections/${electionId}/candidates`);
      } finally {
        setIsFetching(false);
      }
    };
    fetchCandidate();
  }, [electionId, candidateId, setValue, navigate]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await updateCandidateInElection(electionId, candidateId, data);
      toast.success("Candidate updated successfully!");
      navigate(`/admin/elections/${electionId}/candidates`);
    } catch (error) {
      toast.error(error.message || "Failed to update candidate.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="p-6 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-gray-50 min-h-full"
    >
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate(`/admin/elections/${electionId}/candidates`)}
        className="mb-4"
      >
        <ArrowLeftIcon className="h-4 w-4 mr-2" /> Back to Candidates
      </Button>
      <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-xl">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Edit Candidate: <span className="text-primary">{candidateName}</span>
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Candidate Name*"
            name="name"
            {...register("name", { required: "Candidate name is required" })}
            error={errors.name}
          />
          <Input
            label="Party (Optional)"
            name="party"
            {...register("party")}
            error={errors.party}
          />
          <Input
            label="Symbol URL (Optional)"
            name="symbolUrl"
            {...register("symbolUrl")}
            error={errors.symbolUrl}
          />
          <div className="flex justify-end space-x-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                navigate(`/admin/elections/${electionId}/candidates`)
              }
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading} disabled={isLoading}>
              Update Candidate
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default EditCandidatePage;
