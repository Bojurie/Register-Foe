import React from "react";
import ElectionComponent from "../ElectionComponent/ElectionComponent";
import "./SavedElections.css";
import { motion } from "framer-motion";

function SavedElections({ savedElections }) {
  if (!savedElections || !Array.isArray(savedElections)) {
    console.error(
      "savedElections is not in the expected format:",
      savedElections
    );
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="savedElections"
    >
      <h2>Saved Elections</h2>
      <div className="saved-elections-container">
        <div className="scrollable-container">
          {savedElections.map((election) => (
            <ElectionComponent key={election._id} election={election} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default SavedElections;
