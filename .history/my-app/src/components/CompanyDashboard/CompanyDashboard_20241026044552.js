import React, { useEffect, useReducer, useCallback } from "react";
import { motion } from "framer-motion";
import DashboardHeader from "../DashboardHeader/DashboardHeader";
import DashboardSections from "../DashboardSections/DashboardSections";
import LoadingScreen from "../LoadingScreen";
import ErrorScreen from "../ErrorScreen";
import ModalComponent from "../ModalComponent/ModalComponent";
import { useAuth } from "../AuthContext/AuthContext";
import "./CompanyDashboard.css";

const useCompanyDashboardData = (user) => {
  const {
    fetchUserByCompanyCode,
    getElections,
    fetchTopicsByCompanyCode,
    fetchAdminUsers,
    getCompanyNews,
    fetchPastElection,
  } = useAuth();
  const [state, setState] = useReducer(
    (prevState, updates) => ({ ...prevState, ...updates }),
    { data: {}, loading: true, error: null }
  );

  const fetchData = useCallback(async () => {
    if (!user) {
      setState({ error: "Invalid user", loading: false });
      return;
    }

    try {
      const [
        pastElections,
        upcomingNews,
        upcomingElections,
        users,
        admins,
        topics,
      ] = await Promise.all([
        fetchPastElection(user.companyCode),
        getCompanyNews(user.companyCode),
        getElections(user.companyCode),
        fetchUserByCompanyCode(user.companyCode),
        fetchAdminUsers(user.companyCode),
        fetchTopicsByCompanyCode(user.companyCode),
      ]);

      setState({
        data: {
          pastElections,
          upcomingNews,
          upcomingElections,
          users,
          admins,
          topics,
        },
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
    getCompanyNews,
    getElections,
    fetchUserByCompanyCode,
    fetchAdminUsers,
    fetchTopicsByCompanyCode,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return state;
};

function CompanyDashboard() {
  const { user } = useAuth();
  const { data, loading, error } = useCompanyDashboardData(user);
  const [activeModal, setActiveModal] = useReducer(
    (state, newModal) => (state === newModal ? null : newModal),
    null
  );

  const openModal = useCallback((modalKey) => setActiveModal(modalKey), []);
  const closeModal = useCallback(() => setActiveModal(null), []);

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen error={error} />;

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
          {...data}
          userId={user?._id}
          openElectionModal={() => openModal("isElectionModalOpen")}
        />
        {activeModal && (
          <ModalComponent
            isModalOpen={!!activeModal}
            onClose={closeModal}
            ContentComponent={
              { isElectionModalOpen: ElectionRegistrationForm }[activeModal]
            }
          />
        )}
      </motion.div>
    </div>
  );
}

export default CompanyDashboard;
