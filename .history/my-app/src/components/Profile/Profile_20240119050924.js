import React, { useState } from "react";
import ProfileDetailsModal from "./ProfileDetailsModal";
import placeholderImage from "../images/placeholder.png";
import { useAuth } from "../AuthContext/AuthContext";
import './Profile.css'

const Profile = ({ user, users }) => {
  console.log(users);

  const {
    updateRoleToAdmin,
    fetchAdminUsers,
    updateProfileLike,
  } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adminUsers, setAdminUsers] = useState([]);
  const [likesCount, setLikesCount] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);


  if (!user) {
    return <p>Loading...</p>;
  }

  const profileImageUrl = user?.userProfileImage || placeholderImage;

  const handleProfileClick = () => {
    setIsModalOpen(true);
  };

  const handleGrantAdmin = async () => {
    try {
      await updateRoleToAdmin(user._id);
      const updatedAdmins = await fetchAdminUsers();
      setAdminUsers(updatedAdmins);
    } catch (error) {
      console.error("Error in granting admin rights:", error);
    }
  };


  const handleVote = async () => {
    if (!hasVoted) {
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
          onLikeCount={handleVote}
          likesCount={likesCount}
          onGrantAdmin={handleGrantAdmin}
          hasVoted={hasVoted}
        />
      )}
    </div>
  );
};

export default Profile;