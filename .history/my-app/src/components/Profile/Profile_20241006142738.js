import React, { useState, useMemo, useCallback } from "react";
import ProfileDetailsModal from "./ProfileDetailsModal";
import placeholderImage from "../images/placeholder.png";
import { useAuth } from "../AuthContext/AuthContext";
import "./Profile.css";

const Profile = ({ user, isCandidate = false, votePercentage = 0 }) => {
  const { updateRoleToAdmin, updateProfileLike } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [likesCount, setLikesCount] = useState(user?.votesCount || 0);
  const [hasVoted, setHasVoted] = useState(false);

  const profileImageUrl = useMemo(
    () => user?.userProfileImage || placeholderImage,
    [user?.userProfileImage]
  );

  const handleProfileClick = useCallback(() => {
    if (user) {
      setIsModalOpen(true);
    }
  }, [user]);

  const handleGrantAdmin = useCallback(async () => {
    if (user?._id) {
      try {
        await updateRoleToAdmin(user._id);
        console.log(
          `Admin rights granted to ${user.firstName} ${user.lastName}`
        );
      } catch (error) {
        console.error("Error in granting admin rights:", error);
      }
    }
  }, [updateRoleToAdmin, user]);

  const handleVote = useCallback(async () => {
    if (!hasVoted && user?._id) {
      try {
        const response = await updateProfileLike(user._id);
        if (response && response.likes !== undefined) {
          setLikesCount(response.likes);
          setHasVoted(true);
        } else {
          console.error("Invalid response structure:", response);
        }
      } catch (error) {
        console.error("Error updating likes:", error);
      }
    }
  }, [hasVoted, updateProfileLike, user?._id]);

  if (!user) {
    return <div className="Profile">User data is not available</div>;
  }

  return (
    <div className="Profile" onClick={handleProfileClick}>
      <div className="Profile-Image">
        <img
          src={profileImageUrl}
          alt={`${user.firstName || "Unknown"} ${
            user.lastName || "User"
          }'s profile`}
        />
      </div>
      <div className="Profile-BasicInfo">
        <h4>
          {user.firstName || "Unknown"} {user.lastName || "User"}
        </h4>
        <p>Age: {user.age || "N/A"}</p>
        <p>Sex: {user.sex || "N/A"}</p>
        <p>Role: {user.role || "N/A"}</p>
        <p>About: {user.userProfileDetail || "No details provided"}</p>
        {isCandidate && (
          <>
            <p>
              Vote Percentage:{" "}
              {votePercentage !== undefined ? votePercentage.toFixed(2) : "N/A"}
              %
            </p>
            <p>Votes Count: {likesCount || 0}</p>
          </>
        )}
      </div>
      {isModalOpen && (
        <ProfileDetailsModal
          user={user}
          onClose={() => setIsModalOpen(false)}
          onLikeCount={handleVote}
          likesCount={likesCount}
          onGrantAdmin={handleGrantAdmin}
          hasVoted={hasVoted}
        />
      )}
    </div>
  );
};

export default React.memo(Profile);
