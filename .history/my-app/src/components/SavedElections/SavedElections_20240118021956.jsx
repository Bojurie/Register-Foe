import React from 'react'
import ElectionComponent from '../ElectionComponent /ElectionComponent '

function SavedElections({ savedElections }) {
  if (!Array.isArray(savedElections)) {
    console.error("savedElections is not an array:", savedElections);
    return null; // or handle it accordingly
  }

  return (
    <div>
      {savedElections.map((election) => (
        <ElectionComponent key={election._id} election={election} />
      ))}
    </div>
  );
}

export default SavedElections;