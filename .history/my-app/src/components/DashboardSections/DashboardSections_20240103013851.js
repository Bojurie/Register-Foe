import React from "react";
import UserProfile from "../Profile/userProfile";
import ElectionList from "../ElectionList /ElectionList";
import TopicWidget from "../TopicWidget/TopicWidget";
import SavedElections from "../SavedElections/SavedElections";
import PastElectionList from "../PastElectionList/PastElectionList";

const DashboardSections = ({ users, upcomingElections, topics, userId }) => {
  return (
    <div className="CompanyDashboard-Container">
      <div className="CompanyDashboard-Content">
        <div className="CompanyDashboard-Left">
          <SavedElections />
          <PastElectionList userId={userId} />
        </div>
        <div className="CompanyDashboard-Center">
          <UserProfile users={users} />
        </div>
        <div className="CompanyDashboard-Right">
          <ElectionList elections={upcomingElections} />
          <TopicWidget topics={topics} />
        </div>
      </div>
    </div>
  );
};

export default DashboardSections;
