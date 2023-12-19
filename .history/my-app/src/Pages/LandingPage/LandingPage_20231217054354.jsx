import React from "react";
import { motion } from "framer-motion";
import "./LandingPage.css"; // Make sure to create this CSS file

const LandingPage = () => {
  return (
    <motion.div
      className="LandingPage"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      <h1>Welcome to WE ELECT</h1>
      <h3>Hand in hand we can choose a better future</h3>
    </motion.div>
  );
};

export default LandingPage;
