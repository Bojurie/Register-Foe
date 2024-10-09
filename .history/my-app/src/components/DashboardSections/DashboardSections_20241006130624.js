import React, { useState, useEffect, useMemo, useCallback } from "react";
import ElectionList from "../ElectionList /ElectionList";
import UserProfile from "../Profile/userProfile";
import TopicWidget from "../TopicWidget/TopicWidget";
import SavedElections from "../SavedElections/SavedElections";
import PastElectionList from "../PastElectionList/PastElectionList";
import AdminUsersList from "../AdminUsersList/AdminUsersList";
import NewsWidget from "../CompanyNews/NewsWidget";
import CalenderWidget from "../Calendar/CalenderWidget";
import "./DashboardSections.css";
import { useAuth } from "../AuthContext/AuthContext";




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
  messagingComponent,
}) => {
  const { getCandidatesById } = useAuth();
  const [collapsedSections, setCollapsedSections] = useState({});
  const [electionData, setElectionData] = useState([]);

  const toggleCollapse = (index) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const memoizedTopics = useMemo(
    () => (Array.isArray(topics) ? topics : []),
    [topics]
  );

  useEffect(() => {
    const fetchElectionsWithCandidates = async () => {
      try {
        // Log upcoming elections for debugging purposes
        console.log("Fetching upcoming elections:", upcomingElections);

        // Fetch all candidates for each election and merge them
        const updatedElections = await Promise.all(
          upcomingElections.map(async (election) => {
            try {
              console.log("Fetching candidates for election ID:", election._id);
              const response = await getCandidatesById(election._id);

              // Check if response is valid and has candidates
              if (response && Array.isArray(response.candidates)) {
                console.log(
                  "Candidates fetched for election ID:",
                  election._id,
                  response.candidates
                );

                // Create a new election object with updated candidates
                const updatedElection = {
                  ...election,
                  candidates: [...response.candidates], // Ensure a new array is used to avoid reference issues
                };

                console.log(
                  "Updated election with candidates:",
                  updatedElection
                );
                return updatedElection;
              } else {
                console.warn(
                  "No candidates found or unexpected structure for election ID:",
                  election._id
                );
                return {
                  ...election,
                  candidates: [],
                };
              }
            } catch (error) {
              console.error(
                "Failed to load candidates for election:",
                election._id,
                error
              );
              return {
                ...election,
                candidates: [],
              };
            }
          })
        );

        // Log the final updated elections to ensure data integrity
        console.log("Updated elections with candidates:", updatedElections);

        // Update the state to reflect the merged data
        setElectionData(updatedElections);
      } catch (error) {
        console.error("Error in fetching elections with candidates:", error);
      }
    };

    if (upcomingElections && upcomingElections.length > 0) {
      fetchElectionsWithCandidates();
    }
  }, [upcomingElections, getCandidatesById]);


  return (
    <div className="CompanyDashboard-Container">
      <div className="CompanyDashboard-Column">
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

      <div className="CompanyDashboard-Column">
        <div
          className={`CompanyDashboard-Content-Main ${
            collapsedSections[0] ? "collapsed" : ""
          }`}
        >
          {!collapsedSections[0] && (
            <button onClick={() => openElectionModal()} className="buttons">
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
            <button onClick={() => openTopicModal()} className="buttons">
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
            <button onClick={() => openCompanyNewsModal()} className="buttons">
              <h1>Post Company News</h1>
            </button>
          )}
        </div>
        <div
          className={`CompanyDashboard-Content-Main ${
            collapsedSections[7] ? "collapsed" : ""
          }`}
        >
          {!collapsedSections[7] && <AdminUsersList admins={admins} />}
        </div>
      </div>

      <div className="CompanyDashboard-Column">
        <div
          className={`CompanyDashboard-Content-Main ${
            collapsedSections[8] ? "collapsed" : ""
          }`}
        >
          {!collapsedSections[8] && <ElectionList elections={electionData} />}
        </div>
        <div
          className={`CompanyDashboard-Content-Main ${
            collapsedSections[9] ? "collapsed" : ""
          }`}
        >
          {!collapsedSections[9] && <TopicWidget topics={memoizedTopics} />}
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
            collapsedSections[11] ? "collapsed" : ""
          }`}
        >
          {!collapsedSections[11] && messagingComponent}
        </div>
      </div>
    </div>
  );
};

export default DashboardSections;