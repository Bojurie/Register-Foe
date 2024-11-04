import React, { useState, useEffect } from "react";
import { FaUsers } from "react-icons/fa";
import { motion, useAnimation } from "framer-motion";
import "./EmployeesCount.css";

const EmployeesCount = ({ users }) => {
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const controls = useAnimation();

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

  // Animation cycle for adding a new employee
  useEffect(() => {
    const interval = setInterval(() => {
      controls.start("walk");
    }, 5000); // Runs every 5 seconds

    return () => clearInterval(interval);
  }, [controls]);

  const employeeVariants = {
    hidden: { x: "-100%", opacity: 0 },
    walk: { x: "40%", opacity: 1, transition: { duration: 2 } },
    enterDoor: { x: "50%", opacity: 0, transition: { duration: 1 } },
  };

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
          {/* Icon animation of the walking employee */}
          <motion.div
            className="employee-icon-container"
            variants={employeeVariants}
            initial="hidden"
            animate={controls}
            onAnimationComplete={() => {
              controls.start("enterDoor");
              setTotalEmployees((prev) => prev + 1); // Simulate new employee count
            }}
          >
            <motion.div
              className="walking-employee"
              variants={employeeVariants}
            >
              <FaUsers size={30} className="employee-icon" />
            </motion.div>
          </motion.div>

          {/* Door animation that transforms into the employee count */}
          <motion.div className="door-icon">
            <motion.div
              className="door-frame"
              initial={{ opacity: 1 }}
              animate={{
                opacity: totalEmployees % 2 === 0 ? 1 : 0, // Alternate to give illusion of new employee
              }}
              transition={{ duration: 0.3 }}
            >
              <FaUsers size={50} />
            </motion.div>
            <motion.h2
              className="employees-count"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {totalEmployees} Employees
            </motion.h2>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default EmployeesCount;
