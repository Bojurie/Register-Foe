import React from "react";
import ElectionList from "../ElectionList /ElectionList";
import UserProfile from "../Profile/userProfile";
import TopicWidget from "../TopicWidget/TopicWidget";
// import SavedElections from "../SavedElections/SavedElections";
import PastElectionList from "../PastElectionList/PastElectionList";
import AdminUsersList from "../AdminUsersList/AdminUsersList";
import NewsWidget from "../CompanyNews/NewsWidget";
import SavedElections from "../SavedElections/SavedElections";
import CalenderWidget from "../Calendar/CalenderWidget";

const DashboardSections = ({
  users,
  upcomingElections,
  topics,
  userId,
  admins,
  news,
  savedElections,
  pastElections,
}) => {
  console.log(savedElections);

  const savedElectionsArray = Array.isArray(savedElections)
    ? savedElections
    : savedElections.savedElections || [];
console.log("Admins:", admins);

  return (
    <div className="CompanyDashboard-Container">
      <div className="CompanyDashboard-Content">
        <div>
          <CalenderWidget />
        </div>
        <div className="CompanyDashboard-Left">
          <SavedElections savedElections={savedElectionsArray} />
          <PastElectionList pastElections={pastElections} />
        </div>
        <div className="CompanyDashboard-Center">
          <UserProfile users={users} />
          <AdminUsersList admins={admins} />
        </div>
        <div className="CompanyDashboard-Right">
          <ElectionList elections={upcomingElections} />
          <TopicWidget topics={topics} />
          <NewsWidget news={news} />
        </div>
      </div>
    </div>
  );
};
export default DashboardSections;