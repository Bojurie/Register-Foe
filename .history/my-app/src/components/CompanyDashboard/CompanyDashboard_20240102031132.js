import React, { useEffect, useState } from "react";
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
import SavedElections from "../SavedElections/SavedElections";

function CompanyDashboard() {
  const {
    fetchUserByCompanyCode,
    getElections,
    user,
    fetchTopicsByCompanyCode,
  } = useAuth();
  const [candidatesList, setCandidatesList] = useState([]);
  const [upcomingElections, setUpcomingElections] = useState([]);
  const [topics, setTopics] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState({
    candidates: true,
    elections: true,
    topics: true,
    users: true,
  });
  const [error, setError] = useState({});

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

  useEffect(() => {
    setIsLoading(true);
    setError("");

    const fetchElections = async () => {
      try {
        const electionResponse = await getElections();
        if (electionResponse) {
          setUpcomingElections(electionResponse);
        }
      } catch (error) {
        console.error("Error fetching election:", error);
        setError("Failed to load elections");
      } finally {
        setIsLoading(false);
      }
    };
    fetchElections();
  }, []);

  useEffect(() => {
    const fetchTopics = async () => {
      if (user && user.isCompany && user.companyCode) {
        const topicResponse = await fetchTopicsByCompanyCode(user.companyCode);
        console.log("Topic Response in CompanyDashboard:", topicResponse);
        setTopics(topicResponse); // Make sure this updates the state
      } else {
        console.log("User or company code not available");
        setIsLoading(false);
      }
    };

    fetchTopics();
  }, [user, fetchTopicsByCompanyCode]);

  const handleModalClose = () => {
    setIsElectionModalOpen(false);
    setIsTopicModalOpen(false);
    setIsCompanyNewsModalOpen(false);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      if (user && user.isCompany && user.companyCode) {
        try {
          const response = await fetchUserByCompanyCode(user.companyCode);
          if (response && response.length > 0) {
            setUsers(response);
            setIsLoading(false);
          } else {
            console.error("Failed to fetch users");
            setIsLoading(false);
          }
        } catch (error) {
          console.error("Error fetching users:", error);
          setIsLoading(false);
        }
      } else {
        console.error(
          "User object is missing or does not have a company code."
        );
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [user, fetchUserByCompanyCode]);

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
              <div className="CompanyDashboard-SavedElection">
                <SavedElections />
              </div>
              <div className="CompanyDashboard-PastElection">
                <PastElectionList userId={user?._id} />
              </div>
            </div>
            <div className="CompanyDashboard-Center"></div>
            <div className="CompanyDashboard-Right">
              <div className="CompanyDashboard-Elections">
                <ElectionList elections={upcomingElections} />
              </div>
              <div className="CompanyDashboard-Topic">
                <TopicWidget topics={topics} />
              </div>
            </div>
          </div>
          <div className="CompanyDashboard-Bottom-Section">
            <div>
              <UserProfile users={users} />
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
                ContentComponent={CreateNews}
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
