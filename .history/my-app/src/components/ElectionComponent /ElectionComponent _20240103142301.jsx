import React, { useState } from "react";
import { useAuth } from "../AuthContext/AuthContext";

const ElectionDetails = ({ election }) => {
  const [isSaved, setIsSaved] = useState(false);
  const { saveElection } = useAuth();

  const handleSaveClick = async () => {
    try {
      // You can directly access the election data here from the props
      await saveElection(election);
      setIsSaved(true);
    } catch (error) {
      console.error("Error in saving election:", error);
    }
  };

  return (
    <div className="ElectionDetails">
      <button onClick={handleSaveClick}>Save</button>
      {!isSaved ? null : <p>Saved!</p>}
    </div>
  );
};

export default ElectionDetails;
