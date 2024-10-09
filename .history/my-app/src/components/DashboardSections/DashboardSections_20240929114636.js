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
  admins,
  news,
  savedElections,
  pastElections,
  openElectionModal,
  openTopicModal,
  openCompanyNewsModal,
}) => {
  const [collapsedSections, setCollapsedSections] = useState({});

  const toggleCollapse = (index) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const sections = [
    {
      title: "Calendar Widget",
      component: <CalenderWidget />,
      index: 3,
    },
    {
      title: "Company News",
      component: <NewsWidget news={news} />,
      index: 10,
    },
    {
      title: "User Profiles",
      component: <UserProfile users={users} />,
      index: 6,
    },
    {
      title: "Register Election",
      action: openElectionModal,
      index: 0,
    },
    {
      title: "Create New Topic",
      action: openTopicModal,
      index: 1,
    },
    {
      title: "Post Company News",
      action: openCompanyNewsModal,
      index: 2,
    },
    {
      title: "Admin Users",
      component: <AdminUsersList admins={admins} />,
      index: 7,
    },
    {
      title: "Upcoming Elections",
      component: <ElectionList elections={upcomingElections} />,
      index: 8,
    },
    {
      title: "Topics to Vote",
      component: <TopicWidget topics={topics} />,
      index: 9,
    },
    {
      title: "Saved Elections",
      component: <SavedElections savedElections={savedElections} />,
      index: 4,
    },
    {
      title: "Past Elections",
      component: <PastElectionList pastElections={pastElections} />,
      index: 5,
    },
  ];

  return (
    <div className="CompanyDashboard-Container">
      {sections.map((section) => (
        <div
          key={section.index}
          className={`CompanyDashboard-Content-Main ${
            collapsedSections[section.index] ? "collapsed" : ""
          }`}
        >
          <div
            className="buttons"
            onClick={() => toggleCollapse(section.index)}
          >
            <h1>{section.title}</h1>
          </div>
          {!collapsedSections[section.index] && section.action && (
            <button onClick={section.action} className="buttons">
              {section.title}
            </button>
          )}
          {!collapsedSections[section.index] && section.component}
        </div>
      ))}
    </div>
  );
};

export default DashboardSections;