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

import ElectionList from "../ElectionList/ElectionList";

import Modal from "../Modal/Modal"; // Assuming you have a Modal component

function CompanyDashboard({ user }) {
  const [upcomingElections, setUpcomingElections] = useState([]);
  const [candidatesList, setCandidatesList] = useState([]);
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
        const response = await axios.get("/election/upcoming-elections");
        setUpcomingElections(response.data);
      } catch (error) {
        console.error("Error fetching upcoming elections:", error);
      }
    };

    const fetchCandidates = async () => {
      try {
        const response = await axios.get("/candidates"); // Update with your API endpoint
        setCandidatesList(response.data);
      } catch (error) {
        console.error("Error fetching candidates:", error);
      }
    };

    fetchUpcomingElections();
    fetchCandidates();
  }, []);

  return (
    <div className="CompanyDashboard">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <div className="CompanyDashboard-Top">
          <h1>Welcome, {user ? `${user.companyName}` : "Guest"}!</h1>
          <WeatherWidget user={user} />
        </div>

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

        <UserProfile />

        <AnimatePresence>
          {isElectionModalOpen && (
            <Modal
              modalVariants={modalVariants}
              onClose={() => setIsElectionModalOpen(false)}
              ContentComponent={() => (
                <ElectionRegistrationForm candidatesList={candidatesList} />
              )}
            />
          )}

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

export default CompanyDashboard;
