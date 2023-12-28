import axios from "axios";

const API_BASE_URL = "http://localhost:3000/auth";
const BASE_URL="http://localhost:3000 "


const handleError = (error, defaultMsg) => {
  const errMsg = error.response?.data?.message || error.message || defaultMsg;
  console.error(errMsg);
  throw new Error(errMsg);
};

const login = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, formData);
    if (response.data && response.data.user) {
      return response.data.user;
    } else {
      throw new Error("Invalid login response");
    }
  } catch (error) {
    handleError(error, "Login failed");
  }
};

const registerUser = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, formData);
    return response.data;
  } catch (error) {
    handleError(error, "Registration failed");
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
    handleError(error, "Company registration failed");
  }
};

const saveElection = async (electionData) => {
  try {
    const response = await axios.post(`${BASE_URL}/elections`, electionData);
    return response.data;
  } catch (error) {
    handleError(error, "Saving election failed");
  }
};


export { login, registerUser, registerCompany, saveElection };
