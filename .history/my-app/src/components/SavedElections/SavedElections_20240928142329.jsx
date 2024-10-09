import React, {useState} from 'react'
import ElectionComponent from '../ElectionComponent /ElectionComponent '
import './SavedElections.css'
import { motion } from 'framer-motion';



function SavedElections({ savedElections }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);


  if (!savedElections || !Array.isArray(savedElections)) {
    console.error(
      "savedElections is not in the expected format:",
      savedElections
    );
    return null;
  }

    const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <motion.div
      className={`savedElections ${isCollapsed ? "collapsed" : ""}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
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