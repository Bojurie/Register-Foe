import React, {useState} from 'react'
import ElectionComponent from '../ElectionComponent /ElectionComponent '
import './SavedElections.css'
import { motion, AnimatePresence } from "framer-motion";



function SavedElections({ savedElections }) {
  const [isCollapsed, setIsCollapsed] = useState(true);

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
        duration: 0.5,
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className={`savedElections ${isCollapsed ? "collapsed" : ""}`}
      initial="hidden"
      animate="visible"
    >
      <h2
        onClick={toggleCollapse}
        style={{ cursor: "pointer" }}
        aria-expanded={!isCollapsed}
      >
        Saved Elections {isCollapsed ? "(Show)" : "(Hide)"}
      </h2>

      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            className="saved-elections-container"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, height: 0, transition: { duration: 0.3 } }}
          >
            <div className="scrollable-container">
              {savedElections.map((election) => (
                <motion.div key={election._id} variants={itemVariants}>
                  <ElectionComponent election={election} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default SavedElections;
