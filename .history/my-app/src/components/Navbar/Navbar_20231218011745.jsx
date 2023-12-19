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
      <div className="Logo-Left">
        <img src={LogoLeft} alt="Logo" />
      </div>
      <div className="Logo-Right">
        <img src={LogoRight} alt="Logo" />
      </div>
      
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
