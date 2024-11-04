
import React, { useState, useEffect, useMemo } from "react";
import ElectionList from "../ElectionList /ElectionList";
import UserProfile from "../Profile/userProfile";
import TopicWidget from "../TopicWidget/TopicWidget";
import Testimony from "../Testimony/Testimony";
import PastElectionList from "../PastElectionList/PastElectionList";
import AdminUsersList from "../AdminUsersList/AdminUsersList";
import NewsWidget from "../CompanyNews/NewsWidget";
import CalenderWidget from "../Calendar/CalenderWidget";
import "./DashboardSections.css";
import axiosInstance from "../axiosInstance"; 
import EmployeesCount from "../EmployeesCount";
import ElectionsCount from "../ElectionsCount";
import TopicsCount from "../TopicsCount";
import { CompanyDashboardButton } from "../StyledComponents";

const DashboardSections = ({
  users,
  topics,
  admins,
  news,
  pastElections,
  openElectionModal,
  openTopicModal,
  openCompanyNewsModal,
  messagingComponent,
}) => {
  const [collapsedSections, setCollapsedSections] = useState({});
  const [electionData, setElectionData] = useState([]);

  const toggleCollapse = (index) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const memoizedTopics = useMemo(
    () => (Array.isArray(topics) ? topics : []),
    [topics]
  );

  useEffect(() => {
    const fetchElectionsWithCandidates = async () => {
      try {
        const response = await axiosInstance.get("/election/elections");
        const data = response.data;

        if (response.status === 200) {
          setElectionData(data);
        } else {
          console.error("Failed to fetch elections:", data.message);
        }
      } catch (error) {
        console.error("Error in fetching elections with candidates:", error);
      }
    };

    fetchElectionsWithCandidates();
  }, []);

  const postElectionVote = async (electionId, candidateId) => {
    if (!electionId || !candidateId) {
      console.error("Invalid parameters for voting:", {
        electionId,
        candidateId,
      });
      return { error: "Invalid parameters." };
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.post(
        `/election/elections/${electionId}/vote`,
        { candidateId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error voting for candidate:",
        error.response?.data || error
      );
      return {
        error:
          error.response?.data?.message || "An error occurred while voting.",
      };
    }
  };

  return (
    <div className="CompanyDashboard-Container">
      <div className="CompanyDashboard-Column">
        <div
          className={`CompanyDashboard-Content-Main ${
            collapsedSections[10] ? "collapsed" : ""
          }`}
        >
          {!collapsedSections[10] && <EmployeesCount users={users} />}
        </div>
        <div
          className={`CompanyDashboard-Content-Main ${
            collapsedSections[3] ? "collapsed" : ""
          }`}
        >
          {!collapsedSections[3] && <CalenderWidget />}
        </div>
        <div
          className={`CompanyDashboard-Content-Main ${
            collapsedSections[10] ? "collapsed" : ""
          }`}
        >
          {!collapsedSections[10] && <NewsWidget news={news} />}
        </div>
      </div>

      <div className="CompanyDashboard-Column">
        <div
          className={`CompanyDashboard-Content-Main ${
            collapsedSections[11] ? "collapsed" : ""
          }`}
        >
          {!collapsedSections[11] && (
            <ElectionsCount elections={electionData} />
          )}
        </div>
        <div className="middle-section">
          <div
            className={`CompanyDashboard-Content-Main ${
              collapsedSections[6] ? "collapsed" : ""
            }`}
          >
            {!collapsedSections[6] && <UserProfile users={users} />}
          </div>
          <div
            className={`CompanyDashboard-Content-Main ${
              collapsedSections[7] ? "collapsed" : ""
            }`}
          >
            {!collapsedSections[7] && <AdminUsersList admins={admins} />}
          </div>
          <div
            className={`CompanyDashboard-Content-Main ${
              collapsedSections[5] ? "collapsed" : ""
            }`}
          >
            {!collapsedSections[5] && (
              <PastElectionList pastElections={pastElections} />
            )}
          </div>
          <div
            className={`CompanyDashboard-Content-Main ${
              collapsedSections[0] ? "collapsed" : ""
            }`}
          >
            {!collapsedSections[0] && (
              <button onClick={openElectionModal} className="buttons">
                <h2>Register Election</h2>
              </button>
            )}
          </div>
          <div
            className={`CompanyDashboard-Content-Main ${
              collapsedSections[1] ? "collapsed" : ""
            }`}
          >
            {!collapsedSections[1] && (
              <CompanyDashboardButton onClick={openTopicModal} className="buttons">
                <h2>Create New Topic</h2>
              </CompanyDashboardButton>
            )}
          </div>
          <div
            className={`CompanyDashboard-Content-Main ${
              collapsedSections[2] ? "collapsed" : ""
            }`}
          >
            {!collapsedSections[2] && (
              <button onClick={openCompanyNewsModal} className="buttons">
                <h2>Post Company News</h2>
              </button>
            )}
          </div>

          <div
            className={`CompanyDashboard-Content-Main ${
              collapsedSections[4] ? "collapsed" : ""
            }`}
          >
            {!collapsedSections[4] && <Testimony />}
          </div>
        </div>
        <div
          className={`CompanyDashboard-Content-Main ${
            collapsedSections[11] ? "collapsed" : ""
          }`}
        >
          {!collapsedSections[11] && messagingComponent}
        </div>
      </div>

      <div className="CompanyDashboard-Column">
        <div
          className={`CompanyDashboard-Content-Main ${
            collapsedSections[12] ? "collapsed" : ""
          }`}
        >
          {!collapsedSections[12] && <TopicsCount topics={memoizedTopics} />}
        </div>
        <div
          className={`CompanyDashboard-Content-Main ${
            collapsedSections[8] ? "collapsed" : ""
          }`}
        >
          {!collapsedSections[8] && (
            <ElectionList
              elections={electionData}
              postElectionVote={postElectionVote}
            />
          )}
        </div>
        <div
          className={`CompanyDashboard-Content-Main ${
            collapsedSections[9] ? "collapsed" : ""
          }`}
        >
          {!collapsedSections[9] && <TopicWidget topics={memoizedTopics} />}
        </div>
      </div>
    </div>
  );
};

export default DashboardSections;