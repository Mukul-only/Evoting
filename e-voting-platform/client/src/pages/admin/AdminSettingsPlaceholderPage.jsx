// client/src/pages/admin/AdminSettingsPlaceholderPage.jsx
import React from "react";
import { motion } from "framer-motion";
import { Cog8ToothIcon } from "@heroicons/react/24/outline";

const AdminSettingsPlaceholderPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 flex flex-col items-center justify-center h-full" // Adjust height as needed
    >
      <Cog8ToothIcon className="h-24 w-24 text-gray-400 mb-6" />
      <h1 className="text-2xl font-semibold text-gray-700 mb-3">Settings</h1>
      <p className="text-gray-500 text-center max-w-md">
        This section is under construction. System settings and configurations
        will be available here in a future update.
      </p>
    </motion.div>
  );
};

export default AdminSettingsPlaceholderPage;
