import React, { useState } from "react";
import ProfileDetailsModal from "./ProfileDetailsModal";
import placeholderImage from "../images/placeholder.png";

const Profile = ({ user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProfileClick = () => {
    setIsModalOpen(true);
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
        />
      )}
    </div>
  );
};

export default Profile;