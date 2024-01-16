import axios from "axios";

const BASE_URL="http://localhost:3001"
const API_BASE_URL ="http://localhost:3001/auth";


const registerUser = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, formData);
    return response.data;
  } catch (error) {
   console.log(error, "Registration failed");
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
   console.log(error, "Company registration failed");
  }
};
const getUsersByCompanyCode = async (formData) => {
  try {
    const response = await axios.get(
      `${BASE_URL}user/users/byCompanyCode/:companyCode"`,
      formData
    );
    return response.data;
  } catch (error) {
    console.log(error, "Company registration failed");
  }
};



const likeUser = async (userId) => {
  try {
    const response = await axios.post(`${BASE_URL}/user/like`, { userId });
    return response.data; // Returns the updated user data or a success message
  } catch (error) {
    console.error("Error in liking user:", error);
    throw error; 
  }
};

const voteForUser = async (userId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/user/vote`, { userId });
    return response.data; 
  } catch (error) {
    console.error("Error in voting for user:", error);
    throw error; 
  }
};



const GetUsersByCode = async (companyCode) => {
  const token = localStorage.getItem("token");

  if (!companyCode) {
    console.error("Company code is undefined.");
    throw new Error("Company code is undefined.");
  }

  console.log("Token from storage:", token);
  console.log("Company Code:", companyCode);

  try {
    const response = await axios.get(
      `${BASE_URL}/user/users/byCompanyCode/${companyCode}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching users by company code:", error);
    throw error;
  }
};


const refreshTokenFunction = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken"); 
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await axios.post("/auth/token", { refreshToken });
    const { accessToken } = response.data;

    localStorage.setItem("accessToken", accessToken); 

    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

    return accessToken;
  } catch (error) {
    console.error("Error refreshing token:", error);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    throw error;
  }
};

export default refreshTokenFunction;




const saveElection = async (electionData) => {
  try {
    const response = await axios.post(`${BASE_URL}/savedElection/save-election`, electionData);
    return response.data;
  } catch (error) {
    console.log(error, "Saving election failed");
  }
};


const verifyCompanyCode = async (companyCode) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/company/verifyCode/:companyCode/${companyCode}`
    );
    return response.data;
  } catch (error) {
    console.error("Error verifying company code:", error);
    throw error; 
  }
};



const createElection = async (formData) => {
  try {
    const fullUrl = `${BASE_URL}/election/create-election`;
    const response = await axios.post(fullUrl, formData);
    return response.data;
  } catch (error) {
    console.error("Error in createElection:", error);
    throw new Error(error.response?.data?.error || "Creating election failed");
  }
};

const createTopic = async (formData) => {
  try {
    console.log("Sending topic data:", formData); // For debugging
    const response = await axios.post(`${BASE_URL}/topic/topics`, formData);
    return response.data;
  } catch (error) {
    console.error("Error creating topic:", error);
    throw error; // Rethrow the error for handling in the calling function
  }
};



const GetTopicsByCode = async (companyCode) => {
  if (!companyCode) {
    console.error("Company code is undefined or null");
    return []; // Return an empty array or handle the error as you see fit
  }
  try {
    const response = await axios.get(
      `${BASE_URL}/topic/topics?companyCode=${companyCode}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching topics:", error);
    throw error;
  }
};


const GetUpComingElections = async () => {
   const token = localStorage.getItem("token");
   console.log("Token from storage:", token);

  try {
    const response = await axios.get(
      `${BASE_URL}/election/upcoming-elections`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data; // Returns the list of upcoming elections
  } catch (error) {
    console.error("Error fetching upcoming elections:", error);

    throw error;
  }
};



const login = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, formData);
    console.log("Raw axios response:", response);
    return response.data; 
  } catch (error) {
    console.error("Login error:", error.response?.data?.error || error.message);
    throw {
      message: error.response?.data?.error || "An error occurred during login.",
      statusCode: error.response?.status,
    };
  }
};


export {
  login,
  createTopic,
 GetUpComingElections,
  registerUser,
  getUsersByCompanyCode,
  registerCompany,
  voteForUser,
  likeUser,
  createElection,
  saveElection,
  GetTopicsByCode,
  GetUsersByCode,
  verifyCompanyCode,
  refreshTokenFunction,
};
