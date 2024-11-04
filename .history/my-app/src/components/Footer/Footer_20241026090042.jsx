import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import "./Footer.css";
import { useAuth } from "../AuthContext/AuthContext";

const Footer = () => {
  const { user } = useAuth();
  const [timer, setTimer] = useState(0);

  // Helper function to calculate time difference
  const calculateTimeDiff = useCallback(() => {
    const loginTime = user?.loginTime
      ? new Date(user.loginTime).getTime()
      : null;
    if (loginTime) {
      const now = Date.now();
      const diff = Math.floor((now - loginTime) / 1000);
      setTimer(diff);
    }
  }, [user?.loginTime]);

  useEffect(() => {
    calculateTimeDiff(); // Initial calculation

    const interval = setInterval(calculateTimeDiff, 1000);
    return () => clearInterval(interval); // Clean up on unmount
  }, [calculateTimeDiff]);

  // Format time display as HH:MM:SS
  const formattedTimer = () => {
    const hours = String(Math.floor(timer / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((timer % 3600) / 60)).padStart(2, "0");
    const seconds = String(timer % 60).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <motion.footer
      className="footer"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {user && (
        <motion.div
          className="timer"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <p>{`Time logged in: ${formattedTimer()}`}</p>
        </motion.div>
      )}
      <p className="footer-text">
        &copy; {new Date().getFullYear()} Beautiful Responsive Web
      </p>
    </motion.footer>
  );
};

export default Footer;
