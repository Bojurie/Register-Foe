import React from "react";
import { motion } from "framer-motion";
import './HowitWorks.css'

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="how-it-works-section">
      <motion.h2
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        How <span>We Elect</span> Works
      </motion.h2>
      <div className="steps-container">
        <motion.div className="step" whileHover={{ scale: 1.05 }}>
          <h3>Step 1: Create Elections</h3>
          <p>Set up elections or polls for positions and key topics.</p>
        </motion.div>
        <motion.div className="step" whileHover={{ scale: 1.05 }}>
          <h3>Step 2: Invite Participants</h3>
          <p>Invite employees to vote in secure, private elections.</p>
        </motion.div>
        <motion.div className="step" whileHover={{ scale: 1.05 }}>
          <h3>Step 3: Cast Votes and View Results</h3>
          <p>Let participants vote from any device and track results.</p>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
