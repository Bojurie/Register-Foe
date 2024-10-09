

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../AuthContext/AuthContext";
import "./ElectionComponent.css";
import ModalComponent from "../ModalComponent/ModalComponent";


const ElectionComponent = ({ election }) => {
  const { postElectionVote, getElectionById } = useAuth();
  const [candidates, setCandidates] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
    const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  useEffect(() => {
    if (election?.candidates) {
      setCandidates(election.candidates);
    }
  }, [election]);

  const handleVote = async (candidateId) => {
    try {
      setIsLoading(true);
      await postElectionVote(election._id, candidateId);
      alert("Vote cast successfully");
      await fetchElectionData(election._id);
    } catch (error) {
      setError("Failed to cast vote. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchElectionData = useCallback(
    async (electionId) => {
      try {
        const updatedElection = await getElectionById(electionId);
        setCandidates(updatedElection.candidates);
      } catch (error) {
        setError("Error fetching updated election data.");
      }
    },
    [getElectionById]
  );

  return (
    <div className="ElectionComponent"  onClick={toggleModal}>
      <h2>{election.title}</h2>
      <div className="ElectionComponent-Header">
        {candidates.map((candidate) => (
          <div key={candidate.candidateId} className="CandidateItem">
           <p>{`${formatDate(election.startDate)} - ${formatDate(
          election.endDate
        )}`}</p>
            <p>
              Candidate ID: {candidate.candidateId} - Votes:{" "}
              {candidate.voteCount}
            </p>
            <p>
              Percentage:{" "}
              {election.totalVotes > 0
                ? ((candidate.voteCount / election.totalVotes) * 100).toFixed(2)
                : 0}
              %
            </p>
            <button
              onClick={() => handleVote(candidate.candidateId)}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Vote"}
            </button>
          </div>
        ))}
      </div>
       <ModalComponent
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        ContentComponent={ElectionDetails}
        contentProps={{ election }}
      />
      {error && <p className="error">{error}</p>}
    </div>
    
  );
};

export default ElectionComponent;
