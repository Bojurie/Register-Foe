import React from "react";
import { motion } from "framer-motion";
import "./LandingPage.css"; // Make sure to create this CSS file

const LandingPage = () => {
  const headerVariants = {
    hidden: { x: -200, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 1 } },
  };

  const subHeaderVariants = {
    hidden: { x: 200, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 1 } },
  };

  return (
    <div className="LandingPage">
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
