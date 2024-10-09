import React, { useState } from "react";
import ElectionComponent from "../../components/ElectionComponent /ElectionComponent ";
import "./ElectionList.css";
import { motion, AnimatePresence } from "framer-motion";

const ElectionList = ({ elections = [] }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleCollapse = () => setIsCollapsed((prev) => !prev);

  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="ElectionList-Wrapper">
      <div
        className="Heading"
        onClick={toggleCollapse}
        style={{ cursor: "pointer" }}
        aria-expanded={!isCollapsed}
      >
        <h1>Upcoming Elections {isCollapsed ? "(Show)" : "(Hide)"}</h1>
      </div>
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            className="ElectionList"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={listVariants}
          >
            {Array.isArray(elections) && elections.length > 0 ? (
              elections.map((election) => (
                <motion.div key={election._id} variants={itemVariants}>
                  <ElectionComponent election={election} />
                </motion.div>
              ))
            ) : (
              <p>No upcoming elections found.</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ElectionList;