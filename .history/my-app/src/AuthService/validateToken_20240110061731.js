import { getStoredToken } from "../components/LocalStorageManager/LocalStorageManager";
import axiosInstance from "../components/axiosInstance";

 export default const validateToken = async (token) => {
   try {
     const response = await axiosInstance.get("/user/users/validate-token", {
       headers: { Authorization: `Bearer ${token}` },
     });
     return response.data.isValid;
   } catch (error) {
     console.error("Token validation error:", error);
     return false;
   }
 };

