import React, { useMemo } from "react";
import "./ProfileDetailsModal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faUserShield } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import placeholderImage from "../images/placeholder.png";

const ProfileDetailsModal = ({ user, onClose, onLikeCount, hasVoted }) => {
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
    <motion.div className="ProfileDetailsModalBackdrop" onClick={onClose}>
      <motion.div className="ProfileDetailsModal">
        <button className="CloseButton" onClick={onClose}>
          &times;
        </button>
        <div className="ProfileDetail-Content">
          <img
            src={user.userProfileImage || placeholderImage}
            alt={`${user.firstName} ${user.lastName}`}
            className="ProfileImage"
          />
          <h4>
            {user.firstName} {user.lastName}
          </h4>
          <p>Email: {user.email}</p>
          <p>Votes Count: {user.likesCount}</p>
        </div>
        <div className="Profile-Buttons">
          <button onClick={onLikeCount} disabled={hasVoted}>
            Vote {user.likesCount}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default React.memo(ProfileDetailsModal);
