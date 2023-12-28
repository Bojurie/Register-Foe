import axios from "axios";

const BASE_URL="http://localhost:3000"
const API_BASE_URL ="http://localhost:3000/auth";





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
      `${API_BASE_URL}/user/users/:companyCode`,
      formData
    );
    return response.data;
  } catch (error) {
    console.log(error, "Company registration failed");
  }
};


const GetUsersByCode = async () => {
  const token = localStorage.getItem("token"); // Retrieve the stored token

  console.log("Token from storage:", token);

  try {
    const response = await axios.get(`${BASE_URL}/user/users/byCompanyCode`, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the request header
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching users by company code:", error);
    throw error;
  }
};



const refreshTokenFunction = () => {
  // Replace with your actual refresh token endpoint and method
  return axios
    .post("/auth/refresh", {
      refreshToken: localStorage.getItem("refreshToken"), // or wherever you store your refresh token
    })
    .then((response) => {
      const { accessToken } = response.data;
      localStorage.setItem("token", accessToken); // Update the access token in local storage
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      return accessToken;
    });
};




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
    // Assuming the API returns a boolean or some meaningful data to indicate if the code is valid
    return response.data;
  } catch (error) {
    console.error("Error verifying company code:", error);
    throw error; // Throw error to be handled by the caller
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
  try {
    const response = await axios.get(`${BASE_URL}/topic/topics/byCompanyCode`);
    return response.data;
    
  } catch (error) {
    console.error("Error fetching topics:", error);
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
    throw error;
  }
};


export {
  login,
  createTopic,
  registerUser,
  getUsersByCompanyCode,
  registerCompany,
  createElection,
  saveElection,
  GetTopicsByCode,
  GetUsersByCode,
  verifyCompanyCode,
  refreshTokenFunction,
};
