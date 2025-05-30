import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const NotFoundPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen bg-neutralBg text-center p-6"
    >
      <ExclamationTriangleIcon className="h-24 w-24 text-yellow-500 mb-6" />
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-3xl font-semibold text-darkText mb-3">
        Page Not Found
      </h2>
      <p className="text-mediumText mb-8 max-w-md">
        Oops! The page you are looking for does not exist. It might have been
        moved or deleted.
      </p>
      <Link to="/" className="btn btn-primary px-8 py-3 text-lg">
        Go Back Home
      </Link>
    </motion.div>
  );
};

export default NotFoundPage;
