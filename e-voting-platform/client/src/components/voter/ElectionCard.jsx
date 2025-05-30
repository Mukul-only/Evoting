import React from "react";
import { Link } from "react-router-dom";
import { ClockIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns"; // npm install date-fns

const ElectionCard = ({ election, userRole, hasVoted }) => {
  const now = new Date();
  const hasEnded = new Date(election.endTime) < now;
  const hasStarted = new Date(election.startTime) <= now;
  const isActive = hasStarted && !hasEnded;

  let actionButton;
  if (userRole === "voter") {
    if (isActive && !hasVoted) {
      actionButton = (
        <Link
          to={`/election/${election._id}/vote`}
          className="btn-primary inline-flex items-center px-4 py-2 text-sm"
        >
          View Candidates & Vote <ChevronRightIcon className="ml-2 h-4 w-4" />
        </Link>
      );
    } else if (hasVoted) {
      actionButton = (
        <span className="inline-flex items-center px-4 py-2 text-sm font-medium text-green-700 bg-green-100 rounded-md">
          Voted
        </span>
      );
    } else if (hasEnded) {
      actionButton = // Voter can see results if election ended
        (
          <Link
            to={`/election/${election._id}/results`} // Assuming a results page for voters too
            className="btn-outline inline-flex items-center px-4 py-2 text-sm"
          >
            View Results <ChevronRightIcon className="ml-2 h-4 w-4" />
          </Link>
        );
    } else if (!hasStarted) {
      actionButton = (
        <span className="inline-flex items-center px-4 py-2 text-sm font-medium text-yellow-700 bg-yellow-100 rounded-md">
          Starts Soon
        </span>
      );
    }
  } else if (userRole === "admin") {
    actionButton = (
      <Link
        to={`/admin/elections/${election._id}/results`} // Or manage election page
        className="btn-primary inline-flex items-center px-4 py-2 text-sm"
      >
        View Detailed Results <ChevronRightIcon className="ml-2 h-4 w-4" />
      </Link>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-6 hover:shadow-xl transition-shadow">
      <h3 className="text-xl font-semibold text-primary mb-2 capitalize">
        {election.name}
      </h3>
      {election.description && (
        <p className="text-sm text-gray-600 mb-3">{election.description}</p>
      )}
      <div className="text-sm text-gray-500 mb-4">
        <div className="flex items-center mb-1">
          <ClockIcon className="h-4 w-4 mr-2 text-gray-400" />
          <span>Starts: {format(new Date(election.startTime), "Pp")}</span>
        </div>
        <div className="flex items-center">
          <ClockIcon className="h-4 w-4 mr-2 text-gray-400" />
          <span>Ends: {format(new Date(election.endTime), "Pp")}</span>
        </div>
      </div>
      {actionButton}
    </div>
  );
};

export default ElectionCard;
