import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    if (election?._id) {
      const fetchCandidates = async () => {
        try {
          setLoading(true);
          const result = await getCandidatesById(election._id);
          if (result?.candidates && result.candidates.length > 0) {
            setCandidates(result.candidates);
            setError("");
          } else {
            setError("No candidates found for this election.");
          }
        } catch (error) {
          console.error("Error fetching candidates:", error);
          setError("Failed to fetch candidates.");
        } finally {
          setLoading(false);
        }
      };
      fetchCandidates();
    }
  }, [election]);

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
          <p className="error">{error}</p>
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

      <ModalComponent
        isModalOpen={isModalOpen}
        onClose={toggleModal}
        ContentComponent={ElectionDetails}
        contentProps={{ election, candidates }}
      />
    </div>
  );
};

export default ElectionComponent;
