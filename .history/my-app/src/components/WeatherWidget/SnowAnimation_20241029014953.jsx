import React from "react";
import { motion } from "framer-motion";
import { WiSnow } from "react-icons/wi";

const SnowAnimation = () => {
  return (
    <motion.div
      animate={{ y: [0, 10, 0] }}
      transition={{ duration: 0.5, repeat: Infinity }}
    >
      <WiSnow />
    </motion.div>
  );
};

export default SnowAnimation;
