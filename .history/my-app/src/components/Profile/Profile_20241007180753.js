import React, { useState, useMemo } from "react";
import ProfileDetailsModal from "./ProfileDetailsModal";
import placeholderImage from "../images/placeholder.png";
import { useAuth } from "../AuthContext/AuthContext";
import "./Profile.css";

const Profile = ({ user }) => {
  const { updateRoleToAdmin, updateProfileLike } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileLikes, setProfileLikes] = useState(user?.profileLikes || 0);
  const [hasLiked, setHasLiked] = useState(user?.likedBy?.includes(user._id)); // Check if user has liked the profile
  const [likeMessage, setLikeMessage] = useState(""); // Display message for already liked

  const profileImageUrl = useMemo(
    () => user?.userProfileImage || placeholderImage,
    [user?.userProfileImage]
  );

  const handleProfileClick = () => {
    setIsModalOpen(true);
  };

  const handleGrantAdmin = async (userId) => {
    if (!userId) {
      console.error("handleGrantAdmin: Invalid userId provided:", userId);
      return;
    }

    try {
      await updateRoleToAdmin(userId);
      console.log(
        `${
          user.role === "Admin"
            ? "Admin rights revoked"
            : "Admin rights granted"
        } for ${user.firstName} ${user.lastName}`
      );
    } catch (error) {
      console.error("Error in toggling admin rights:", error);
    }
  };

  const handleProfileLike = async () => {
    if (hasLiked || !user?._id) {
      setLikeMessage("You have already liked this profile.");
      return;
    }

    try {
      const response = await updateProfileLike(user._id);
      if (response && response.profileLikes !== undefined) {
        setProfileLikes(response.profileLikes);
        setHasLiked(true);
        setLikeMessage(""); // Clear message on successful like
      } else {
        console.error("Invalid response structure:", response);
      }
    } catch (error) {
      if (
        error.response?.data?.message === "You have already liked this profile"
      ) {
        setLikeMessage("You have already liked this profile.");
      } else {
        console.error("Error updating profile likes:", error);
      }
    }
  };

  if (!user) {
    return <div className="Profile">User data is not available</div>;
  }

  return (
    <div className="ProfileCard" onClick={handleProfileClick}>
      <div className="ProfileCard-ImageContainer">
        <img
          src={profileImageUrl}
          alt={`${user.firstName || "Unknown"} ${
            user.lastName || "User"
          }'s profile`}
          className="ProfileCard-Image"
        />
      </div>
      <div className="ProfileCard-Details">
        <h4 className="ProfileCard-Name">
          {user.firstName || "Unknown"} {user.lastName || "User"}
        </h4>
        <p className="ProfileCard-Info">Sex: {user.sex || "N/A"}</p>
      </div>
      {isModalOpen && (
        <ProfileDetailsModal
          user={{ ...user, profileLikes }}
          onClose={() => setIsModalOpen(false)}
          onLikeCount={handleProfileLike}
          onGrantAdmin={() => handleGrantAdmin(user._id)}
          hasLiked={hasLiked}
          likeMessage={likeMessage} // Pass the likeMessage to the modal
        />
      )}
    </div>
  );
};

export default React.memo(Profile);
