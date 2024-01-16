import React from "react";

const DashboardButtons = ({
  setIsElectionModalOpen,
  setIsTopicModalOpen,
  setIsCompanyNewsModalOpen,
}) => {
  return (
    <div className="Dashboard-Buttons">
      <button onClick={() => setIsElectionModalOpen(true)}>
        Register Election
      </button>
      <button onClick={() => setIsTopicModalOpen(true)}>
        Create New Topic
      </button>
      <button onClick={() => setIsCompanyNewsModalOpen(true)}>
        Post Company News
      </button>
    </div>
  );
};

export default DashboardButtons;
