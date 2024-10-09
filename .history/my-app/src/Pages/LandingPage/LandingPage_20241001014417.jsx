import React from "react";
import "./LandingPage.css";
import LandingLogo from "../../components/images/image2vector.svg";
import { motion } from "framer-motion";

const LandingPage = () => {
  const headerVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 1.5 } },
  };

  const subHeaderVariants = {
    hidden: { y: 100, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 1.5, delay: 0.5 } },
  };

  const logoVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 2, ease: "easeInOut" },
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
        <img src={LandingLogo} alt="Landing Logo" />
      </motion.div>
      <motion.div className="text-container" initial="hidden" animate="visible">
        <motion.h1 variants={headerVariants}>Welcome to WE ELECT</motion.h1>
        <motion.h3 variants={subHeaderVariants}>
          Hand in hand we can choose a better future
        </motion.h3>
      </motion.div>
    </div>
  );
};

export default LandingPage;
