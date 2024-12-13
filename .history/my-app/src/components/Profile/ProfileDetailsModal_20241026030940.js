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
  hasLiked,
  likeMessage,
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

  const userStatusMessage = useMemo(() => {
    if (user?.birthdayCountdown) {
      return `Birthday in ${user.birthdayCountdown} days! 🎂`;
    }
    if (user?.isNewHire) {
      return "New hire! 🎉";
    }
    if (user?.anniversaryCountdown) {
      return `Anniversary in ${user.anniversaryCountdown} days! 🎉`;
    }
    return null;
  }, [user]);

  if (!user) {
    return null;
  }

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
            <div className="user-info">
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
                <span>Role:</span> {user.role || "N/A"}
              </p>
              <p>
                <span>Profile Detail:</span>{" "}
                {user.userProfileDetail || "No details provided"}
              </p>
              <p>
                <span>Likes Count:</span> {user.profileLikes || 0}
              </p>
              {userStatusMessage && (
                <p className="ProfileStatus">{userStatusMessage}</p>
              )}
            </div>
          </div>
        </div>
        <div className="Profile-Buttons">
          <button
            onClick={onLikeCount}
            disabled={hasLiked}
            aria-label={`Like ${user.firstName} ${user.lastName}`}
          >
            <FontAwesomeIcon icon={faThumbsUp} /> Like {user.profileLikes}
          </button>

          <button
            onClick={() => onGrantAdmin(user._id)}
            aria-label={`Grant admin rights to ${user.firstName} ${user.lastName}`}
          >
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
