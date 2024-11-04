// ElectionDisplay.js
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./ElectionDisplay.css";

const ElectionDisplay = ({
  electionName,
  description,
  electionType,
  leadingCandidate,
  votePercentage,
  startDate,
  endDate,
  location,
}) => {
  const [showElection, setShowElection] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowElection((prevShowElection) => !prevShowElection);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="ElectionDisplayContainer">
      <AnimatePresence mode="wait">
        {showElection ? (
          <motion.div
            key="election"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="DisplayContent"
          >
            <h2 className="ElectionText">Election:</h2>
            <p className="ElectionName">{electionName}</p>
            <p className="ElectionDescription">{description}</p>
            <p className="ElectionType">Type: {electionType}</p>
            <p className="ElectionDate">
              Dates: {new Date(startDate).toLocaleDateString()} -{" "}
              {new Date(endDate).toLocaleDateString()}
            </p>
            <p className="ElectionLocation">Location: {location}</p>
          </motion.div>
        ) : (
          <motion.div
            key="candidate"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="DisplayContent"
          >
            <h2 className="LeadingText">Leading Candidate:</h2>
            <p className="CandidateName">{leadingCandidate}</p>
            <p className="VotePercentage">{votePercentage}%</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ElectionDisplay;
