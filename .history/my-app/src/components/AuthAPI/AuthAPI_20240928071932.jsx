import axios from "axios";
import axiosInstance from "../../components/axiosInstance";

const BASE_URL = "http://localhost:3001";
const API_BASE_URL = `${BASE_URL}/auth`;

const handleApiError = (error, message) => {
  console.error(`${message}:`, error);
  throw new Error(error.response?.data?.error || message);
};

const registerUser = async (formData) => {
  try {
    const response = await axiosInstance.post(
      `${API_BASE_URL}/register`,
      formData
    );
    return response.data;
  } catch (error) {
    handleApiError(error, "Registration failed");
  }
};

const registerCompany = async (formData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/company/register`,
      formData
    );
    return response.data;
  } catch (error) {
    handleApiError(error, "Company registration failed");
  }
};

const login = async (formData) => {
  try {
    const response = await axiosInstance.post(
      `${API_BASE_URL}/login`,
      formData
    );
    return response.data;
  } catch (error) {
    handleApiError(error, "Login failed");
  }
};

const saveElection = async (electionData) => {
  try {
    const electionIds = Array.isArray(electionData)
      ? electionData.map((data) => data.electionId)
      : [electionData.electionId];
    const response = await axiosInstance.post("/savedElection/save-elections", {
      electionIds,
    });

    return response.status === 201
      ? { success: true, user: response.data.user }
      : { success: false, user: null, error: "Failed to save election" };
  } catch (error) {
    handleApiError(error, "Failed to save election");
  }
};

const createElection = async (formData) => {
  try {
    const response = await axiosInstance.post(
      "/election/create-election",
      formData
    );
    return response.data;
  } catch (error) {
    handleApiError(error, "Failed to create election");
  }
};

const newReminder = async (formData) => {
  try {
    const response = await axiosInstance.post("/reminder/reminders", formData);
    return response.data;
  } catch (error) {
    handleApiError(error, "Failed to create reminder");
  }
};

const fetchReminder = async (userId) => {
  try {
    const response = await axiosInstance.get(`/reminder/reminders/${userId}`);
    return response.data;
  } catch (error) {
    handleApiError(error, "Failed to fetch reminder");
  }
};

const handleDeleteReminder = async (reminderId) => {
  try {
    const response = await axiosInstance.delete(
      `/reminder/reminders/${reminderId}`
    );
    return response.data;
  } catch (error) {
    handleApiError(error, "Failed to delete reminder");
  }
};

export {
  login,
  registerUser,
  registerCompany,
  createElection,
  saveElection,
  newReminder,
  fetchReminder,
  handleDeleteReminder,
};
