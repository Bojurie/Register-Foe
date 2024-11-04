import React from "react";
import { motion } from "framer-motion";
import "./Footer.css";

const Footer = () => {
  return (
    <motion.footer
      className="footer"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <p className="footer-text">
        &copy; {new Date().getFullYear()} Beautiful Responsive Web
      </p>
    </motion.footer>
  );
};

export default Footer;
