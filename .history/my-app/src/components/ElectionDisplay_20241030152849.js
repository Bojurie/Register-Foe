import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCrown, FaChartPie } from "react-icons/fa";
import "./ElectionDisplay.css";

const ElectionDisplay = ({
  electionName,
  leadingCandidate,
  votePercentage,
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
            <FaChartPie className="CandidateIcon" />
            <h2 className="ElectionText">Election:</h2>
            <p className="ElectionName">{electionName}</p>
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
            <FaCrown className="VoteIcon" />
            <h2 className="LeadingText">Leading Candidate:</h2>
            <p className="CandidateName">{leadingCandidate}</p>
            <p className="VotePercentage" style={{ "--vote": votePercentage }}>
              {votePercentage}%
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ElectionDisplay;
