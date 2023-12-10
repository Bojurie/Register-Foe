import axios from "axios";

export const loginUser = async (formData) => {
  try {
    const response = await axios.post(
      "http://localhost:3001/auth/login",
      formData
    );
    return response.data;
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
    throw new Error("Invalid username or password.");
  }
};
