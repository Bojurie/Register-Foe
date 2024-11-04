import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./Footer.css";
import { useAuth } from "../AuthContext/AuthContext";

const Footer = () => {
  const { user } = useAuth();
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (!user?.loginTime) return; // Avoid setting interval if loginTime is not available
    const loginTime = new Date(user.loginTime).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = now - loginTime;
      const diffInSeconds = Math.floor(diff / 1000);
      setTimer(diffInSeconds);
    }, 1000);

    return () => clearInterval(interval); // Clean up interval on unmount
  }, [user?.loginTime]);

  const formattedTimer = () => {
    const seconds = timer % 60;
    const minutes = Math.floor(timer / 60) % 60;
    const hours = Math.floor(timer / 3600);
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
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
          animate={{ rotate: 360, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            duration: 0.5,
          }}
        >
          <p>{`Time logged in: ${formattedTimer()}`}</p>
        </motion.div>
      )}
      <p className="footer-text">
        Copyright &copy; {new Date().getFullYear()} Beautiful Responsive Web
      </p>
    </motion.footer>
  );
};

export default Footer;
