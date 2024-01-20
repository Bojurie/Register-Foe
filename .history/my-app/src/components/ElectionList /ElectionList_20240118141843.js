import React from "react";
import ElectionComponent from "../../components/ElectionComponent /ElectionComponent ";
import "./ElectionList.css";
import { motion } from "framer-motion";

const ElectionList = ({ elections = [] }) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div>
      <div className="Heading">
        <h2>Upcoming Elections</h2>
      </div>
      <div className="ElectionList">
        {elections.length > 0 ? (
          elections.map((election) => (
            <motion.div
              key={election._id}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5 }}
            >
              <ElectionComponent election={election} />
            </motion.div>
          ))
        ) : (
          <p>No results found.</p>
        )}
      </div>
    </div>
  );
};

export default ElectionList;

