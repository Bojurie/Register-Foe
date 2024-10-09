import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../AuthContext/AuthContext";
import "./ElectionComponent.css";
import ModalComponent from "../ModalComponent/ModalComponent";
import ElectionDetails from "../ElectionDetails/ElectionDetails";

const ElectionComponent = ({ election }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { getCandidatesById } = useAuth();
  const [candidates, setCandidates] = useState([]);

  const toggleModal = useCallback(() => {
    setIsModalOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    if (election?._id) {
      const fetchCandidates = async () => {
        try {
          const result = await getCandidatesById(election._id);
          setCandidates(result);
        } catch (error) {
          console.error("Error fetching candidates:", error);
        }
      };
      fetchCandidates();
    }
  }, [election, getCandidatesById]);

  return (
    <div className="ElectionComponent" onClick={toggleModal}>
      <h2>{election.title}</h2>
      <div className="ElectionComponent-content">
        <p>{`${new Date(election.startDate).toLocaleDateString()} - ${new Date(
          election.endDate
        ).toLocaleDateString()}`}</p>
        <p>Election Type: {election.electionType}</p>
        <p>Candidates:</p>
        <ul className="ElectionComponent-candidate">
          {candidates.map((candidate) => (
            <li key={candidate.id}>
              {candidate.firstName} {candidate.lastName}
            </li>
          ))}
        </ul>
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

export default React.memo(ElectionComponent);
