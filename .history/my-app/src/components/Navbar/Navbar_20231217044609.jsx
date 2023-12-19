import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./Navbar.css";

const Navbar = () => {
  const navbarVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0 },
  };

  const linkVariants = {
    hover: { scale: 1.1 },
    color: 'red'
  };

  return (
    <motion.nav
      className="Nav"
      initial="hidden"
      animate="visible"
      variants={navbarVariants}
    >
      <div className="Logo">
       <h2> <span className="span-Logo">WE </span>ELECT</h2>
      </div>
      <ul className="Nav-Links">
        <motion.li whileHover="hover" variants={linkVariants}>
          <Link to="/">Home</Link>
        </motion.li>
        <motion.li whileHover="hover" variants={linkVariants}>
          <Link to="/login">Login</Link>
        </motion.li>
        <motion.li whileHover="hover" variants={linkVariants}>
          <Link to="/register">Register</Link>
        </motion.li>
        <motion.li whileHover="hover" variants={linkVariants}>
          <Link to="/about">About</Link>
        </motion.li>
      </ul>
    </motion.nav>
  );
};

export default Navbar;
