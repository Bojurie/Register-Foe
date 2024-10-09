import React from "react";
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
  return (
    <div className="CompanyDashboard-Container">
      <div className="CompanyDashboard-Content">
        <div className="CompanyDashboard-Content-Main">
            <button onClick={openElectionModal} className="buttons"><h1> Register Election</h1></button>
          </div>
          <div className="CompanyDashboard-Content-Main">
            <button onClick={openTopicModal} className="buttons"><h1>Create New Topic</h1></button>
          </div>
          <div className="CompanyDashboard-Content-Main">
            <button onClick={openCompanyNewsModal} className="buttons"><h1> Post Company News</h1></button>
          </div>
        <div className="CompanyDashboard-Content-Main">
          <CalenderWidget />
        </div>
        <div className="CompanyDashboard-Content-Main">
          <SavedElections savedElections={savedElections} />
        </div>
        <div className="CompanyDashboard-Content-Main">
          <PastElectionList pastElections={pastElections} />
        </div>
        <div className="CompanyDashboard-Content-Main">
          <UserProfile users={users} />
        </div>
        <div className="CompanyDashboard-Content-Main">
          <AdminUsersList admins={admins} />
        </div>
        <div className="CompanyDashboard-Content-Main">
          <ElectionList elections={upcomingElections} />
        </div>
        <div className="CompanyDashboard-Content-Main">
          <TopicWidget topics={topics} />
        </div>
        <div className="CompanyDashboard-Content-Main">
          <NewsWidget news={news} />
        </div>
      </div>
    </div>
  );
};

export default DashboardSections;
