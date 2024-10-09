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
    { title: "Register Election", action: openElectionModal },
    { title: "Create New Topic", action: openTopicModal },
    { title: "Post Company News", action: openCompanyNewsModal },
    { title: "Calendar Widget", content: <CalenderWidget /> },
    {
      title: "Saved Elections",
      content: <SavedElections savedElections={savedElections} />,
    },
    {
      title: "Past Elections",
      content: <PastElectionList pastElections={pastElections} />,
    },
    { title: "User Profiles", content: <UserProfile users={users} /> },
    { title: "Admin Users", content: <AdminUsersList admins={admins} /> },
    {
      title: "Upcoming Elections",
      content: <ElectionList elections={upcomingElections} />,
    },
    { title: "Topics to Vote", content: <TopicWidget topics={topics} /> },
    { title: "Company News", content: <NewsWidget news={news} /> },
  ];

  return (
    <div className="CompanyDashboard-Container">
      {sections.map((section, index) => (
        <div
          key={index}
          className={`CompanyDashboard-Content-Main ${
            collapsedSections[index] ? "collapsed" : ""
          }`}
        >
          <div className="buttons" onClick={() => toggleCollapse(index)}>
            <h1>{section.title}</h1>
          </div>
          {!collapsedSections[index] && section.action && (
            <button onClick={section.action} className="buttons">
              <h1>{section.title}</h1>
            </button>
          )}
          {!collapsedSections[index] && section.content && (
            <div className="content-wrapper">{section.content}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DashboardSections;
