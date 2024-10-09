import React, { useMemo } from "react";
import "./ProfileDetailsModal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faUserShield } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import placeholderImage from "../images/placeholder.png";

const ProfileDetailsModal = ({
  user,
  onClose,
  onLikeCount,
  onGrantAdmin,
  hasVoted,
}) => {
  const profileImageUrl = useMemo(
    () => user?.userProfileImage || placeholderImage,
    [user?.userProfileImage]
  );

  const backdropVariants = useMemo(
    () => ({
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    }),
    []
  );

  const modalVariants = useMemo(
    () => ({
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
    }),
    []
  );

  if (!user) {
    return null; // Return null if no user data is available to render
  }

  // Add logs for debugging
  console.log("Rendering ProfileDetailsModal for user:", user);
  console.log("Has voted:", hasVoted);

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
        role="dialog"
        aria-labelledby="profileDetailsTitle"
        aria-describedby="profileDetailsContent"
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
              src={profileImageUrl}
              alt={`${user.firstName} ${user.lastName}`}
              className="ProfileImage"
            />
          </div>
          <div
            id="profileDetailsContent"
            className="ProfileDetail-Content-Bottom"
          >
            <h4 id="profileDetailsTitle">
              {user.firstName} {user.lastName}
            </h4>
            <p>
              <span>About:</span>{" "}
              {user.userProfileDetail || "No details provided"}
            </p>
            <p>
              <span>Email:</span> {user.email || "N/A"}
            </p>
            <p>
              <span>Age:</span> {user.age || "N/A"}
            </p>
            <p>
              <span>Sex:</span> {user.sex || "N/A"}
            </p>
            <p>
              <span>Company Code:</span> {user.companyCode || "N/A"}
            </p>
            <p>
              <span>Role:</span> {user.role || "N/A"}
            </p>
            <p>
              <span>Votes Count:</span> {user.likesCount || 0}
            </p>
          </div>
        </div>
        <div className="Profile-Buttons">
          <button
            onClick={() => {
              console.log("Like button clicked for user:", user._id);
              onLikeCount();
            }}
            disabled={hasVoted}
            aria-label={`Like ${user.firstName} ${user.lastName}`}
          >
            <FontAwesomeIcon icon={faThumbsUp} /> Vote {user.likesCount}
          </button>
          <button
            onClick={() => {
              console.log("Grant admin button clicked for user:", user._id);
              onGrantAdmin(user._id);
            }}
            aria-label={`Grant admin rights to ${user.firstName} ${user.lastName}`}
          >
            <FontAwesomeIcon icon={faUserShield} />{" "}
            {user.role === "Admin" ? "Revoke Admin" : "Grant Admin"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default React.memo(ProfileDetailsModal);
