import React from 'react'
import ElectionComponent from '../ElectionComponent /ElectionComponent '
import './SavedElections.css'

function SavedElections({ savedElections }) {
  if (!Array.isArray(savedElections)) {
    console.error("savedElections is not an array:", savedElections);
    return null; // or handle it accordingly
  }

  return (
    <div>
      <h2>Saved Elections</h2>
      <div className="scrollable-container">
        {savedElections.map((election) => (
          <ElectionComponent key={election.id} election={election} />
        ))}
      </div>
    </div>
  );
}

export default SavedElections;