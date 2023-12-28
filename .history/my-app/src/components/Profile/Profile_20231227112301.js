import React from "react";
import './Profile.css'
import placeholderImage from '../images/placeholder.png'; // Adjust the path as needed


const Profile = ({ user, onViewProfile, onLikeProfile, onVoteProfile }) => {
  const profileImageUrl = user.userProfileImage
    ? user.userProfileImage
    : placeholderImage;


  return (
    <div className="Profile">
      <div className="Profile-Image">
        <img src={profileImageUrl} alt="Profile" />
      </div>
      <div className="Profile-Content">
        <h4>
          {user.firstName} {user.lastName}
        </h4>
        <p>{user.email}</p>
        {/* <button onClick={() => onViewProfile(user)}>View Profile</button> */}
        <button onClick={() => onLikeProfile(user)}>Like</button>
        <button onClick={() => onVoteProfile(user)}>Vote</button>
      </div>
    </div>
  );
};

export default Profile;