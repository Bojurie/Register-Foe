import React, { useState } from "react";
import ElectionDetails from "../ElectionDetails/ElectionDetails";
import ModalComponent from "../ModalComponent/ModalComponent";
import { formatDate } from "../utils";
import './ElectionComponent.css'


const ElectionComponent = ({ election }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  return (
    <div className="ElectionComponent" onClick={toggleModal}>
      <div className="ElectionComponent-Header">
        <h3>{election.title || "Election Title Not Available"}</h3>
        <p>{`${formatDate(election.startDate)} - ${formatDate(
          election.endDate
        )}`}</p>
        <p>
          Location: {election.city}, {election.state}
        </p>
        <p>Type: {election.electionType}</p>
      </div>

      <ModalComponent
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        ContentComponent={ElectionDetails}
        contentProps={{ election }}
      />
    </div>
  );
};

export default ElectionComponent;

