import React, { useState } from "react";
import ProfileDetailsModal from "./ProfileDetailsModal";
import placeholderImage from "../images/placeholder.png";
import { useAuth } from "../AuthContext/AuthContext";
import './Profile.css'

const Profile = ({ user }) => {
  const {
    updateRoleToAdmin,
    fetchAdminUsers,
    updateProfileLike,
    updateProfileDislike,
  } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adminUsers, setAdminUsers] = useState([]);
  const [likesCount, setLikesCount] = useState(null);
  const [dislikesCount, setDislikesCount] = useState(null);



  if (!user) {
    return <p>Loading...</p>; // Or any other appropriate loading indicator
  }

  const profileImageUrl = user?.userProfileImage || placeholderImage;

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


const handleLike = async () => {
  try {
    const updatedCount = await updateProfileLike(user._id);
    setLikesCount(updatedCount.likes);
  } catch (error) {
    console.error("Error updating likes:", error);
  }
};

const handleDislike = async () => {
  try {
    const updatedCount = await updateProfileDislike(user._id);
    setDislikesCount(updatedCount.dislikes);
  } catch (error) {
    console.error("Error updating dislikes:", error);
  }
};

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
          onLikeCount={handleLike}
          onDislikeCount={handleDislike}
          likesCount={likesCount}
          dislikesCount={dislikesCount}
          onGrantAdmin={handleGrantAdmin}
        />
      )}
    </div>
  );
};

export default Profile;