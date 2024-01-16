import React, { useState } from "react";
import ProfileDetailsModal from "./ProfileDetailsModal";
import placeholderImage from "../images/placeholder.png";
import { useAuth } from "../AuthContext/AuthContext";


const Profile = ({ user, onLikeProfile, onDislikeProfile, onGrantAdmin }) => {
  const { updateRoleToAdmin, fetchAdminUsers } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adminUsers, setAdminUsers] = useState([]);

  const handleProfileClick = () => {
    setIsModalOpen(true);
  };

  const handleGrantAdmin = async () => {
    try {
      // Updated to use user._id
      await updateRoleToAdmin(user._id);
      const updatedAdmins = await fetchAdminUsers();
      setAdminUsers(updatedAdmins);
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