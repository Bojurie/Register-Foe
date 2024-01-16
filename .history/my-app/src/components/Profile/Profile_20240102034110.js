import React, { useState } from "react";
import ProfileDetailsModal from "./ProfileDetailsModal";
import { useSnackbar } from "notistack";

const Profile = ({ user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProfileClick = () => {
    setIsModalOpen(true);
  };

  const { enqueueSnackbar } = useSnackbar();
  const [selectedUser, setSelectedUser] = useState(null);

  const onLikeProfile = async (likedUser) => {
    // ... existing logic
  };

  const onVoteProfile = async (votedUser) => {
    // ... existing logic
  };

  const handleGrantAdmin = async (user) => {
    // ... existing logic
  };

  const onViewProfile = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  if (!users || users.length === 0) {
    return <div>No user profiles available.</div>;
  }
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
          onLikeProfile={onLikeProfile}
          onVoteProfile={onVoteProfile}
          onGrantAdmin={handleGrantAdmin}
        />
      )}
    </div>
  );
};

export default Profile;
