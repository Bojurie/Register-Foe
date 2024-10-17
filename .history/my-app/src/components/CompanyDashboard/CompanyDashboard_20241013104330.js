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

      const promises = [
        fetchPastElection(user?._id),
        fetchSavedElections(user?._id),
        getCompanyNews(user.companyCode),
        getElections(user.companyCode),
        fetchUserByCompanyCode(user.companyCode),
        fetchAdminUsers(user.companyCode),
        fetchTopicsByCompanyCode(user.companyCode),
      ];

      const results = await Promise.allSettled(promises);

      const [
        pastElectionsResult,
        savedElectionsResult,
        upcomingNewsResult,
        upcomingElectionsResult,
        usersResult,
        adminsResult,
        topicsResult,
      ] = results;

      // Initialize an object to hold the new state
      const newState = {};

      // Handle each result
      if (pastElectionsResult.status === "fulfilled") {
        newState.pastElections = pastElectionsResult.value;
      } else {
        console.error(
          "Error fetching past elections:",
          pastElectionsResult.reason
        );
        newState.pastElections = []; // Ensure it's an array
      }

      if (savedElectionsResult.status === "fulfilled") {
        newState.savedElections = savedElectionsResult.value;
      } else {
        console.error(
          "Error fetching saved elections:",
          savedElectionsResult.reason
        );
        newState.savedElections = [];
      }

      if (upcomingNewsResult.status === "fulfilled") {
        newState.upcomingNews = upcomingNewsResult.value;
      } else {
        console.error(
          "Error fetching company news:",
          upcomingNewsResult.reason
        );
        newState.upcomingNews = [];
      }

      if (upcomingElectionsResult.status === "fulfilled") {
        newState.upcomingElections = upcomingElectionsResult.value;
      } else {
        console.error(
          "Error fetching upcoming elections:",
          upcomingElectionsResult.reason
        );
        newState.upcomingElections = [];
      }

      if (usersResult.status === "fulfilled") {
        newState.users = usersResult.value;
      } else {
        console.error("Error fetching users:", usersResult.reason);
        newState.users = [];
      }

      if (adminsResult.status === "fulfilled") {
        newState.admins = adminsResult.value;
      } else {
        console.error("Error fetching admins:", adminsResult.reason);
        newState.admins = [];
      }

      if (topicsResult.status === "fulfilled") {
        newState.topics = topicsResult.value;
      } else {
        console.error("Error fetching topics:", topicsResult.reason);
        newState.topics = [];
      }

      // Update the state with loading false and any errors
      setState((prevState) => ({
        ...prevState,
        ...newState,
        loading: false,
        error: null,
      }));
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
