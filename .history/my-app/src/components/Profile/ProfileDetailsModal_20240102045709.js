import React from "react";
import "./ProfileDetailsModal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./ProfileDetailsModal.css";
import {
  faThumbsUp,
  faUserShield,
  faThumbsDown,
} from "@fortawesome/free-solid-svg-icons";

const ProfileDetailsModal = ({
  user,
  onClose,
  onDislikeCount,
  onLikeCount,
  onGrantAdmin,
}) => {
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
            <FontAwesomeIcon icon={faThumbsUp} /> {onLikeCount}
          </button>
          <button onClick={() => onVoteProfile(user)}>
            <FontAwesomeIcon icon={faThumbsDown} /> {onDislikeCount}
          </button>
          <button onClick={() => onGrantAdmin(user)}>
            <FontAwesomeIcon icon={faUserShield} /> Grant Admin
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetailsModal;