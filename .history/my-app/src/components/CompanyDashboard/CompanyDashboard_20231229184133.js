import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WeatherWidget from "../WeatherWidget/WeatherWidget";
import PastElectionList from "../PastElectionList/PastElectionList";
import ElectionList from "../ElectionList /ElectionList";
import ElectionRegistration from "../ElectionRegisteration/ElectionRegistration";
import UserProfile from "../Profile/userProfile";
import CreateTopicForm from "../CreateTopicForm/CreateTopicForm";
import "./CompanyDashboard.css";
import TopicWidget from "../TopicWidget/TopicWidget";
import { getStoredToken } from "../LocalStorageManager/LocalStorageManager";
import { useAuth } from "../AuthContext/AuthContext";


function CompanyDashboard() {
  const { fetchUserByCompanyCode, getElections, user} = useAuth();
  const [candidatesList, setCandidatesList] = useState([]);
  const [upcomingElections, setUpcomingElections] = useState([]);
  const [isElectionModalOpen, setIsElectionModalOpen] = useState(false);
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);

  
  const modalVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };


  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const candidatesResponse = await fetchUserByCompanyCode(
          user.companyCode
        );
        setCandidatesList(candidatesResponse);
      } catch (error) {
        console.error("Error fetching candidates:", error);
      }
    };

    if (user && user.isCompany && user.companyCode) {
      fetchCandidates();
    }
  }, [user, fetchUserByCompanyCode]);

 useEffect(() => {
   const fetchElections = async () => {
     try {
       const electionsResponse = await getElections();
       setUpcomingElections(electionsResponse.data);
     } catch (error) {
       console.error("Error fetching upcoming elections:", error);
     }
   };

   if (user && user.isCompany) {
     fetchElections();
   }
 }, [getElections]);



  const token = getStoredToken();
  const headers = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
    }),
    [token]
  );

    // const handleModalClose = () => {
    //   setIsElectionModalOpen(false);
    //   setIsTopicModalOpen(false);
    // };


  return (
    <div>
      <motion.div
        className="CompanyDashboard"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <div className="Dashboard-Content">
          <div className="Dashboard-Buttons">
            <button onClick={() => setIsElectionModalOpen(true)}>
              Register Election
            </button>
            <button onClick={() => setIsTopicModalOpen(true)}>
              Create New Topic
            </button>
          </div>
        </div>
        <div className="CompanyDashboard-Top">
          <h1>Welcome, {user?.companyName || "Guest"}!</h1>
          <WeatherWidget user={user} />
        </div>

        <div className="CompanyDashboard-Container">
          <div className="CompanyDashboard-Content">
            <div className="CompanyDashboard-Left">
              <PastElectionList userId={user?._id} />
            </div>
            <div className="CompanyDashboard-Center">
              <TopicWidget />
            </div>
            <div className="CompanyDashboard-Right">
              <ElectionList elections={upcomingElections} userId={user?._id} />
            </div>
          </div>
          <div className="CompanyDashboard-Bottom-Section">
            <div>
              <UserProfile />
            </div>
            <div></div>
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
                onClose={handleModalClose}
                ContentComponent={() => (
                  <CreateTopicForm onClose={handleModalClose} />
                )}
              />
            )}
          </AnimatePresence>
          <AnimatePresence>
            {isTopicModalOpen && (
              <Modal
                modalVariants={modalVariants}
                onClose={handleModalClose}
                ContentComponent={() => (
                  <CreateTopicForm onClose={handleModalClose} />
                )}
              />
            )}
          </AnimatePresence>
          <AnimatePresence>
            {isTopicModalOpen && (
              <Modal
                modalVariants={modalVariants}
                onClose={handleModalClose}
                ContentComponent={() => (
                  <CreateTopicForm onClose={handleModalClose} />
                )}
              />
            )}
          </AnimatePresence>
        </div>
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