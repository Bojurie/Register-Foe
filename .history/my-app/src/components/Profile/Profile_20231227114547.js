import React from "react";
import './Profile.css'
import placeholderImage from '../images/placeholder.png'; // Adjust the path as needed
import { useHistory } from 'react-router-dom';


const Profile = ({ user, onLikeProfile, onVoteProfile }) => {
    const history = useHistory();
  const profileImageUrl = user.userProfileImage
    ? user.userProfileImage
    : placeholderImage;



  const handleViewProfile = () => {
    history.push(`/profile/${user._id}`);
  };

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
        <button onClick={handleViewProfile}>View Profile</button>
        <button onClick={() => onLikeProfile(user)}>Like</button>
        <button onClick={() => onVoteProfile(user)}>Vote</button>
      </div>
    </div>
  );
};

export default Profile;