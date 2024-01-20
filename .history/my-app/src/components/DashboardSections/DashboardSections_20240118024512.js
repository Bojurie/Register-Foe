import React from "react";
import ElectionList from "../ElectionList /ElectionList";
import UserProfile from "../Profile/userProfile";
import TopicWidget from "../TopicWidget/TopicWidget";
// import SavedElections from "../SavedElections/SavedElections";
import PastElectionList from "../PastElectionList/PastElectionList";
import AdminUsersList from "../AdminUsersList/AdminUsersList";
import NewsWidget from "../CompanyNews/NewsWidget";
import SavedElections from "../SavedElections/SavedElections";

const DashboardSections = ({
  users,
  upcomingElections,
  topics,
  userId,
  admins,
  news,
  savedElections,
}) => {
  return (
    <div className="CompanyDashboard-Container">
      <div className="CompanyDashboard-Content">
        <div></div>
        <div className="CompanyDashboard-Left">
          {/* <SavedElections savedElections={savedElections} /> */}
          <SavedElections savedElections={savedElections} />
          <PastElectionList userId={userId} />
        </div>
        <div className="CompanyDashboard-Center">
          <UserProfile users={users} />
          <AdminUsersList admins={admins} />
        </div>
        <div className="CompanyDashboard-Right">
          <ElectionList elections={upcomingElections} users={users} />
          <TopicWidget topics={topics} />
          <NewsWidget news={news} />
        </div>
      </div>
    </div>
  );
};

export default DashboardSections;
