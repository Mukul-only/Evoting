import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { useAuth } from "../contexts/AuthContext"; // Assuming register is in AuthContext

const VoterRegisterPage = () => {
  const {
    register: formRegister,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const { register: authRegister } = useAuth(); // Renamed to avoid conflict
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const password = watch("password");

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Data for registration typically includes name, email, aadhaarId, password
      await authRegister({
        name: data.name,
        email: data.email,
        aadhaarId: data.aadhaarId,
        password: data.password,
      });
      toast.success("Registration successful! Please login.");
      navigate("/login");
    } catch (error) {
      toast.error(error.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-teal-100 p-4"
    >
      <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-primary mb-2">
          Voter Registration
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Create your secure E-Voting account.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Full Name"
            name="name"
            placeholder="Enter your full name"
            {...formRegister("name", { required: "Full name is required" })}
            error={errors.name}
          />
          <Input
            label="Email Address"
            name="email"
            type="email"
            placeholder="Enter your email address"
            {...formRegister("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email address",
              },
            })}
            error={errors.email}
          />
          <Input
            label="Aadhaar ID"
            name="aadhaarId"
            placeholder="Enter your 12-digit Aadhaar ID"
            {...formRegister("aadhaarId", {
              required: "Aadhaar ID is required",
              pattern: {
                value: /^\d{12}$/,
                message: "Aadhaar ID must be 12 digits",
              },
            })}
            error={errors.aadhaarId}
          />
          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="Create a strong password"
            {...formRegister("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            error={errors.password}
          />
          <Input
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            {...formRegister("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
            error={errors.confirmPassword}
          />
          <Button
            type="submit"
            fullWidth
            isLoading={isLoading}
            disabled={isLoading}
          >
            Register
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-primary hover:underline"
          >
            Login here
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default VoterRegisterPage;
