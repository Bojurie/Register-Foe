import React, { useState, useEffect } from "react";
import { FaUsers } from "react-icons/fa";
import { motion } from "framer-motion";
import "./EmployeesCount.css"; // Assuming you have some custom styling

const EmployeesCount = ({ users }) => {
  const [totalEmployees, setTotalEmployees] = useState(0); // State for the total number of employees
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Calculate total number of users when users prop is passed
  useEffect(() => {
    if (!users || users.length === 0) {
      setError("No user profiles available.");
      setLoading(false);
      setTotalEmployees(0);
      return;
    }

    // Calculate total users
    setTotalEmployees(users.length);
    setLoading(false);
    setError(null); // Clear any previous errors
  }, [users]);

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
