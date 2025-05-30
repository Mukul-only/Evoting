import api from "./api";

const ELECTION_BASE_URL = "/elections";

export const createElection = async (electionData) => {
  try {
    const response = await api.post(ELECTION_BASE_URL, electionData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getElections = async (params = {}) => {
  try {
    const response = await api.get(ELECTION_BASE_URL, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getActiveElectionsForVoter = async () => {
  try {
    const response = await api.get(`${ELECTION_BASE_URL}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getElectionById = async (electionId) => {
  try {
    const response = await api.get(`${ELECTION_BASE_URL}/${electionId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Function to update an election
export const updateElection = async (electionId, electionData) => {
  // ⭐ ADDED EXPORT
  try {
    const response = await api.put(
      `${ELECTION_BASE_URL}/${electionId}`,
      electionData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Function to delete an election
export const deleteElection = async (electionId) => {
  // ⭐ ADDED EXPORT
  try {
    const response = await api.delete(`${ELECTION_BASE_URL}/${electionId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const addCandidateToElection = async (electionId, candidateData) => {
  try {
    const response = await api.post(
      `${ELECTION_BASE_URL}/${electionId}/candidates`,
      candidateData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getCandidatesForElection = async (electionId) => {
  try {
    const response = await api.get(
      `${ELECTION_BASE_URL}/${electionId}/candidates`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getElectionResults = async (electionId) => {
  try {
    const response = await api.get(
      `${ELECTION_BASE_URL}/${electionId}/results`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getCandidateById = async (electionId, candidateId) => {
  try {
    const response = await api.get(
      `${ELECTION_BASE_URL}/${electionId}/candidates/${candidateId}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateCandidateInElection = async (
  electionId,
  candidateId,
  candidateData
) => {
  try {
    const response = await api.put(
      `${ELECTION_BASE_URL}/${electionId}/candidates/${candidateId}`,
      candidateData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteCandidateFromElection = async (electionId, candidateId) => {
  try {
    const response = await api.delete(
      `${ELECTION_BASE_URL}/${electionId}/candidates/${candidateId}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
