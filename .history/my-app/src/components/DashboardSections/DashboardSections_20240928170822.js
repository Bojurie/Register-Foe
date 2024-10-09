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
import DashboardButtons from "../DashboardButtons/DashboardButtons";

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
          <DashboardButtons
            setIsElectionModalOpen={openElectionModal}
            setIsTopicModalOpen={openTopicModal}
            setIsCompanyNewsModalOpen={openCompanyNewsModal}
          />
        </div>

        <div className="CompanyDashboard-Content-Main">
          <CalenderWidget />
        </div>
        <div className="CompanyDashboard-Content-Main">
          <SavedElections savedElections={savedElections} />
          <PastElectionList pastElections={pastElections} />
        </div>
        <div className="CompanyDashboard-Content-Main">
          <UserProfile users={users} />
          <AdminUsersList admins={admins} />
        </div>
        <div className="CompanyDashboard-Content-Main">
          <ElectionList elections={upcomingElections} />
          <TopicWidget topics={topics} />
          <NewsWidget news={news} />
        </div>
      </div>
    </div>
  );
};

export default DashboardSections;