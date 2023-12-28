import { GetTopicsByCode, GetUsersByCode } from "../AuthAPI/AuthAPI";

export const useApi = () => {
  // Function to fetch users by their company code
  const fetchUserByCompanyCode = async (companyCode) => {
    try {
      const response = await GetUsersByCode(companyCode);
      return response.data;
    } catch (error) {
      console.error("Error fetching users by company code:", error);
      throw error;
    }
  };
  const fetchTopicsByCompanyCode = async (companyCode) => {
    try {
      const response = await GetTopicsByCode(companyCode);
      return response.data;
    } catch (error) {
      console.error("Error fetching topics by company code:", error);
      throw error;
    }
  };

  return { fetchUserByCompanyCode, fetchTopicsByCompanyCode };
};
