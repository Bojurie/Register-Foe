import React from "react";
import { motion } from "framer-motion";
import { Container } from "react-bootstrap";
import "./CallToAction.css";

const CallToAction = () => {
  return (
    <section id="cta" className="cta-section text-center">
      <Container>
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Ready to Get Started with <span>We Elect</span>?
        </motion.h2>
        <motion.p
          className="lead"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Take your company’s voting process to the next level.
        </motion.p>
        <motion.a
          href="#contact"
          className="cta-button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          Request a Demo
        </motion.a>
      </Container>
    </section>
  );
};

export default CallToAction;
