import React from "react";
import { motion } from "framer-motion";
import { WiThunderstorm } from "react-icons/wi";

const ThunderstormAnimation = () => {
  return (
    <motion.div
      animate={{ y: [0, 10, 0] }}
      transition={{ duration: 0.5, repeat: Infinity }}
    >
      <WiThunderstorm />
    </motion.div>
  );
};

export default ThunderstormAnimation;
