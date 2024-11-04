import React, { useState, useEffect } from "react";
import { FaUsers } from "react-icons/fa"; // Optional: Add icons for styling
import { motion } from "framer-motion"; // For animation effects
import axiosInstance from "./axiosInstance"; // Make sure axiosInstance is correctly configured
import "./EmployeesCount.css"; // Ensure proper CSS styling

const EmployeesCount = ({ companyCode }) => {
  const [totalEmployees, setTotalEmployees] = useState(0); // State to hold the total number of employees
  const [users, setUsers] = useState([]); // State to hold the list of users
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        // API request to fetch users by company code
        const response = await axiosInstance.get(
          `/user/users/byCompanyCode/${companyCode}`
        );

        // Log the total number of users for debugging
        console.log(
          `Total users for companyCode ${companyCode}:`,
          response.data.totalUsers
        );

        // Set the totalEmployees and users states from the response
        if (response.data && response.data.totalUsers !== undefined) {
          setTotalEmployees(response.data.totalUsers); // Set the total number of users
          setUsers(response.data.users); // Set the user data
          setError(null); // Clear any previous error
        } else {
          setError("No employees found for this company."); // If no users are found
        }
      } catch (err) {
        console.error("Error fetching employees:", err); // Log any errors
        setError("Failed to fetch the total number of employees");
      } finally {
        setLoading(false); // Disable loading state
      }
    };

    fetchEmployees();
  }, [companyCode]); // Dependency array includes companyCode, so the effect re-runs when companyCode changes

  return (
    <motion.div
      className="employees-count-container"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {loading ? (
        <div className="loading-spinner">Loading...</div> // Placeholder for loading state
      ) : error ? (
        <p className="error-message">{error}</p> // Display error if one occurs
      ) : (
        <div className="employees-count-box">
          <FaUsers className="employees-icon" /> {/* Optional icon */}
          <motion.h2
            className="employees-count"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {totalEmployees} Employees{" "}
            {/* Display the total number of employees */}
          </motion.h2>
          {/* Optionally render the list of users */}
          {users.length > 0 && (
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
          )}
        </div>
      )}
    </motion.div>
  );
};

export default EmployeesCount;
