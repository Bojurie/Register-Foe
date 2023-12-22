import React from "react";
import PropTypes from "prop-types";
import CandidateList from "../CandidateList/CandidateList";

const ElectionDetail = () => {


  return (
    <div className="Details">
      <div  className="election-Detail">
        <h3 className="election-name">{election.electionName}</h3>
        <p className="election-date">Election Date: {election.electionDate}</p>
        <p className="election-constituency">
          Constituency: {election.constituency}
        </p>
        <CandidateList />
      </div>
    </div>
  );
};


export default ElectionDetail;
