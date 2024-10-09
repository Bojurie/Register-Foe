import React, { useState, useMemo } from "react";
import ProfileDetailsModal from "./ProfileDetailsModal";
import placeholderImage from "../images/placeholder.png";
import { useAuth } from "../AuthContext/AuthContext";
import { FaBirthdayCake, FaUserPlus, FaCalendarAlt } from "react-icons/fa"; // Icons
import "./Profile.css";

const Profile = ({ user }) => {
  const { updateRoleToAdmin, updateProfileLike } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileLikes, setProfileLikes] = useState(user?.profileLikes || 0);
  const [hasLiked, setHasLiked] = useState(user?.likedBy?.includes(user._id));
  const [likeMessage, setLikeMessage] = useState("");

  const profileImageUrl = useMemo(
    () => user?.userProfileImage || placeholderImage,
    [user?.userProfileImage]
  );

  const handleProfileClick = () => {
    setIsModalOpen(true);
  };

  const handleGrantAdmin = async (userId) => {
    if (!userId) {
      console.error("Invalid userId provided:", userId);
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
        setLikeMessage("");
      }
    } catch (error) {
      console.error("Error updating profile likes:", error);
    }
  };

  // Collect all applicable status messages in an array
  const userStatusMessages = useMemo(() => {
    const messages = [];

    if (user?.birthdayCountdown !== undefined && user.birthdayCountdown <= 30) {
      messages.push({
        icon: <FaBirthdayCake />,
        text: `Birthday in ${user.birthdayCountdown} days! 🎂`,
      });
    }

    if (user?.isNewHire) {
      messages.push({
        icon: <FaUserPlus />,
        text: "New hire! 🎉",
      });
    }

    if (
      user?.anniversaryCountdown !== undefined &&
      user.anniversaryCountdown <= 30
    ) {
      messages.push({
        icon: <FaCalendarAlt />,
        text: `Anniversary in ${user.anniversaryCountdown} days! 🎉`,
      });
    }

    return messages;
  }, [user]);

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
        {userStatusMessages.length > 0 && (
          <div className="ProfileCard-Statuses">
            {userStatusMessages.map((status, index) => (
              <p key={index} className="ProfileCard-Status">
                {status.icon} {status.text}
              </p>
            ))}
          </div>
        )}
      </div>
      {isModalOpen && (
        <ProfileDetailsModal
          user={{ ...user, profileLikes }}
          onClose={() => setIsModalOpen(false)}
          onLikeCount={handleProfileLike}
          onGrantAdmin={() => handleGrantAdmin(user._id)}
          hasLiked={hasLiked}
          likeMessage={likeMessage}
        />
      )}
    </div>
  );
};

export default React.memo(Profile);
