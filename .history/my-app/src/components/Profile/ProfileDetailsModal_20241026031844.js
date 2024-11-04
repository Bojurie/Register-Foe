import React, { useMemo, useState } from "react";
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
  const [voteStatus, setVoteStatus] = useState(
    hasLiked ? "You have already voted" : ""
  );
  const [voteSuccess, setVoteSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleVote = async () => {
    if (hasLiked) {
      setVoteStatus("You have already voted.");
      setVoteSuccess(false);
      return;
    }

    try {
      setLoading(true);
      await onLikeCount(user._id); // Assuming `onLikeCount` triggers the vote action
      setVoteStatus("Vote successful! Thank you for voting.");
      setVoteSuccess(true);
    } catch (error) {
      setVoteStatus("Failed to submit your vote. Please try again.");
      setVoteSuccess(false);
      console.error("Voting error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGrantAdmin = async () => {
    try {
      setLoading(true);
      await onGrantAdmin(user._id);
      setVoteStatus(
        `Admin rights ${user.role === "Admin" ? "revoked" : "granted"}`
      );
      setVoteSuccess(true);
    } catch (error) {
      setVoteStatus("Failed to update admin rights.");
      setVoteSuccess(false);
      console.error("Admin rights error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

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
                <span>Likes Count:</span> {user.profileLikes || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="Profile-Buttons">
          <button
            onClick={handleVote}
            disabled={hasLiked || loading}
            aria-label="Vote"
          >
            <FontAwesomeIcon icon={faThumbsUp} />{" "}
            {loading ? "Submitting..." : "Vote"}
          </button>
          <button
            onClick={handleGrantAdmin}
            disabled={loading}
            aria-label="Toggle Admin Rights"
          >
            <FontAwesomeIcon icon={faUserShield} />{" "}
            {user.role === "Admin" ? "Revoke Admin" : "Grant Admin"}
          </button>
        </div>
        <p className={`VoteStatusMessage ${voteSuccess ? "success" : "error"}`}>
          {voteStatus}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default React.memo(ProfileDetailsModal);
