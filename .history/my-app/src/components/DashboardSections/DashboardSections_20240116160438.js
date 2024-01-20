import React from "react";
import ElectionList from "../ElectionList /ElectionList";
import UserProfile from "../Profile/userProfile";
import TopicWidget from "../TopicWidget/TopicWidget";
import SavedElections from "../SavedElections/SavedElections";
import PastElectionList from "../PastElectionList/PastElectionList";
import AdminUsersList from "../AdminUsersList/AdminUsersList";
import NewsWidget from "../CompanyNews/NewsWidget";

const DashboardSections = ({ users, upcomingElections, topics, userId, admins, news }) => {
  return (
    <div className="CompanyDashboard-Container">

      <div className="CompanyDashboard-Content">
      <div>
        <AdminUsersList admins={admins}/>
      </div>
        <div className="CompanyDashboard-Left">
          <SavedElections />
          <PastElectionList userId={userId} />
        </div>
        <div className="CompanyDashboard-Center">
          <UserProfile users={users} />
       </div>
        <div className="CompanyDashboard-Right">
          <ElectionList elections={upcomingElections} users={users}/>
          <TopicWidget topics={topics} />
          <NewsWidget news={news}/>
        </div>
      </div>
    </div>
  );
};

export default DashboardSections;
