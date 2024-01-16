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
import CreateNews from "../CompanyNews/CompanyNews";



function CompanyDashboard() {
  const { fetchUserByCompanyCode, getElections, user } = useAuth();
  const [candidatesList, setCandidatesList] = useState([]);
  const [upcomingElections, setUpcomingElections] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isElectionModalOpen, setIsElectionModalOpen] = useState(false);
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [isCompanyNewsModalOpen, setIsCompanyNewsModalOpen] = useState(false);

  const modalVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  useEffect(() => {
    setIsLoading(true);
    setError("");

    const fetchCandidates = async () => {
      try {
        const candidatesResponse = await fetchUserByCompanyCode(
          user.companyCode
        );
        setCandidatesList(candidatesResponse);
      } catch (error) {
        console.error("Error fetching candidates:", error);
        setError("Failed to load candidates");
      }
    };

    if (user && user.isCompany && user.companyCode) {
      fetchCandidates();
    }

    setIsLoading(false);
  }, [user, fetchUserByCompanyCode]);


  const handleModalClose = () => {
    setIsElectionModalOpen(false);
    setIsTopicModalOpen(false);
    setIsCompanyNewsModalOpen(false);
  };

 useEffect(() => {
   const fetchElections = async () => {
     setIsLoading(true);
     setError("");

     try {
       const electionsResponse = await getElections();
       if (electionsResponse && electionsResponse.data) {
         setUpcomingElections(electionsResponse.data);
       } else {
         console.error("Failed to fetch upcoming elections");
         setError("Failed to load upcoming elections");
       }
     } catch (error) {
       console.error("Error fetching upcoming elections:", error);
       setError("Failed to load upcoming elections");
     } finally {
       setIsLoading(false);
     }
   };

   if (user && user.isCompany) {
     fetchElections();
   }
 }, [user, getElections]);
 



  const token = getStoredToken();
  const headers = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
    }),
    [token]
  );

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
            <button onClick={() => setIsCompanyNewsModalOpen(true)}>
              Post Company News
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
              {/* <ElectionList elections={upcomingElections} userId={user?._id} /> */}
            </div>
          </div>
          <div className="CompanyDashboard-Bottom-Section">
            <div>
              {/* <UserProfile /> */}
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
                onClose={() => setIsTopicModalOpen(false)}
                ContentComponent={CreateTopicForm}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isCompanyNewsModalOpen && (
              <Modal
                modalVariants={modalVariants}
                onClose={() => setIsCompanyNewsModalOpen(false)}
                ContentComponent={ CreateNews}
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
