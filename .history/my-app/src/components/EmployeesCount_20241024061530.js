import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUsers } from "react-icons/fa"; // Using react-icons for the user icon
import { motion } from "framer-motion";
import "./EmployeesCount.css"; // Custom CSS for styling

const EmployeesCount = ({ companyCode }) => {
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTotalEmployees = async () => {
      try {
        const response = await axios.get(
          `/api/users/byCompanyCode/${companyCode}`
        );
        setTotalEmployees(response.data.totalUsers);
        setLoading(false);
      } catch (err) {
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
            {totalEmployees} Employees
          </motion.h2>
        </div>
      )}
    </motion.div>
  );
};

export default EmployeesCount;
