import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../AuthContext/AuthContext";
import "./ElectionComponent.css";
import ModalComponent from "../ModalComponent/ModalComponent";
import ElectionDetails from "../ElectionDetails/ElectionDetails";

const ElectionComponent = ({ election }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { getCandidatesById } = useAuth();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  const fetchCandidates = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getCandidatesById(election._id);
      if (response && response.candidates && response.candidates.length > 0) {
        setCandidates(response.candidates);
        setError("");
      } else {
        setError("No candidates found for this election.");
        setCandidates([]);
      }
    } catch (err) {
      console.error("Error fetching candidates:", err);
      setError("Failed to load candidates.");
    } finally {
      setLoading(false);
    }
  }, [election._id, getCandidatesById]);

  useEffect(() => {
    if (election?._id) {
      fetchCandidates();
    }
  }, [election, fetchCandidates]);

  return (
    <div className="ElectionComponent" onClick={toggleModal}>
      <h2>{election.title}</h2>
      <div className="ElectionComponent-content">
        <p>{`${new Date(election.startDate).toLocaleDateString()} - ${new Date(
          election.endDate
        ).toLocaleDateString()}`}</p>
        <p>Election Type: {election.electionType}</p>
        <p>Candidates:</p>
        {loading ? (
          <p>Loading candidates...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <ul className="ElectionComponent-candidate">
            {candidates.map((candidate) => (
              <li key={candidate.id}>
                {candidate.firstName} {candidate.lastName}
              </li>
            ))}
          </ul>
        )}
      </div>

      {isModalOpen && (
        <ModalComponent
          isModalOpen={isModalOpen}
          onClose={toggleModal}
          ContentComponent={ElectionDetails}
          contentProps={{ election, candidates }}
        />
      )}
    </div>
  );
};

export default ElectionComponent;
