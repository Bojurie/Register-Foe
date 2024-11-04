import React, { useState, useEffect, useCallback } from "react";
import { FaUsers } from "react-icons/fa";
import { motion } from "framer-motion";
import "./EmployeesCount.css"; // Custom styling
import { useAuth } from "./AuthContext/AuthContext";

const EmployeesCount = ({ companyCode }) => {
  const [totalEmployees, setTotalEmployees] = useState(0); // State for the total number of employees
  const [users, setUsers] = useState([]); // State for user list
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
const [getUsersByCompanyCode] = useAuth()
  // Function to fetch users by company code
  const fetchUserByCompanyCode = useCallback(async (companyCode) => {
    if (!companyCode) {
      console.error("Company code is required to fetch users.");
      return [];
    }

    try {
      const users = await getUsersByCompanyCode(companyCode);

      if (users.length > 0) {
        return users;
      } else {
        console.warn(`No users found for company code: ${companyCode}`);
        return [];
      }
    } catch (error) {
      console.error("Error fetching users by company code:", error);
      return [];
    }
  }, []);

  // Fetch total employees when companyCode changes
  useEffect(() => {
    const fetchEmployees = async () => {
      if (!companyCode) {
        setError("Company code is missing.");
        setLoading(false);
        return;
      }

      try {
        // Fetch data using the fetchUserByCompanyCode function
        const users = await fetchUserByCompanyCode(companyCode);

        // Log the response for debugging
        console.log(
          `Total users for companyCode ${companyCode}:`,
          users.length
        );

        // Update state with the number of users and user data
        setTotalEmployees(users.length);
        setUsers(users);
        setError(null); // Clear any previous errors
      } catch (err) {
        console.error("Error fetching employees:", err);
        setError("Failed to fetch the total number of employees.");
      } finally {
        setLoading(false); // Disable loading spinner
      }
    };

    fetchEmployees();
  }, [companyCode, fetchUserByCompanyCode]); // Dependencies include companyCode and fetchUserByCompanyCode

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
