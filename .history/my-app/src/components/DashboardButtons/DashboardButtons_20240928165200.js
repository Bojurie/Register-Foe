import React from "react";
import "./DashboardButtons.css";

const DashboardButtons = ({
  openElectionModal,
  openTopicModal,
  openCompanyNewsModal,
}) => {
  return (
    <div className="Dashboard-Buttons">
      <button onClick={openElectionModal}>Register Election</button>
      <button onClick={openTopicModal}>Create New Topic</button>
      <button onClick={openCompanyNewsModal}>Post Company News</button>
    </div>
  );
};

export default DashboardButtons;
