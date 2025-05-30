import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { useAuth } from "../contexts/AuthContext"; // Assuming useAuth handles admin login too

const AdminLoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { login } = useAuth(); // AuthContext.login should check user role on backend
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const from = location.state?.from?.pathname || "/admin/dashboard";

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const loggedInUser = await login(data.aadhaarId, data.password); // Use Aadhaar for admin login as per screenshot
      if (loggedInUser.role !== "admin") {
        toast.error("Access Denied. Not an administrator.");
        // Optionally logout if login context doesn't handle role mismatch well
        // logout();
      } else {
        toast.success("Admin logged in successfully!");
        navigate(from, { replace: true });
      }
    } catch (error) {
      toast.error(
        error.message || "Login failed. Please check your credentials."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-700 to-slate-900 p-4"
    >
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-primary mb-2">
          Admin Login
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Access the E-Voting Admin Panel.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Admin ID (Aadhaar)" // Or specific Admin Username if different
            name="aadhaarId"
            placeholder="Enter your Admin ID"
            {...register("aadhaarId", { required: "Admin ID is required" })}
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
            Login as Admin
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Not an Admin?{" "}
          <Link
            to="/login"
            className="font-medium text-primary hover:underline"
          >
            Voter Login
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default AdminLoginPage;
