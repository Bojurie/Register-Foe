import React from "react";
import "./Profile.css";
import placeholderImage from "../images/placeholder.png"; 
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsUp,
  faVoteYea,
  faEye,
  faUserShield,
} from "@fortawesome/free-solid-svg-icons";

const Profile = ({ user, onLikeProfile, onVoteProfile, onGrantAdmin }) => {
  const navigate = useNavigate();

  if (!user) {
    return <div>Loading user profile...</div>;
  }

  const profileImageUrl = user.userProfileImage
    ? user.userProfileImage
    : placeholderImage;

  const handleViewProfile = () => {
    navigate(`/profile/${user._id}`);
  };

  const likeCount = user.likes || 0;
  const voteCount = user.votes || 0;

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
        <p>{user.email}</p>
        <p>{user.age}</p>
        <p>{user.userProfileDetail}</p>
        <p>{user.companyCode}</p>
        <button onClick={() => onLikeProfile(user)}>
          <FontAwesomeIcon icon={faThumbsUp} /> {likeCount}
        </button>
        <button onClick={() => onVoteProfile(user)}>
          <FontAwesomeIcon icon={faVoteYea} /> {voteCount}
        </button>
        <button onClick={handleViewProfile}>
          <FontAwesomeIcon icon={faEye} />
        </button>
        {/* Grant Admin Button */}
        <button onClick={() => onGrantAdmin(user)}>
          <FontAwesomeIcon icon={faUserShield} /> Grant Admin
        </button>
      </div>
    </div>
  );
};

export default Profile;