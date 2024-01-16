import React from "react";
import "./ProfileDetailsModal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsUp,
  faThumbsDown,
  faUserShield,
} from "@fortawesome/free-solid-svg-icons";

const ProfileDetailsModal = ({
  user,
  onClose,
  onLikeCount,
  onDislikeCount,
  onGrantAdmin,
}) => {
  if (!user) {
    return null;
  }

  const handleBackdropClick = (event) => {
    // Close the modal only if the click is on the backdrop
    if (event.target.classList.contains("ProfileDetailsModal")) {
      onClose();
    }
  };

  return (
    <div className="ProfileDetailsModal" onClick={handleBackdropClick}>
      <div className="ModalContent">
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
            <button onClick={() => onLikeCount(user)}>
              <FontAwesomeIcon icon={faThumbsUp} /> Like
            </button>
            <button onClick={() => onDislikeCount(user)}>
              <FontAwesomeIcon icon={faThumbsDown} /> Dislike
            </button>
            <button onClick={() => onGrantAdmin(user)}>
              <FontAwesomeIcon icon={faUserShield} /> Grant Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetailsModal;
