import React from "react";
import "./ProfileDetailsModal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faUserShield } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

const ProfileDetailsModal = ({
  user,
  onClose,
  onLikeCount,
  onGrantAdmin,
  likesCount,
  hasVoted,
}) => {
  if (!user) {
    return null;
  }

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };
  const modalVariants = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <motion.div
      className="ProfileDetailsModalBackdrop"
      onClick={onClose}
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <motion.div
        className="ProfileDetailsModal"
        onClick={(e) => e.stopPropagation()}
        variants={modalVariants}
      >
        <button
          className="CloseButton"
          onClick={onClose}
          aria-label="Close modal"
        >
          &times;
        </button>
        <div className="ProfileDetail-Content">
          <div className="ProfileImageContainer">
            <img
              src={user.userProfileImage}
              alt={`${user.firstName} ${user.lastName}`}
              className="ProfileImage"
            />
          </div>
          <div className="ProfileDetail-Content-Bottom">
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
              <span>Company Code:</span> {user.companyCode}
            </p>
            <p>
              <span>Role:</span> {user.role}
            </p>
          </div>
        </div>
        <div className="Profile-Buttons">
          <button onClick={onLikeCount} disabled={hasVoted}>
            <FontAwesomeIcon icon={faThumbsUp} /> Like{" "}
            {likesCount !== null && likesCount}
          </button>
          <button onClick={() => onGrantAdmin(user._id)}>
            <FontAwesomeIcon icon={faUserShield} /> Grant Admin
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProfileDetailsModal;
