import React, {useState}from "react";
import ElectionList from "../ElectionList /ElectionList";
import UserProfile from "../Profile/userProfile";
import TopicWidget from "../TopicWidget/TopicWidget";
import SavedElections from "../SavedElections/SavedElections";
import PastElectionList from "../PastElectionList/PastElectionList";
import AdminUsersList from "../AdminUsersList/AdminUsersList";
import NewsWidget from "../CompanyNews/NewsWidget";
import CalenderWidget from "../Calendar/CalenderWidget";
import "./DashboardSections.css";

const DashboardSections = ({
  users,
  upcomingElections,
  topics,
  userId,
  admins,
  news,
  savedElections,
  pastElections,
  openElectionModal,
  openTopicModal,
  openCompanyNewsModal,
}) => {
  // Track which sections are collapsed
  const [collapsedSections, setCollapsedSections] = useState({});

  // Toggle collapse state of each section
  const toggleCollapse = (index) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="CompanyDashboard-Container">
      <div>
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

        <div
          className={`CompanyDashboard-Content-Main ${
            collapsedSections[6] ? "collapsed" : ""
          }`}
        >
          {!collapsedSections[6] && <UserProfile users={users} />}
        </div>
      </div>

      <div
        className={`CompanyDashboard-Content-Main ${
          collapsedSections[0] ? "collapsed" : ""
        }`}
      >
        {!collapsedSections[0] && (
          <button onClick={openElectionModal} className="buttons">
            <h1>Register Election</h1>
          </button>
        )}
      </div>

      <div
        className={`CompanyDashboard-Content-Main ${
          collapsedSections[1] ? "collapsed" : ""
        }`}
      >
        {!collapsedSections[1] && (
          <button onClick={openTopicModal} className="buttons">
            <h1>Create New Topic</h1>
          </button>
        )}
      </div>

      <div
        className={`CompanyDashboard-Content-Main ${
          collapsedSections[2] ? "collapsed" : ""
        }`}
      >
        {!collapsedSections[2] && (
          <button onClick={openCompanyNewsModal} className="buttons">
            <h1>Post Company News</h1>
          </button>
        )}
      </div>

      <div
        className={`CompanyDashboard-Content-Main ${
          collapsedSections[4] ? "collapsed" : ""
        }`}
      >
        {!collapsedSections[4] && (
          <SavedElections savedElections={savedElections} />
        )}
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
          collapsedSections[7] ? "collapsed" : ""
        }`}
      >
        {!collapsedSections[7] && <AdminUsersList admins={admins} />}
      </div>

      <div
        className={`CompanyDashboard-Content-Main ${
          collapsedSections[8] ? "collapsed" : ""
        }`}
      >
        {!collapsedSections[8] && (
          <ElectionList elections={upcomingElections} />
        )}
      </div>

      <div
        className={`CompanyDashboard-Content-Main ${
          collapsedSections[9] ? "collapsed" : ""
        }`}
      >
        {!collapsedSections[9] && <TopicWidget topics={topics} />}
      </div>
    </div>
  );
};

export default DashboardSections;