import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import DashboardButtons from "../DashboardButtons/DashboardButtons";
import DashboardHeader from "../DashboardHeader/DashboardHeader";
import DashboardSections from "../DashboardSections/DashboardSections";
import LoadingScreen from "../LoadingScreen";
import ErrorScreen from "../ErrorScreen";
import ModalComponent from "../ModalComponent/ModalComponent";
import { useAuth } from "../AuthContext/AuthContext";
import "./CompanyDashboard.css";
import CreateNews from "../CompanyNews/CompanyNews";
import CreateTopicForm from "../CreateTopicForm/CreateTopicForm";
import ElectionRegistrationForm from "../ElectionRegisteration/ElectionRegistration";

function CompanyDashboard() {
  const [isElectionModalOpen, setIsElectionModalOpen] = useState(false);
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [isCompanyNewsModalOpen, setIsCompanyNewsModalOpen] = useState(false);
  const {
    fetchUserByCompanyCode,
    getElections,
    user,
    fetchTopicsByCompanyCode,
    fetchAdminUsers,
    getCompanyNews,
    fetchSavedElections,
    fetchPastElection,
  } = useAuth();
  const [candidatesList, setCandidatesList] = useState([]);
  const [upcomingElections, setUpcomingElections] = useState([]);
  const [upcomingNews, setUpcomingNews] = useState([]);
  const [pastElections, setPastElections] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [savedElections, setSavedElections] = useState([]);
  const [topics, setTopics] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState({
    candidates: true,
    elections: true,
    topics: true,
    users: true,
    admins: true,
    news: true,
    savedElections: true,
    pastElections: true
  });
  const [error, setError] = useState({});

  const modalVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user || !user.isCompany || !user.companyCode) {
          console.error("Invalid user object:", user);
          return;
        }

        const pastElectionResponse = await fetchPastElection(user.companyCode);
        const adminResponse = await fetchAdminUsers(user.companyCode);
        const saveElectionResponse = await fetchSavedElections(user.id);

        const newsResponse = await getCompanyNews(user.companyCode);
        const candidatesResponse = await fetchUserByCompanyCode(
          user.companyCode
        );
        const electionResponse = await getElections(user.companyCode);
        const topicResponse = await fetchTopicsByCompanyCode(user.companyCode);
        const userResponse = await fetchUserByCompanyCode(user.companyCode);

        setPastElections(pastElectionResponse || []);
        setCandidatesList(candidatesResponse || []);
        setSavedElections(saveElectionResponse || []);
        setUpcomingNews(newsResponse || []);
        setUpcomingElections(electionResponse || []);
        setTopics(topicResponse || []);
        setUsers(userResponse || []);
        setAdmins(adminResponse || []);

        setLoading({
          news: false,
          admins: false,
          candidates: false,
          elections: false,
          topics: false,
          users: false,
          savedElections: false,
          pastElections: false,
        });
      } catch (e) {
        console.error("Error loading data:", e);
        setError(e);
      }
    };

    fetchData();
  }, [
    user,
    fetchUserByCompanyCode,
    getElections,
    fetchTopicsByCompanyCode,
    fetchAdminUsers,
    getCompanyNews,
    fetchSavedElections,
    fetchPastElection,
  ]);

  if (
    loading.candidates ||
    loading.elections ||
    loading.topics ||
    loading.users ||
    loading.admins ||
    loading.news ||
    loading.savedElections ||
    loading.pastElections
  ) {
    return <LoadingScreen />;
  }

  if (Object.keys(error).length) {
    return <ErrorScreen />;
  }

  return (
    <div>
      <motion.div
        className="CompanyDashboard"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <DashboardHeader user={user} />
        <DashboardButtons
          setIsElectionModalOpen={setIsElectionModalOpen}
          setIsTopicModalOpen={setIsTopicModalOpen}
          setIsCompanyNewsModalOpen={setIsCompanyNewsModalOpen}
        />
        <DashboardSections
        pastElections={pastElections}
          admins={admins}
          news={upcomingNews}
          users={users}
          upcomingElections={upcomingElections}
          topics={topics}
          userId={user?._id}
          savedElections={savedElections}
        />

        <ModalComponent
          isModalOpen={isElectionModalOpen}
          setIsModalOpen={setIsElectionModalOpen}
          modalVariants={modalVariants}
          ContentComponent={ElectionRegistrationForm}
          contentProps={{ candidatesList }}
        />
        <ModalComponent
          isModalOpen={isTopicModalOpen}
          setIsModalOpen={setIsTopicModalOpen}
          modalVariants={modalVariants}
          ContentComponent={CreateTopicForm}
        />

        <ModalComponent
          isModalOpen={isCompanyNewsModalOpen}
          setIsModalOpen={setIsCompanyNewsModalOpen}
          modalVariants={modalVariants}
          ContentComponent={CreateNews}
        />
      </motion.div>
    </div>
  );
}

export default CompanyDashboard;