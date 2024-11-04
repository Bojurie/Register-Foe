import React, { useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faUserShield } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import placeholderImage from "../images/placeholder.png";
import "./ProfileDetailsModal.css";

const ProfileDetailsModal = ({
  user,
  onClose,
  onLikeCount,
  onGrantAdmin,
  hasLiked,
  likeMessage,
}) => {
  const profileImageUrl = useMemo(
    () => user?.userProfileImage || placeholderImage,
    [user?.userProfileImage]
  );

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const userStatusMessage = useMemo(() => {
    if (user?.birthdayCountdown)
      return `Birthday in ${user.birthdayCountdown} days! 🎂`;
    if (user?.isNewHire) return "New hire! 🎉";
    if (user?.anniversaryCountdown)
      return `Anniversary in ${user.anniversaryCountdown} days! 🎉`;
    return null;
  }, [user]);

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
          <img
            src={profileImageUrl}
            alt={`${user.firstName} ${user.lastName}`}
            className="ProfileImage"
          />
          <div className="ProfileDetail-Content-Bottom">
            <h4 id="profileDetailsTitle">
              {user.firstName} {user.lastName}
            </h4>
            <p>Email: {user.email || "N/A"}</p>
            <p>Age: {user.age || "N/A"}</p>
            <p>Sex: {user.sex || "N/A"}</p>
            <p>Role: {user.role || "N/A"}</p>
            <p>
              Profile Detail: {user.userProfileDetail || "No details provided"}
            </p>
            <p>Likes Count: {user.profileLikes || 0}</p>
            {userStatusMessage && (
              <p className="ProfileStatus">{userStatusMessage}</p>
            )}
          </div>
        </div>
        <div className="Profile-Buttons">
          <button onClick={onLikeCount} disabled={hasLiked}>
            <FontAwesomeIcon icon={faThumbsUp} /> Like {user.profileLikes}
          </button>
          <button onClick={onGrantAdmin}>
            <FontAwesomeIcon icon={faUserShield} />{" "}
            {user.role === "Admin" ? "Revoke Admin" : "Grant Admin"}
          </button>
        </div>
        {likeMessage && <p className="LikeMessage">{likeMessage}</p>}
      </motion.div>
    </motion.div>
  );
};

export default React.memo(ProfileDetailsModal);
