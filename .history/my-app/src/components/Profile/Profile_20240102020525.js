import React from "react";
import placeholderImage from "../images/placeholder.png";
import "./Profile.css";

const Profile = ({ user, onViewProfile }) => {
  const profileImageUrl = user.userProfileImage || placeholderImage;

  return (
    <div className="Profile" onClick={() => onViewProfile(user)}>
      <div className="Profile-Image">
        <img src={profileImageUrl} alt="Profile" />
      </div>
      <div className="Profile-BasicInfo">
        <h4>
          {user.firstName} {user.lastName}
        </h4>
        <p>Sex: {user.sex}</p>
      </div>
    </div>
  );
};

export default Profile;
