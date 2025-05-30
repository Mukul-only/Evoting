import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { useAuth } from "../contexts/AuthContext";

const VoterLoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const from = location.state?.from?.pathname || "/dashboard";

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await login(data.aadhaarId, data.password); // AuthContext login expects aadhaarId and password
      toast.success("Logged in successfully!");
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(
        error.message || "Login failed. Please check your credentials."
      );
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 p-4"
    >
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-primary mb-2">
          Voter Login
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Access your E-Voting dashboard.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Aadhaar ID"
            name="aadhaarId"
            placeholder="Enter your Aadhaar ID"
            {...register("aadhaarId", { required: "Aadhaar ID is required" })}
            error={errors.aadhaarId}
          />
          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="Enter your password"
            {...register("password", { required: "Password is required" })}
            error={errors.password}
          />
          <Button
            type="submit"
            fullWidth
            isLoading={isLoading}
            disabled={isLoading}
          >
            Login
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          New Voter?{" "}
          <Link
            to="/register"
            className="font-medium text-primary hover:underline"
          >
            Register here
          </Link>
        </p>
        <p className="mt-2 text-center text-sm text-gray-600">
          Admin?{" "}
          <Link
            to="/admin/login"
            className="font-medium text-primary hover:underline"
          >
            Login here
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default VoterLoginPage;
