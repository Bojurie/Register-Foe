import React, { useState } from "react";
import ProfileDetailsModal from "./ProfileDetailsModal";
import { likeUser, voteForUser } from "../AuthAPI/AuthAPI";
import { useSnackbar } from "notistack";
import axios from "axios";

const Profile = ({ users }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
  return (
    <div>
      <h2>User Profiles</h2>

      {isModalOpen && (
        <ProfileDetailsModal
          user={selectedUser}
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
