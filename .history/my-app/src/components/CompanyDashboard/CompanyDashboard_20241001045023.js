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
      candidatesList: [], // Updated to include users for selection as candidates
      upcomingElections: [],
      upcomingNews: [],
      pastElections: [],
      admins: [],
      savedElections: [],
      topics: [],
      users: [], // Added users list here
      loading: true,
      error: null,
    }
  );

  const fetchData = useCallback(async () => {
    try {
      if (!user) {
        throw new Error("Invalid user object");
      }

      const fetchPromises = [
        fetchPastElection(user?.userId),
        fetchSavedElections(user?.id),
        getCompanyNews(user.companyCode),
        getElections(user.companyCode),
        fetchUserByCompanyCode(user.companyCode), // Fetch all users
      ];

      if (user.isCompany) {
        fetchPromises.push(
          fetchAdminUsers(user.companyCode),
          fetchTopicsByCompanyCode(user.companyCode)
        );
      }

      const [
        pastElections,
        savedElections,
        upcomingNews,
        upcomingElections,
        users,
        ...otherData
      ] = await Promise.all(fetchPromises);

      const newState = {
        pastElections,
        savedElections,
        upcomingNews,
        upcomingElections,
        users, // Update the state with all users
        loading: false,
        error: null,
      };

      if (user.isCompany) {
        Object.assign(newState, {
          admins: otherData[0] || [],
          topics: otherData[1] || [],
        });
      }

      setState(newState);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      setState({
        error: error.message || "Failed to load data",
        loading: false,
      });
    }
  }, [
    user,
    fetchPastElection,
    fetchAdminUsers,
    fetchSavedElections,
    getCompanyNews,
    fetchUserByCompanyCode,
    getElections,
    fetchTopicsByCompanyCode,
  ]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
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

  const openModal = useCallback((modalKey) => {
    setActiveModal(modalKey);
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  const modalMapping = {
    isElectionModalOpen: ElectionRegistrationForm,
    isTopicModalOpen: CreateTopicForm,
    isCompanyNewsModalOpen: CreateNews,
  };

  const ContentComponent = modalMapping[activeModal];

  if (state.loading) {
    return <LoadingScreen />;
  }

  if (state.error) {
    return <ErrorScreen error={state.error} />;
  }

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
                ? {
                    candidatesList: state.users, // Use the fetched users as candidates
                    onClose: closeModal,
                  }
                : { onClose: closeModal }
            }
          />
        )}
      </motion.div>
    </div>
  );
}

export default CompanyDashboard;