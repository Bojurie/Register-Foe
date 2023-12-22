import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const ElectionItem = ({ election }) => {
  if (!election) {
    return null; // or a placeholder component
  }

  return (
    <div className="election-item">
      <Link to={`/elections/${election._id}`} className="election-link">
        <h3 className="election-name">{election.electionName}</h3>
        <p className="election-date">Election Date: {election.electionDate}</p>
        <p className="election-constituency">
          Constituency: {election.constituency}
        </p>
      </Link>
      <ElectionComponent election={election} />
    </div>
  );
};

ElectionItem.propTypes = {
  election: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    electionName: PropTypes.string.isRequired,
    electionDate: PropTypes.string.isRequired,
    constituency: PropTypes.string.isRequired,
  }),
};

export default ElectionItem;
