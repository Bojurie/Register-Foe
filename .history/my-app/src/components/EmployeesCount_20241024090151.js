import React, { useState, useEffect } from "react";
import { FaUsers } from "react-icons/fa";
import { motion } from "framer-motion";
import axiosInstance from "./axiosInstance"; // Assuming axiosInstance is correctly configured
import "./EmployeesCount.css";

const EmployeesCount = ({ companyCode }) => {
  const [totalEmployees, setTotalEmployees] = useState(0); // State for the total number of employees
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [users, setUsers] = useState([]); // State to hold the actual user data

useEffect(() => {
  const fetchTotalEmployees = async () => {
    console.log("Fetching users for companyCode:", companyCode); // Log companyCode
    try {
      const response = await axiosInstance.get(
        `/user/users/byCompanyCode/${companyCode}`
      );
      console.log("API response:", response.data); // Log API response for debugging

      if (response.data && response.data.totalUsers !== undefined) {
        setTotalEmployees(response.data.totalUsers); // Set the total number of users
        setUsers(response.data.users); // Set the user data
      }
      setLoading(false); // Disable loading state
    } catch (err) {
      console.error("Error fetching employees:", err); // Log any errors
      setError("Failed to fetch the total number of employees");
      setLoading(false);
    }
  };

  fetchTotalEmployees();
}, [companyCode]);

  return (
    <motion.div
      className="employees-count-container"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <div className="employees-count-box">
          <FaUsers className="employees-icon" />
          <motion.h2
            className="employees-count"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {totalEmployees} Employees {/* Display totalEmployees here */}
          </motion.h2>

          {/* Optionally render the list of users */}
          {users.length > 0 && (
            <div className="employees-list">
              {users.map((user) => (
                <div key={user._id} className="employee-item">
                  <p>
                    {user.firstName} {user.lastName} - {user.role}
                  </p>
                  <p>Email: {user.email}</p>
                  <p>Profile: {user.userProfileDetail}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default EmployeesCount;
