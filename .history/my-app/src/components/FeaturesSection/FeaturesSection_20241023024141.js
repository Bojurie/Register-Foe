import React from "react";
import { FaUserTie, FaChartPie, FaNewspaper } from "react-icons/fa";
import { motion } from "framer-motion";
import "./FeaturesSection.css";

const FeaturesSection = () => {
  return (
    <section id="features" className="features-section">
      <motion.h2
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        Features of <span>We Elect</span>
      </motion.h2>
      <div className="features-container">
        <motion.div className="feature-item" whileHover={{ scale: 1.05 }}>
          <FaUserTie className="feature-icon" />
          <h3>Candidate Selection</h3>
          <p>Select internal candidates for key roles with ease.</p>
        </motion.div>
        <motion.div className="feature-item" whileHover={{ scale: 1.05 }}>
          <FaChartPie className="feature-icon" />
          <h3>Voting on Topics</h3>
          <p>
            Engage employees by allowing them to vote on key company topics.
          </p>
        </motion.div>
        <motion.div className="feature-item" whileHover={{ scale: 1.05 }}>
          <FaNewspaper className="feature-icon" />
          <h3>News and Announcements</h3>
          <p>Keep your team informed and let them vote on important news.</p>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
