import React, { useEffect, useReducer, useCallback } from "react";
import { motion } from "framer-motion";
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
import MessagingDashboard from "../MessagingDashboard/MessagingDashboard";

const useCompanyDashboardData = (user) => {
  const {
    fetchUserByCompanyCode,
    getElections,
    fetchTopicsByCompanyCode,
    fetchAdminUsers,
    getCompanyNews,
    fetchSavedElections,
    fetchPastElection,
  } = useAuth();

  const [state, setState] = useReducer(
    (prevState, updates) => ({ ...prevState, ...updates }),
    {
      candidatesList: [],
      upcomingElections: [],
      upcomingNews: [],
      pastElections: [],
      admins: [],
      savedElections: [],
      topics: [],
      users: [],
      loading: true,
      error: null,
    }
  );

  const fetchData = useCallback(async () => {
    try {
      if (!user) throw new Error("Invalid user object");

      console.log("Fetching data for company code:", user.companyCode);
      S
      const fetchPromises = [
        fetchPastElection(),
        fetchSavedElections(user?._id),
        getCompanyNews(user.companyCode),
        getElections(user.companyCode),
        fetchUserByCompanyCode(user.companyCode),
        fetchAdminUsers(user.companyCode),
        fetchTopicsByCompanyCode(user.companyCode),
      ];

      const [
        pastElections,
        savedElections,
        upcomingNews,
        upcomingElections,
        users,
        admins,
        topics,
      ] = await Promise.all(fetchPromises);

      console.log("All data fetched successfully.");

      setState({
        pastElections,
        savedElections,
        upcomingNews,
        upcomingElections,
        users,
        admins,
        topics,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      setState({
        error: error.message || "Failed to load data",
        loading: false,
      });
    }
  }, [
    user,
    fetchPastElection,
    fetchSavedElections,
    getCompanyNews,
    getElections,
    fetchUserByCompanyCode,
    fetchAdminUsers,
    fetchTopicsByCompanyCode,
  ]);

  useEffect(() => {
    if (user) fetchData();
  }, [user, fetchData]);

  return state;
};

function CompanyDashboard() {
  const { user } = useAuth();
  const state = useCompanyDashboardData(user);
  const [activeModal, setActiveModal] = useReducer(
    (state, newModal) => (state === newModal ? null : newModal),
    null
  );

  const openModal = useCallback((modalKey) => setActiveModal(modalKey), []);
  const closeModal = useCallback(() => setActiveModal(null), []);

  const modalMapping = {
    isElectionModalOpen: ElectionRegistrationForm,
    isTopicModalOpen: CreateTopicForm,
    isCompanyNewsModalOpen: CreateNews,
  };

  const ContentComponent = modalMapping[activeModal];

  console.log("State:", state);

  if (state.loading) return <LoadingScreen />;
  if (state.error) return <ErrorScreen error={state.error} />;

  return (
    <div className="CompanyDashboard">
      <motion.div
        className="CompanyDashboard-Main"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <DashboardHeader user={user} />
        <DashboardSections
          pastElections={state.pastElections}
          admins={state.admins}
          news={state.upcomingNews}
          users={state.users}
          upcomingElections={state.upcomingElections}
          topics={state.topics}
          userId={user?._id}
          savedElections={state.savedElections}
          openElectionModal={() => openModal("isElectionModalOpen")}
          openTopicModal={() => openModal("isTopicModalOpen")}
          openCompanyNewsModal={() => openModal("isCompanyNewsModalOpen")}
          messagingComponent={<MessagingDashboard />}
        />
        {activeModal && ContentComponent && (
          <ModalComponent
            isModalOpen={!!activeModal}
            onClose={closeModal}
            modalVariants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1 },
              exit: { opacity: 0 },
            }}
            ContentComponent={ContentComponent}
            contentProps={
              activeModal === "isElectionModalOpen"
                ? { candidatesList: state.users, onClose: closeModal }
                : { onClose: closeModal }
            }
          />
        )}
      </motion.div>
    </div>
  );
}

export default CompanyDashboard;
