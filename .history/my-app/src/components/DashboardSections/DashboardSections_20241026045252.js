import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  ElectionList,
  UserProfile,
  TopicWidget,
  Testimony,
  PastElectionList,
  AdminUsersList,
  NewsWidget,
  CalenderWidget,
  EmployeesCount,
  ElectionsCount,
  TopicsCount,
} from "../components"; // Assume these are appropriately imported
import "./DashboardSections.css";
import axiosInstance from "../axiosInstance";

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

  const toggleCollapse = useCallback((index) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  }, []);

  const memoizedTopics = useMemo(
    () => (Array.isArray(topics) ? topics : []),
    [topics]
  );

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const response = await axiosInstance.get("/election/elections");
        if (response.status === 200) {
          setElectionData(response.data);
        } else {
          console.error("Failed to fetch elections:", response.data.message);
        }
      } catch (error) {
        console.error("Error in fetching elections:", error);
      }
    };
    fetchElections();
  }, []);

  return (
    <div className="CompanyDashboard-Container">
      {/* Map over sections to improve modularity */}
      {[
        { component: <EmployeesCount users={users} /> },
        { component: <CalenderWidget /> },
        { component: <NewsWidget news={news} /> },
        { component: <ElectionsCount elections={electionData} /> },
        { component: <UserProfile users={users} /> },
        { component: <AdminUsersList admins={admins} /> },
        { component: <PastElectionList pastElections={pastElections} /> },
        { component: <Testimony /> },
        { component: <TopicsCount topics={memoizedTopics} /> },
        { component: <TopicWidget topics={memoizedTopics} /> },
      ].map((section, idx) => (
        <div
          key={idx}
          className={`CompanyDashboard-Content-Main ${
            collapsedSections[idx] ? "collapsed" : ""
          }`}
        >
          {!collapsedSections[idx] && section.component}
        </div>
      ))}
      <div className="button-section">
        <button onClick={openElectionModal} className="buttons">
          <h2>Register Election</h2>
        </button>
        <button onClick={openTopicModal} className="buttons">
          <h2>Create New Topic</h2>
        </button>
        <button onClick={openCompanyNewsModal} className="buttons">
          <h2>Post Company News</h2>
        </button>
      </div>
      <div className="messaging-section">{messagingComponent}</div>
      <ElectionList elections={electionData} />
    </div>
  );
};

export default DashboardSections;
