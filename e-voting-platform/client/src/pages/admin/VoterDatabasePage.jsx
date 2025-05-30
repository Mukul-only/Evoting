import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { getAllVoters } from "../../services/adminService"; // You created this in adminService.js
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { format } from "date-fns";

const VoterDatabasePage = () => {
  const [voters, setVoters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchVoters = async () => {
      setIsLoading(true);
      try {
        const data = await getAllVoters();
        setVoters(data);
      } catch (err) {
        toast.error(err.message || "Failed to fetch voters.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchVoters();
  }, []);

  const filteredVoters = voters.filter(
    (voter) =>
      voter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voter.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voter.aadhaarId.includes(searchTerm)
  );

  if (isLoading)
    return (
      <div className="p-6 flex justify-center">
        <LoadingSpinner />
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6"
    >
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Voter Database
      </h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Name, Email, or Aadhaar ID..."
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {filteredVoters.length === 0 ? (
        <p className="text-gray-600">No voters found matching your criteria.</p>
      ) : (
        <div className="bg-white shadow-lg rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Aadhaar ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Registered On
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Verified
                </th>
                {/* Add actions like verify/deactivate if implemented */}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVoters.map((voter) => (
                <tr key={voter._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {voter.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {voter.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {voter.aadhaarId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(voter.createdAt), "PP")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        voter.isVerified
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {voter.isVerified ? "Yes" : "No"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default VoterDatabasePage;
