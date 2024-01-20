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
  const [state, setState] = useState({
    candidatesList: [],
    upcomingElections: [],
    upcomingNews: [],
    pastElections: [],
    admins: [],
    savedElections: [],
    topics: [],
    users: [],
    loading: {
      candidates: true,
      elections: true,
      topics: true,
      users: true,
      admins: true,
      news: true,
      savedElections: true,
      pastElections: true,
    },
    error: {},
  });

  const modalVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };
if (adminResponse && adminResponse.data) {
  setAdmins(adminResponse.data); // Assuming the admin users are in the 'data' property
} else {
  console.error("Invalid admin response structure:", adminResponse);
}
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user || !user.isCompany || !user.companyCode) {
          console.error("Invalid user object:", user);
          return;
        }

        const pastElectionResponse = await fetchPastElection(user?.userId);
        const adminResponse = await fetchAdminUsers(user?.companyCode);
        const saveElectionResponse = await fetchSavedElections(user?.id);

        const newsResponse = await getCompanyNews(user.companyCode);
        const candidatesResponse = await fetchUserByCompanyCode(
          user.companyCode
        );
        const electionResponse = await getElections(user.companyCode);
        const topicResponse = await fetchTopicsByCompanyCode(user.companyCode);
        const userResponse = await fetchUserByCompanyCode(user.companyCode);

        setState({
          pastElections: pastElectionResponse || [],
          candidatesList: candidatesResponse || [],
          savedElections: saveElectionResponse || [],
          upcomingNews: newsResponse || [],
          upcomingElections: electionResponse || [],
          topics: topicResponse || [],
          users: userResponse || [],
          admins: adminResponse || [],
          loading: {
            news: false,
            admins: false,
            candidates: false,
            elections: false,
            topics: false,
            users: false,
            savedElections: false,
            pastElections: false,
          },
          error: {},
        });
      } catch (e) {
        console.error("Error loading data:", e);
        setState((prevState) => ({ ...prevState, error: e }));
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

  if (Object.keys(state.error).length) {
    return <ErrorScreen />;
  }

  if (Object.values(state.loading).some(Boolean)) {
    return <LoadingScreen />;
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
          pastElections={state.pastElections}
          admins={state.admins}
          news={state.upcomingNews}
          users={state.users}
          upcomingElections={state.upcomingElections}
          topics={state.topics}
          userId={user?._id}
          savedElections={state.savedElections}
        />

        <ModalComponent
          isModalOpen={isElectionModalOpen}
          setIsModalOpen={setIsElectionModalOpen}
          modalVariants={modalVariants}
          ContentComponent={ElectionRegistrationForm}
          contentProps={{ candidatesList: state.candidatesList }}
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