import React, { useState, useEffect } from "react";
import { FaUsers } from "react-icons/fa";
import { motion } from "framer-motion";
import axiosInstance from "./axiosInstance"; // Ensure axiosInstance is configured properly
import "./EmployeesCount.css"; // Assuming you have some custom styling

const EmployeesCount = ({ companyCode }) => {
  const [totalEmployees, setTotalEmployees] = useState(0); // State for the total number of employees
  const [users, setUsers] = useState([]); // State for user list
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch total employees when companyCode changes
  useEffect(() => {
    const fetchEmployees = async () => {
      if (!companyCode) {
        setError("Company code is missing.");
        setLoading(false);
        return;
      }

      try {
        // Fetch data from the server
        const response = await axiosInstance.get(
          `/user/users/byCompanyCode/${companyCode}`
        );

        // Log the response for debugging
        console.log(
          `Total users for companyCode ${companyCode}:`,
          response.data.totalUsers
        );

        // Update state with response data
        setTotalEmployees(response.data.totalUsers);
        setUsers(response.data.users);
        setError(null); // Clear any previous errors
      } catch (err) {
        console.error("Error fetching employees:", err);
        setError("Failed to fetch the total number of employees.");
      } finally {
        setLoading(false); // Disable loading spinner
      }
    };

    fetchEmployees();
  }, [companyCode]); // Re-fetch data when companyCode changes

  return (
    <motion.div
      className="employees-count-container"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {loading ? (
        <p>Loading...</p> // Show loading spinner or text
      ) : error ? (
        <p className="error-message">{error}</p> // Show error if any
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

          {/* Render the list of users */}
          {users.length > 0 ? (
            <div className="employees-list">
              {users.map((user) => (
                <motion.div
                  key={user._id}
                  className="employee-item"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p>
                    <strong>
                      {user.firstName} {user.lastName}
                    </strong>{" "}
                    - {user.role}
                  </p>
                  <p>Email: {user.email}</p>
                  <p>Profile: {user.userProfileDetail}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <p>No employees found.</p>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default EmployeesCount;
