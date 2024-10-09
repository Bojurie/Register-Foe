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
      <div className={`CompanyDashboard-Content-Main ${collapsedSections[0] ? "collapsed" : ""}`}>
        <div className="buttons" onClick={() => toggleCollapse(0)}>
          <h1>Register Election</h1>
        </div>
        {!collapsedSections[0] && (
          <button onClick={openElectionModal} className="buttons">
           <h1>Register Election</h1> 
          </button>
        )}
      </div>
      
      <div className={`CompanyDashboard-Content-Main ${collapsedSections[1] ? "collapsed" : ""}`}>
        <div className="buttons" onClick={() => toggleCollapse(1)}>
          <h1>Create New Topic</h1>
        </div>
        {!collapsedSections[1] && (
          <button onClick={openTopicModal} className="buttons">
           <h1>Create New Topic</h1> 
          </button>
        )}
      </div>
      
      <div className={`CompanyDashboard-Content-Main ${collapsedSections[2] ? "collapsed" : ""}`}>
       
        {!collapsedSections[2] && (
          <button onClick={openCompanyNewsModal} className="buttons">
           <h1>Post Company News</h1> 
          </button>
        )}
      </div>
      
      <div className={`CompanyDashboard-Content-Main ${collapsedSections[3] ? "collapsed" : ""}`}>
        <div className="buttons" onClick={() => toggleCollapse(3)}>
          <h1>Calendar Widget</h1>
        </div>
        {!collapsedSections[3] && <CalenderWidget />}
      </div>
      
      <div className={`CompanyDashboard-Content-Main ${collapsedSections[4] ? "collapsed" : ""}`}>
        <div className="buttons" onClick={() => toggleCollapse(4)}>
          <h1>Saved Elections</h1>
        </div>
        {!collapsedSections[4] && <SavedElections savedElections={savedElections} />}
      </div>
      
      <div className={`CompanyDashboard-Content-Main ${collapsedSections[5] ? "collapsed" : ""}`}>
        <div className="buttons" onClick={() => toggleCollapse(5)}>
          <h1>Past Elections</h1>
        </div>
        {!collapsedSections[5] && <PastElectionList pastElections={pastElections} />}
      </div>
      
      <div className={`CompanyDashboard-Content-Main ${collapsedSections[6] ? "collapsed" : ""}`}>
        <div className="buttons" onClick={() => toggleCollapse(6)}>
          <h1>User Profiles</h1>
        </div>
        {!collapsedSections[6] && <UserProfile users={users} />}
      </div>
      
      <div className={`CompanyDashboard-Content-Main ${collapsedSections[7] ? "collapsed" : ""}`}>
        <div className="buttons" onClick={() => toggleCollapse(7)}>
          <h1>Admin Users</h1>
        </div>
        {!collapsedSections[7] && <AdminUsersList admins={admins} />}
      </div>
      
      <div className={`CompanyDashboard-Content-Main ${collapsedSections[8] ? "collapsed" : ""}`}>
        <div className="buttons" onClick={() => toggleCollapse(8)}>
          <h1>Upcoming Elections</h1>
        </div>
        {!collapsedSections[8] && <ElectionList elections={upcomingElections} />}
      </div>
      
      <div className={`CompanyDashboard-Content-Main ${collapsedSections[9] ? "collapsed" : ""}`}>
        <div className="buttons" onClick={() => toggleCollapse(9)}>
          <h1>Topics to Vote</h1>
        </div>
        {!collapsedSections[9] && <TopicWidget topics={topics} />}
      </div>
      
      <div className={`CompanyDashboard-Content-Main ${collapsedSections[10] ? "collapsed" : ""}`}>
        <div className="buttons" onClick={() => toggleCollapse(10)}>
          <h1>Company News</h1>
        </div>
        {!collapsedSections[10] && <NewsWidget news={news} />}
      </div>
    </div>
  );
};

export default DashboardSections;