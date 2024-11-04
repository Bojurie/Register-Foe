import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCrown, FaChartPie } from "react-icons/fa";
import "./ElectionDisplay.css";

const ElectionDisplay = ({
  electionName,
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

  const transitionSettings = {
    duration: 0.6,
    ease: [0.42, 0, 0.58, 1],
  };

  return (
    <div className="ElectionDisplayContainer">
      <AnimatePresence mode="wait">
        {showElection ? (
          <motion.div
            key="election"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={transitionSettings}
            className="DisplayContent"
          >
            <FaChartPie className="CandidateIcon" />
            <h2 className="ElectionText">Election:</h2>
            <p className="ElectionName">{electionName}</p>
            <p className="Location">{location}</p>
            <p className="ElectionDate">
              From: {startDate.toDateString()} To: {endDate.toDateString()}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="candidate"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={transitionSettings}
            className="DisplayContent"
          >
            <FaCrown className="VoteIcon" />
            <h2 className="LeadingText">Leading Candidate:</h2>
            <p className="CandidateName">{leadingCandidate}</p>
            <p className="VotePercentage">{votePercentage}% of total votes</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ElectionDisplay;
