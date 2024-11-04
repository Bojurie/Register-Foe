import React from "react";
import { motion } from "framer-motion";
import "./AboutUs.css";

const AboutUs = () => {
  return (
    <motion.section
      id="about"
      className="about-section"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="about-container">
        <div className="about-image">
          <img src="/images/company-building.jpg" alt="Our Company" />
        </div>
        <div className="about-content">
          <h2>About Us</h2>
          <p className="about-description">
            Welcome to <span>We Elect</span>, your ultimate voting platform.
            Established with a vision to streamline internal elections and
            decision-making processes, We Elect empowers companies to
            effectively engage employees in selecting candidates for internal
            positions, as well as voting on important company topics and news.
          </p>
          <p className="about-mission">
            <strong>Our Mission:</strong> To make the voting process secure,
            simple, and accessible for businesses of all sizes. We focus on
            delivering transparency, efficiency, and trust through modern
            technology.
          </p>
          <div className="about-stats">
            <div className="stat">
              <h3>10+ Years</h3>
              <p>Experience in Election Software</p>
            </div>
            <div className="stat">
              <h3>100+</h3>
              <p>Companies Served Globally</p>
            </div>
            <div className="stat">
              <h3>50K+</h3>
              <p>Votes Cast Securely</p>
            </div>
          </div>
          <div className="about-cta">
            <a href="#contact" className="cta-button">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default AboutUs;
