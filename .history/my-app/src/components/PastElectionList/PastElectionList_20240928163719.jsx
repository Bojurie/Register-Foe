import React, { useEffect, useState } from "react";
import axios from "axios";
import "./PastElectionList.css";
import PastElectionItem from "../PastElectionItem/PastElectionItem";
import { motion, AnimatePresence } from "framer-motion";

const PastElections = ({ userId }) => {
  const [pastElections, setPastElections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const BASE_URL = "http://localhost:3001";

  useEffect(() => {
    const fetchPastElections = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${BASE_URL}/pastElection/past-elections/voted/${userId}`
        );
        const fetchedVotedPastElections = response.data.votedPastElections;
        setPastElections(fetchedVotedPastElections);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchPastElections();
    }
  }, [userId]);

  const toggleCollapse = () => setIsCollapsed((prev) => !prev);

  const containerVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto", transition: { duration: 0.5 } },
  };

  return (
    <div className="PastElections">
      <h2
        onClick={toggleCollapse}
        style={{ cursor: "pointer" }}
        aria-expanded={!isCollapsed}
      >
        Past Elections
      </h2>
      <AnimatePresence>
        {!isCollapsed && (
          <>
            {loading && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Loading past elections...
              </motion.p>
            )}
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Error loading past elections: {error.message}
              </motion.p>
            )}
            {!loading && !error && pastElections.length > 0 && (
              <motion.div
                className="PastElections-Item"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={containerVariants}
              >
                {pastElections.map((pastElection) => (
                  <PastElectionItem
                    key={pastElection._id}
                    pastElection={pastElection}
                  />
                ))}
              </motion.div>
            )}
            {!loading && !error && pastElections.length === 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                No past elections found.
              </motion.p>
            )}
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PastElections;
