import React from "react";
import "./LandingPage.css"; // Ensure this CSS file exists in your project
import LandingLogo from "../../components/images/image2vector.svg";
import { motion } from "framer-motion";
import SvgComponent from "../../components/SvgComponent/SvgComponent";

const LandingPage = () => {
  const headerVariants = {
    hidden: { x: -300, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 2 } },
  };

  const subHeaderVariants = {
    hidden: { x: 300, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 2 } },
  };

  const logoVariants = {
    hidden: { rotateY: 90, opacity: 0 },
    visible: {
      rotateY: 0,
      opacity: 1,
      transition: { duration: 2.5 },
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
        
        <img src={LandingLogo} alt="LadingLogo" />
      </motion.div>
    <div>
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
     
    </div>
  );
};

export default LandingPage;
