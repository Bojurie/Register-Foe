import React, { useState } from "react";
import ProfileDetailsModal from "./ProfileDetailsModal";
import placeholderImage from "../images/placeholder.png";
import { useAuth } from "../AuthContext/AuthContext";

const Profile = ({ user, onLikeProfile, onDislikeProfile, onGrantAdmin }) => {
  const { updateRoleToAdmin, fetchAdminUsers } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adminUsers, setAdminUsers] = useState(false);

  const handleProfileClick = () => {
    setIsModalOpen(true);
  };


  const handleGrantAdmin = async (user) => {
    try {
      // API call to update user role to admin
      await updateRoleToAdmin(user.id);
      // Fetch updated list of admins
      const updatedAdmins = await fetchAdminUsers();
      setAdminUsers(updatedAdmins); // Assuming you have a state to store admin users
    } catch (error) {
      console.error("Error in granting admin rights:", error);
    }
  };
  const profileImageUrl = user.userProfileImage || placeholderImage;

  return (
    <div className="Profile" onClick={handleProfileClick}>
      <div className="Profile-Image">
        <img
          src={profileImageUrl}
          alt={`${user.firstName} ${user.lastName}'s profile`}
        />
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
          onDislikeProfile={onDislikeProfile}
          onGrantAdmin={handleGrantAdmin}
        />
      )}
    </div>
  );
};

export default Profile;
