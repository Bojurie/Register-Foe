import React, {useState} from 'react'
import ElectionComponent from '../ElectionComponent /ElectionComponent '
import './SavedElections.css'
import { motion, AnimatePresence } from "framer-motion";


function SavedElections({ savedElections }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => setIsCollapsed((prev) => !prev);

  if (!savedElections || !Array.isArray(savedElections)) {
    console.error(
      "savedElections is not in the expected format:",
      savedElections
    );
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <motion.div className={`savedElections ${isCollapsed ? "collapsed" : ""}`}>
      <h1
        onClick={toggleCollapse}
        style={{ cursor: "pointer" }}
        aria-expanded={!isCollapsed}
      >
        Saved Elections {isCollapsed ? "(Show)" : "(Hide)"}
      </h1>

      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            className="saved-elections-container"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className="scrollable-container">
              {savedElections.map((election) => (
                <ElectionComponent key={election._id} election={election} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default SavedElections;
