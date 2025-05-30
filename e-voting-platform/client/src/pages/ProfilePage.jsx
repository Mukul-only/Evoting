import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";
import { getUserProfile, updateUserProfile } from "../services/userService";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import LoadingSpinner from "../components/common/LoadingSpinner";

const ProfilePage = () => {
  const { user, setUser, loading: authLoading } = useAuth(); // setUser to update context
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingProfile, setIsFetchingProfile] = useState(true);

  useEffect(() => {
    if (user && !authLoading) {
      // If user already in context
      setValue("name", user.name);
      setValue("email", user.email);
      // Aadhaar is usually not editable by user
      setIsFetchingProfile(false);
    } else if (!authLoading) {
      // Fetch if not in context (e.g. direct navigation)
      const fetchProfile = async () => {
        try {
          const profileData = await getUserProfile();
          setValue("name", profileData.name);
          setValue("email", profileData.email);
          setUser(profileData); // Update context
        } catch (error) {
          toast.error("Failed to load profile.");
        } finally {
          setIsFetchingProfile(false);
        }
      };
      fetchProfile();
    }
  }, [user, setValue, setUser, authLoading]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    const updateData = { name: data.name, email: data.email };
    if (data.password) {
      // Only include password if user entered something
      if (data.password !== data.confirmPassword) {
        toast.error("Passwords do not match.");
        setIsLoading(false);
        return;
      }
      updateData.password = data.password;
    }

    try {
      const updatedUser = await updateUserProfile(updateData);
      setUser((prevUser) => ({ ...prevUser, ...updatedUser })); // Update AuthContext
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || isFetchingProfile) {
    return (
      <div className="container mx-auto p-6 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto p-6 pt-10"
    >
      <div className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          My Profile
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Full Name"
            name="name"
            {...register("name", { required: "Name is required" })}
            error={errors.name}
          />
          <Input
            label="Email Address"
            name="email"
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email address",
              },
            })}
            error={errors.email}
          />
          <Input
            label="Aadhaar ID (Read-only)"
            name="aadhaarId"
            defaultValue={user?.aadhaarId}
            disabled
            className="bg-gray-100"
          />
          <hr className="my-4" />
          <p className="text-sm text-gray-500">Update Password (optional):</p>
          <Input
            label="New Password"
            name="password"
            type="password"
            {...register("password", {
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            error={errors.password}
            placeholder="Leave blank to keep current password"
          />
          <Input
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            {...register("confirmPassword")}
            error={errors.confirmPassword}
          />
          <Button
            type="submit"
            fullWidth
            isLoading={isLoading}
            disabled={isLoading}
          >
            Update Profile
          </Button>
        </form>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
