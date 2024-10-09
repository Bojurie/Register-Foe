import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext/AuthContext";
import "./ElectionComponent.css";
import ModalComponent from "../ModalComponent/ModalComponent";
import ElectionDetails from "../ElectionDetails/ElectionDetails";

const ElectionComponent = ({ election }) => {
  const [candidates, setCandidates] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  useEffect(() => {
    if (election?.candidates) {
      setCandidates(election.candidates);
    }
  }, [election]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="ElectionComponent" onClick={toggleModal}>
      <h2>{election.title}</h2>
      <div className="ElectionComponent-content">
        <p>{`${formatDate(election.startDate)} - ${formatDate(
          election.endDate
        )}`}</p>
        <p>Election Type: {election.electionType}</p>
        <p>Candidates:</p>
        <ul className="ElectionComponent-candidate">
          {candidates.map((candidate) => (
            <li key={candidate._id}>
              {candidate?.candidateId?.firstName}{" "}
              {candidate?.candidateId?.lastName}
            </li>
          ))}
        </ul>
      </div>

      <ModalComponent
        isModalOpen={isModalOpen}
        onClose={toggleModal}
        ContentComponent={ElectionDetails}
        contentProps={{ election }}
      />
    </div>
  );
};

export default ElectionComponent;
