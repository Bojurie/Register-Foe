import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WeatherWidget from "../WeatherWidget/WeatherWidget";
import PastElectionList from "../PastElectionList/PastElectionList";
import ElectionList from "../ElectionList /ElectionList";
import ElectionRegistration from "../ElectionRegisteration/ElectionRegistration"; 
import "./CompanyDashboard.css";
import UserProfile from "../Profile/userProfile";
import CreateTopicForm from "../CreateTopicForm/CreateTopicForm";


function CompanyDashboard({ user }) {
  const [upcomingElections, setUpcomingElections] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const modalVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <div>
      <motion.div
        className="Dashboard"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <h1>Welcome, {user ? `${user.companyName}` : "Guest"}!</h1>
        <WeatherWidget user={user} />

        <div className="Dashboard-Content">
          <div className="Company-Dashboard">
            <PastElectionList userId={user?._id} />
          </div>
          <div className="Dashboard-Buttons">
            <div className="RegisterCandidate">
              <button onClick={() => setIsModalOpen(true)}>
                Register Election
              </button>
            </div>
            <div className="CreateTopic">
              <button onClick={() => setIsModalOpen(true)}>
                Create New Topic
              </button>
            </div>
          </div>

          <div className="Dashboard-Topics">
            <ElectionList elections={upcomingElections} userId={user?._id} />
          </div>
        </div>
        <div>
          <UserProfile />
        </div>

        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              className="ModalBackdrop"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={() => setIsModalOpen(false)}
            >
              <motion.div
                className="ModalContent"
                onClick={(e) => e.stopPropagation()}
              >
                <ElectionRegistration />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              className="ModalBackdrop"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={() => setIsModalOpen(false)}
            >
              <motion.div
                className="ModalContent"
                onClick={(e) => e.stopPropagation()}
              >
                <CreateTopicForm/>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default CompanyDashboard;