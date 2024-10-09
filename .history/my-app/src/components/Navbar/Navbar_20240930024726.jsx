import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./Navbar.css";
import LogoLeft from "../images/logo4-2.png";
import LogoRight from "../images/logo5.png";
import LogoutButton from "../LogoutButton";
import { AuthContext } from "../AuthContext/AuthContext";

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  const navbarVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0 },
  };

  const linkVariants = {
    hover: { scale: 1.1 },
  };

  const navigationLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/register", label: "Register" },
    user && { to: "/main", label: "Dashboard" },
    !user && { to: "/login", label: "Login" },
  ].filter(Boolean);

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
          transition={{ duration: 1.5, ease: "easeInOut" }}
        >
          <img src={LogoLeft} alt="Logo Left" />
        </motion.div>

        <motion.div
          className="Logo-Right"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        >
          <img src={LogoRight} alt="Logo Right" />
        </motion.div>
      </div>

      <div className="MobileMenuIcon" onClick={toggleMobileMenu}>
        <div className={`hamburger ${mobileMenuOpen ? "open" : ""}`}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <ul className={`Nav-Links ${mobileMenuOpen ? "open" : ""}`}>
        {navigationLinks.map(({ to, label }) => (
          <motion.li key={label} whileHover="hover" variants={linkVariants}>
            <Link to={to} onClick={closeMobileMenu}>
              {label}
            </Link>
          </motion.li>
        ))}

        {user && (
          <motion.li>
            <LogoutButton />
          </motion.li>
        )}
      </ul>
    </motion.nav>
  );
};

export default Navbar;
