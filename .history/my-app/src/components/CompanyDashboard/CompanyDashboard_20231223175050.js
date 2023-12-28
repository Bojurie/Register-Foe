import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import WeatherWidget from "../WeatherWidget/WeatherWidget";
import PastElectionList from "../PastElectionList/PastElectionList";
import ElectionList from "../ElectionList /ElectionList";
import ElectionRegistration from "../ElectionRegisteration/ElectionRegistration";
import UserProfile from "../Profile/userProfile";
import CreateTopicForm from "../CreateTopicForm/CreateTopicForm";
import "./CompanyDashboard.css";

function CompanyDashboard({ user }) {
  const [upcomingElections, setUpcomingElections] = useState([]);
  const [isElectionModalOpen, setIsElectionModalOpen] = useState(false);
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);

  const modalVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  useEffect(() => {
    const fetchUpcomingElections = async () => {
      try {
        const response = await axios.get("/api/upcoming-elections"); 
        setUpcomingElections(response.data);
      } catch (error) {
        console.error("Error fetching upcoming elections:", error);
      }
    };

    fetchUpcomingElections();
  }, []);

  return (
    <div>
      <motion.div
        className="CompanyDashboard"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <h1>Welcome, {user ? `${user.companyName}` : "Guest"}!</h1>
        <WeatherWidget user={user} />

        <div className="Dashboard-Content">
          <PastElectionList userId={user?._id} />
          <div className="Dashboard-Buttons">
            <button onClick={() => setIsElectionModalOpen(true)}>
              Register Election
            </button>
            <button onClick={() => setIsTopicModalOpen(true)}>
              Create New Topic
            </button>
          </div>
          <ElectionList elections={upcomingElections} userId={user?._id} />
         
        </div>
        <div>
           <UserProfile />
        </div>

        <AnimatePresence>
          {isElectionModalOpen && (
            <Modal
              modalVariants={modalVariants}
              onClose={() => setIsElectionModalOpen(false)}
              ContentComponent={ElectionRegistration}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isTopicModalOpen && (
            <Modal
              modalVariants={modalVariants}
              onClose={() => setIsTopicModalOpen(false)}
              ContentComponent={CreateTopicForm}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

const Modal = ({ modalVariants, onClose, ContentComponent }) => (
  <motion.div
    className="ModalBackdrop"
    variants={modalVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    onClick={onClose}
  >
    <motion.div className="ModalContent" onClick={(e) => e.stopPropagation()}>
      <ContentComponent />
    </motion.div>
  </motion.div>
);

export default CompanyDashboard;
