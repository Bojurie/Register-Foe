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


// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { motion, AnimatePresence } from "framer-motion";
// import WeatherWidget from "../WeatherWidget/WeatherWidget";
// import PastElectionList from "../PastElectionList/PastElectionList";
// import ElectionList from "../ElectionList/ElectionList";
// import ElectionRegistration from "../ElectionRegistration/ElectionRegistration";
// import UserProfile from "../Profile/UserProfile";
// import CreateTopicForm from "../CreateTopicForm/CreateTopicForm";
// import "./CompanyDashboard.css";

function CompanyDashboard({ user }) {
  const [candidatesList, setCandidatesList] = useState([]);
  const [upcomingElections, setUpcomingElections] = useState([]);
  const [isElectionModalOpen, setIsElectionModalOpen] = useState(false);
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const electionsResponse = await axios.get(
          "/election/upcoming-elections"
        );
        setUpcomingElections(electionsResponse.data);

        const candidatesResponse = await axios.get("/candidates");
        setCandidatesList(candidatesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <motion.div
        className="CompanyDashboard"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <div className="CompanyDashboard-Top">
          <h1>Welcome, {user?.companyName || "Guest"}!</h1>
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
        <div>
          <UserProfile />
        </div>

        <AnimatePresence>
          {isElectionModalOpen && (
            <Modal
              modalVariants={modalVariants}
              onClose={() => setIsElectionModalOpen(false)}
              ContentComponent={() => (
                <ElectionRegistration candidatesList={candidatesList} />
              )}
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
