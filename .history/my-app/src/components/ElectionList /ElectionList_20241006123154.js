import React, { useState } from "react";
import ElectionComponent from "../../components/ElectionComponent /ElectionComponent ";
import "./ElectionList.css";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../AuthContext/AuthContext";

const ElectionList = ({ elections = [] }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [electionData, setElectionData] = useState([]);
  const { getCandidatesById } = useAuth();

  const toggleCollapse = () => setIsCollapsed((prev) => !prev);

  useEffect(() => {
    const fetchElectionsWithCandidates = async () => {
      const updatedElections = await Promise.all(
        elections.map(async (election) => {
          try {
            const response = await getCandidatesById(election._id);
            return {
              ...election,
              candidates: response.candidates || [],
            };
          } catch (error) {
            console.error(
              "Failed to load candidates for election:",
              election._id
            );
            return election;
          }
        })
      );
      setElectionData(updatedElections);
    };

    if (elections.length > 0) {
      fetchElectionsWithCandidates();
    }
  }, [elections, getCandidatesById]);

  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <div className="ElectionList-Wrapper">
      <div
        className="Heading"
        onClick={toggleCollapse}
        style={{ cursor: "pointer" }}
        aria-expanded={!isCollapsed}
      >
        <h1>
          {isCollapsed ? "Show Upcoming Elections" : "Hide Upcoming Elections"}
        </h1>
      </div>
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            className="ElectionList"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={listVariants}
          >
            {Array.isArray(electionData) && electionData.length > 0 ? (
              electionData.map((election) => (
                <motion.div key={election._id} variants={itemVariants}>
                  <ElectionComponent election={election} />
                </motion.div>
              ))
            ) : (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                No upcoming elections found.
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ElectionList;
