import React from "react";
import { motion } from "framer-motion";

const StatCard = ({ title, value, icon, color = "primary" }) => {
  const colors = {
    primary: "bg-indigo-500",
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    purple: "bg-purple-500",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-lg rounded-lg p-6 flex items-center space-x-4"
    >
      <div
        className={`p-3 rounded-full ${
          colors[color] || colors.primary
        } text-white`}
      >
        {React.cloneElement(icon, { className: "h-6 w-6" })}
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-2xl font-semibold text-gray-800">{value}</p>
      </div>
    </motion.div>
  );
};

export default StatCard;
