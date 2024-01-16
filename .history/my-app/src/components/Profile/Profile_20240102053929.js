import React, { useState } from "react";
import ProfileDetailsModal from "./ProfileDetailsModal";
import placeholderImage from "../images/placeholder.png"; 

const Profile = ({ user}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProfileClick = () => {
    setIsModalOpen(true);
  };
 

  const onLikeProfile = () => {
    console.log("Liked", user.firstName);
    // Implement like functionality here
  };

  const onDislikeProfile = () => {
    console.log("Disliked", user.firstName);
    // Implement dislike functionality here
  };

  const onGrantAdmin = () => {
    console.log("Granted admin to", user.firstName);
    // Implement grant admin functionality here
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
      {/* <div className="Profile-BasicInfo">
        <h4>
          {user.firstName} {user.lastName}
        </h4>
        <p>Sex: {user.sex}</p>
      </div> */}
      {isModalOpen && (
        <ProfileDetailsModal
          user={user}
          onClose={() => setIsModalOpen(false)}
          onLikeProfile={onLikeProfile}
          onDislikeProfile={onDislikeProfile}
          onGrantAdmin={onGrantAdmin}
        />
      )}
    </div>
  );
};

export default Profile;
