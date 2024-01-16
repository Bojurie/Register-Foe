import React from "react";
import "./ProfileDetailsModal.css"; // Create appropriate CSS for modal
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsUp,
  faVoteYea,
  faUserShield,
} from "@fortawesome/free-solid-svg-icons";

const ProfileDetailsModal = ({ user, onClose, ... }) => {


  const likeCount = user.likes || 0;
  const voteCount = user.votes || 0;

  if (!user) {
    return null;
  }

  return (
    <div className="ProfileDetailsModal">
      <button className="CloseButton" onClick={onClose}>
        X
      </button>
      <div className="Profile-Content">
        <h4>
          {user.firstName} {user.lastName}
        </h4>
        <p>
          <span>About:</span> {user.userProfileDetail}
        </p>
        <p>
          <span>Email:</span> {user.email}
        </p>
        <p>
          <span>Age:</span> {user.age}
        </p>
        <p>
          <span>Sex:</span> {user.sex}
        </p>
        <p>
          <span>CompanyCode:</span> {user.companyCode}
        </p>
        <div className="Profile-Buttons">
          <button onClick={() => onLikeProfile(user)}>
            <FontAwesomeIcon icon={faThumbsUp} /> {likeCount}
          </button>
          <button onClick={() => onVoteProfile(user)}>
            <FontAwesomeIcon icon={faVoteYea} /> {voteCount}
          </button>
          {/* Grant Admin Button */}
          <button onClick={() => onGrantAdmin(user)}>
            <FontAwesomeIcon icon={faUserShield} /> Grant Admin
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetailsModal;
