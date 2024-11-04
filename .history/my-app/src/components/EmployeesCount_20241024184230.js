import React, { useState, useEffect, useCallback } from "react";
import { FaUsers } from "react-icons/fa";
import { motion } from "framer-motion";
import axiosInstance from "./axiosInstance"; // Assuming axiosInstance is correctly configured
import "./EmployeesCount.css"; // Custom styling

const EmployeesCount = ({ companyCode }) => {
  const [totalEmployees, setTotalEmployees] = useState(0); // State for the total number of employees
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Function to fetch the total number of users by company code
  const fetchUserByCompanyCode = useCallback(async (companyCode) => {
    if (!companyCode) {
      console.error("Company code is required to fetch users.");
      setError("Company code is missing.");
      return 0;
    }

    try {
      const response = await axiosInstance.get(
        `/user/users/byCompanyCode/${companyCode}`
      );

      if (response.status === 200 && response.data.totalUsers !== undefined) {
        console.log(
          `Total users for companyCode ${companyCode}:`,
          response.data.totalUsers
        );
        return response.data.totalUsers; // Return the total number of users
      } else {
        console.warn(`No users found for company code: ${companyCode}`);
        return 0; // Return 0 if no users are found
      }
    } catch (error) {
      console.error("Error fetching users by company code:", error);
      setError("Failed to fetch the total number of employees.");
      return 0; // Return 0 in case of an error
    }
  }, []);

  // Fetch total employees when companyCode changes
  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true); // Start loading
      const totalUsers = await fetchUserByCompanyCode(companyCode); // Fetch total users
      setTotalEmployees(totalUsers); // Update total employees state
      setLoading(false); // Disable loading spinner
    };

    fetchEmployees();
  }, [companyCode, fetchUserByCompanyCode]); // Re-fetch data when companyCode changes

  return (
    <motion.div
      className="employees-count-container"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {loading ? (
        <p>Loading...</p> // Show loading text
      ) : error ? (
        <p className="error-message">{error}</p> // Show error message if any
      ) : (
        <div className="employees-count-box">
          <FaUsers className="employees-icon" />
          <motion.h2
            className="employees-count"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {totalEmployees} Employees{" "}
            {/* Display the total number of employees */}
          </motion.h2>
        </div>
      )}
    </motion.div>
  );
};

export default EmployeesCount;
