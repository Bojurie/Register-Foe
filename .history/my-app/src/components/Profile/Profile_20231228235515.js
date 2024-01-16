import React from "react";
import "./Profile.css";
import placeholderImage from "../images/placeholder.png"; 
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsUp,
  faVoteYea,
  faEye,
} from "@fortawesome/free-solid-svg-icons";

const Profile = ({ user, onLikeProfile, onVoteProfile }) => {
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

  // Assuming 'likes' and 'votes' are properties of the 'user' object
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
        <button onClick={() => onLikeProfile(user)}>
          <FontAwesomeIcon icon={faThumbsUp} /> {likeCount}
        </button>
        <button onClick={() => onVoteProfile(user)}>
          <FontAwesomeIcon icon={faVoteYea} /> {voteCount}
        </button>
        <button onClick={handleViewProfile}>
          <FontAwesomeIcon icon={faEye} />
        </button>
      </div>
    </div>
  );
};

export default Profile;
