import React from "react";
import "./LandingPage.css"; // Ensure this CSS file exists in your project
import LandingLogo from "../../components/images/logo2-2.png";
import { motion } from "framer-motion";

const LandingPage = () => {
  const headerVariants = {
    hidden: { x: -200, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 1 } },
  };

  const subHeaderVariants = {
    hidden: { x: 200, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 1 } },
  };

  const logoVariants = {
    hidden: { rotateY: 90, opacity: 0 },
    visible: {
      rotateY: 0,
      opacity: 1,
      transition: { duration: 1.5 },
    },
  };

  return (
    <div className="LandingPage">
      <motion.div
        className="LandingLogo"
        variants={logoVariants}
        initial="hidden"
        animate="visible"
      >
        <img src={LandingLogo} alt="Logo" />
      </motion.div>
      <motion.h1 variants={headerVariants} initial="hidden" animate="visible">
        Welcome to WE ELECT
      </motion.h1>
      <motion.h3
        variants={subHeaderVariants}
        initial="hidden"
        animate="visible"
      >
        Hand in hand we can choose a better future
      </motion.h3>
    </div>
  );
};

export default LandingPage;
