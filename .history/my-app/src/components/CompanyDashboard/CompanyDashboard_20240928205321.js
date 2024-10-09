import React, { useEffect, useReducer, useCallback } from "react";
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
      if (!user?.isCompany || !user.companyCode) {
        throw new Error("Invalid user object or missing company code");
      }

      const [
        pastElections,
        admins,
        savedElections,
        upcomingNews,
        candidatesList,
        upcomingElections,
        topics,
      ] = await Promise.all([
        fetchPastElection(user?.userId),
        fetchAdminUsers(user.companyCode),
        fetchSavedElections(user?.id),
        getCompanyNews(user.companyCode),
        fetchUserByCompanyCode(user.companyCode),
        getElections(user.companyCode),
        fetchTopicsByCompanyCode(user.companyCode),
      ]);

      setState({
        pastElections,
        candidatesList,
        savedElections,
        upcomingNews,
        upcomingElections: upcomingElections || [],
        topics,
        admins,
        users: candidatesList,
        loading: false,
        error: null,
      });
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

  const state = useCompanyDashboardData(user);

  if (state.loading) {
    return <LoadingScreen />;
  }

  if (state.error) {
    return <ErrorScreen error={state.error} />;
  }

  const modalMapping = {
    isElectionModalOpen: ElectionRegistrationForm,
    isTopicModalOpen: CreateTopicForm,
    isCompanyNewsModalOpen: CreateNews,
  };

  const ContentComponent = modalMapping[activeModal];

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
                    candidatesList: state.candidatesList,
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