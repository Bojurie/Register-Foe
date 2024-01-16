import React, { useState } from "react";
import ProfileDetailsModal from "./ProfileDetailsModal";
import { useSnackbar } from "notistack";

import placeholderImage from "../images/placeholder.png"; // Ensure this path is correct

const Profile = ({ user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleProfileClick = () => {
    setIsModalOpen(true);
  };

  const onLikeProfileCount = async (likedUser) => {
    // ... existing logic
  };

  const onDislikeProfileCount = async (votedUser) => {
    // ... existing logic
  };

  const handleGrantAdmin = async (user) => {
    // ... existing logic
  };

  const profileImageUrl = user.userProfileImage || placeholderImage;

  return (
    <div className="Profile" onClick={handleProfileClick}>
      <div className="Profile-Image">
        <img src={profileImageUrl} alt={`${user.firstName} ${user.lastName}`} />
      </div>
      <div className="Profile-BasicInfo">
        <h4>
          {user.firstName} {user.lastName}
        </h4>
        <p>Sex: {user.sex}</p>
      </div>
      {isModalOpen && (
        <ProfileDetailsModal
          user={user}
          onClose={() => setIsModalOpen(false)}
          onLikeProfile={onLikeProfileCount}
          onDislikeProfile={onDislikeProfileCount}
          onGrantAdmin={handleGrantAdmin}
        />
      )}
    </div>
  );
};

export default Profile;
