import React, { useEffect, useState, useCallback } from "react";
import "./PastElectionList.css";
import PastElectionItem from "../PastElectionItem/PastElectionItem";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../AuthContext/AuthContext";

const PastElections = ({ userId }) => {
  const [pastElections, setPastElections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fetchPastElection] = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(true);

  const loadPastElections = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const elections = await fetchPastElection(userId);
      setPastElections(Array.isArray(elections) ? elections : []);
    } catch (err) {
      setError(err);
      setPastElections([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      loadPastElections();
    }
  }, [userId, loadPastElections]);

  const toggleCollapse = () => setIsCollapsed((prev) => !prev);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto", transition: { duration: 0.5 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div className="PastElections">
      <h2
        onClick={toggleCollapse}
        style={{ cursor: "pointer" }}
        aria-expanded={!isCollapsed}
      >
        Past Elections {isCollapsed ? "(Show)" : "(Hide)"}
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
                Error loading past elections: {error.message || error}
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
                  <motion.div key={pastElection._id} variants={itemVariants}>
                    <PastElectionItem pastElection={pastElection} />
                  </motion.div>
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
    </motion.div>
  );
};

export default PastElections;