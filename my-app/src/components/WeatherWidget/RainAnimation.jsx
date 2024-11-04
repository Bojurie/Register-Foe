import React from "react";
import { motion } from "framer-motion";
import { WiRain } from "react-icons/wi";

const RainAnimation = () => {
  return (
    <motion.div
      animate={{ y: [0, 10, 0] }}
      transition={{ duration: 0.5, repeat: Infinity }}
    >
      <WiRain />
    </motion.div>
  );
};

export default RainAnimation;
