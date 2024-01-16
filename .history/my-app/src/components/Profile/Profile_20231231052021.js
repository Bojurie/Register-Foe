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


  const profileVariants = {
    initial: {
      scale: 1,
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
    hover: {
      scale: 1.05,
      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
    },
  };

  return (
    <div
      variants={profileVariants}
      initial="initial"
      whileHover="hover"
      transition={{ type: "spring", stiffness: 300 }}
      className="Profile"
    >
      <div className="Profile-Image">
        <img src={profileImageUrl} alt="Profile" />
      </div>
      <div className="Profile-Content">
        <h4>
          {user.firstName} {user.lastName}
        </h4>
        <p>
          {" "}
          <span>About:</span> {user.userProfileDetail}
        </p>
        <p>
          <span>Email: </span>
          {user.email}
        </p>
        <p>
          <span>Age:</span> {user.age}
        </p>
        <p>
          <span>Sex:</span> {user.sex}
        </p>
        <p>
          <span>CompanyCode:</span> {user.companyCode}
        </p>
        <div className="Profile-Buttons">
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
    </div>
  );
};

export default Profile;