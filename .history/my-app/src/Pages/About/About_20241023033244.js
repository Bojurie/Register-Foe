import React from "react";
import { motion } from "framer-motion";
import "./About.css";

const AboutUs = () => {
  return (
    <motion.section
      id="about"
      className="about-section"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="about-container">
        <div className="about-image">
          <img src="/images/company-building.jpg" alt="Our Company" />
        </div>
        <div className="about-content">
          <motion.h2
            className="about-title"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            About Us
          </motion.h2>
          <motion.p
            className="about-description"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.7 }}
          >
            Welcome to <span>We Elect</span>, your ultimate voting platform.
            Established with a vision to streamline internal elections and
            decision-making processes, We Elect empowers companies to engage
            employees in selecting candidates for positions and voting on key
            company topics and news.
          </motion.p>
          <motion.p
            className="about-mission"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.7 }}
          >
            <strong>Our Mission:</strong> We aim to simplify the voting process,
            making it secure and accessible for businesses of all sizes. We
            deliver transparency, efficiency, and trust through modern
            technology.
          </motion.p>
          <motion.div
            className="about-stats"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.7 }}
          >
            <div className="stat">
              <h3>5+ Years</h3>
              <p>Experience in Election Software</p>
            </div>
            <div className="stat">
              <h3>20+</h3>
              <p>Companies Served Globally</p>
            </div>
            <div className="stat">
              <h3>2K+</h3>
              <p>Votes Cast Securely</p>
            </div>
          </motion.div>
          <div className="about-cta">
            <a href="#contact" className="button">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default AboutUs;
