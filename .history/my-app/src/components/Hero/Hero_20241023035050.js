import React from "react";
import { motion } from "framer-motion";
import "./Hero.css";
import LandingLogo from "../../components/images/image2vector.svg";

const Hero = () => {
  return (
    <section id="hero" className="hero-section">
      <div className="hero-container">
        <motion.h1
          className="hero-title"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Empower Your Team with <span>We Elect</span>
        </motion.h1>
        <motion.p
          className="hero-description"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          The ultimate platform for voting, selecting candidates, and engaging
          with company news and topics.
        </motion.p>
        <motion.a
          href="#features"
          className="cta-button"
          whileHover={{ scale: 1.1 }}
        >
          Learn More
        </motion.a>
      </div>
      <motion.div
        className="hero-image"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <img src={LandingLogo} alt="We Elect App" />
      </motion.div>
    </section>
  );
};

export default Hero;
