import React, { useState } from "react";
import ProfileDetailsModal from "./ProfileDetailsModal";
import { likeUser, voteForUser } from "../AuthAPI/AuthAPI";
import { useSnackbar } from "notistack";
import axios from "axios";

const Profile = ({users}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onLikeProfile = async (likedUser) => {
    try {
      await likeUser(likedUser._id);
      // Update the liked user's count if necessary (use a state management or context if needed)
      enqueueSnackbar("Profile liked successfully", { variant: "success" });
    } catch (error) {
      console.error("Error liking profile:", error);
      enqueueSnackbar("Failed to like profile", { variant: "error" });
    }
  };

  const onVoteProfile = async (votedUser) => {
    try {
      await voteForUser(votedUser._id);
      // Update the voted user's count if necessary
      enqueueSnackbar("Voted successfully", { variant: "success" });
    } catch (error) {
      console.error("Error voting for profile:", error);
      enqueueSnackbar("Failed to vote", { variant: "error" });
    }
  };

  const handleGrantAdmin = async (user) => {
    try {
      const userId = user._id;
      const response = await axios.patch(
        `http://localhost:3001/user/updateAdminStatus/${userId}`,
        { isAdmin: true }
      );
      // Update the user's admin status if necessary
      console.log(
        `Admin rights granted to ${response.data.firstName} ${response.data.lastName}`
      );
    } catch (error) {
      console.error("Error updating user admin status:", error);
      enqueueSnackbar("Failed to update admin status", { variant: "error" });
    }
  };

  const onViewProfile = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  if (!users || users.length === 0) {
    return <div>Loading user profiles...</div>;
  }

  return (
    <div>
      <h2>User Profiles</h2>

      {isModalOpen && (
        <ProfileDetailsModal
          user={selectedUser}
          onClose={() => setIsModalOpen(false)}
          onGrantAdmin={handleGrantAdmin}
          likesCount={likesCount}
          dislikesCount={dislikesCount}
          onLike={handleLike}
          onDislike={handleDislike}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default Profile;
