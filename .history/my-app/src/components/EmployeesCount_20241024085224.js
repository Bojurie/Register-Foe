import React, { useState, useEffect } from "react";
import { FaUsers } from "react-icons/fa";
import { motion } from "framer-motion";
import axiosInstance from "./axiosInstance"; 
import "./EmployeesCount.css";

const EmployeesCount = ({ companyCode }) => {
  const [totalEmployees, setTotalEmployees] = useState(0); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
  const fetchTotalEmployees = async () => {
    try {
      const response = await axiosInstance.get(
        `/user/users/byCompanyCode/${companyCode}`
      );
      console.log("API response:", response.data); // Log the API response for debugging
      if (response.data && response.data.totalUsers !== undefined) {
        setTotalEmployees(response.data.totalUsers); // Set the total number of users
      }
      setLoading(false); // Disable loading state
    } catch (err) {
      console.error("Error fetching employees:", err); // Log any errors for debugging
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
