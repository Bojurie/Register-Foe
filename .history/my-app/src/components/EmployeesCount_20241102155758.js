import React, { useState, useEffect } from "react";
import { FaUsers } from "react-icons/fa";
import { motion } from "framer-motion";
import "./EmployeesCount.css";
import { EmployeesCountContainer } from "./StyledComponents";
const EmployeesCount = ({ users }) => {
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!users || users.length === 0) {
      setError("No user profiles available.");
      setLoading(false);
      setTotalEmployees(0);
      return;
    }

    setTotalEmployees(users.length);
    setLoading(false);
    setError(null);
  }, [users]);

  return (
    <EmployeesCountContainer
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
            {totalEmployees} Employees{" "}
          </motion.h2>
        </div>
      )}
    </EmployeesCountContainer>
  );
};

export default EmployeesCount;
