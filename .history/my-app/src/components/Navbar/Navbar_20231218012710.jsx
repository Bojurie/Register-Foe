import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./Navbar.css";
import LogoLeft from '../images/logo4-2.png';
import LogoRight from '../images/logo5.png';

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
        <motion.div
          className="Logo-Left"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 50 }}
        >
          <img src={LogoLeft} alt="Logo" />
        </motion.div>

        <motion.div
          className="Logo-Right"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 50 }}
        >
          <img src={LogoRight} alt="Logo" />
        </motion.div>
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
