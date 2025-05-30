import api from "./api";

const VOTE_BASE_URL = "/votes";

export const castVote = async (voteData) => {
  // { electionId, candidateId }
  try {
    const response = await api.post(VOTE_BASE_URL, voteData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
