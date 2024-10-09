import React, { useState, useMemo } from "react";
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

  const handleProfileClick = () => {
    setIsModalOpen(true);
  };

  const handleGrantAdmin = async () => {
    if (!user?._id) return;
    try {
      await updateRoleToAdmin(user._id);
      console.log(`Admin rights granted to ${user.firstName} ${user.lastName}`);
    } catch (error) {
      console.error("Error in granting admin rights:", error);
    }
  };

  const handleVote = async () => {
    if (hasVoted || !user?._id) return;
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
  };

  if (!user) {
    return <div className="Profile">User data is not available</div>;
  }

  return (
    <div className="ProfileCard" onClick={handleProfileClick}>
      <div className="ProfileCard-ImageContainer">
        <img
          src={profileImageUrl}
          alt={`${user.firstName || "Unknown"} ${user.lastName || "User"}'s profile`}
          className="ProfileCard-Image"
        />
      </div>
      <div className="ProfileCard-Details">
        <h4 className="ProfileCard-Name">
          {user.firstName || "Unknown"} {user.lastName || "User"}
        </h4>
        <p className="ProfileCard-Info">Age: {user.age || "N/A"}</p>
        <p className="ProfileCard-Info">Sex: {user.sex || "N/A"}</p>
        <p className="ProfileCard-Info">Role: {user.role || "N/A"}</p>
        <p className="ProfileCard-Info">About: {user.userProfileDetail || "No details provided"}</p>
        {isCandidate && (
          <>
            <p className="ProfileCard-Info">
              Vote Percentage: {votePercentage !== undefined ? votePercentage.toFixed(2) : "N/A"}%
            </p>
            <p className="ProfileCard-Info">Votes Count: {likesCount}</p>
          </>
        )}
      </div>
      {isModalOpen && (
        <ProfileDetailsModal
          user={{ ...user, likesCount }}
          onClose={() => setIsModalOpen(false)}
          onLikeCount={handleVote}
          onGrantAdmin={handleGrantAdmin}
          hasVoted={hasVoted}
        />
      )}
    </div>
  );
};

export default React.memo(Profile);
