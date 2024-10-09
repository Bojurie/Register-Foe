const Profile = ({ user }) => {
  const { updateRoleToAdmin, updateProfileLike } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [likesCount, setLikesCount] = useState(user?.likesCount || 0);
  const [hasVoted, setHasVoted] = useState(false);

  if (!user || !user._id) {
    console.error("Profile component received invalid user:", user);
    return <div className="Profile">User data is not available</div>;
  }

  const handleProfileClick = () => {
    console.log("Profile clicked for user:", user._id);
    setIsModalOpen(true);
  };

  const handleGrantAdmin = async () => {
    if (!user?._id) {
      console.error("Cannot grant admin: Invalid user ID");
      return;
    }
    try {
      await updateRoleToAdmin(user._id);
      console.log(
        `Admin rights updated for ${user.firstName} ${user.lastName}`
      );
    } catch (error) {
      console.error("Error in granting admin rights:", error);
    }
  };

  const handleVote = async () => {
    if (hasVoted || !user?._id) {
      console.error("Cannot vote: Either already voted or invalid user ID");
      return;
    }
    try {
      const response = await updateProfileLike(user._id);
      if (response && response.likesCount !== undefined) {
        setLikesCount(response.likesCount);
        setHasVoted(true);
        console.log(`Vote successful for user: ${user._id}`);
      } else {
        console.error("Invalid response structure:", response);
      }
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  return (
    <div className="ProfileCard" onClick={handleProfileClick}>
      <div className="ProfileCard-ImageContainer">
        <img
          src={user?.userProfileImage || placeholderImage}
          alt={`${user?.firstName || "Unknown"} ${
            user?.lastName || "User"
          }'s profile`}
          className="ProfileCard-Image"
        />
      </div>
      <div className="ProfileCard-Details">
        <h4 className="ProfileCard-Name">
          {user?.firstName || "Unknown"} {user?.lastName || "User"}
        </h4>
        <p className="ProfileCard-Info">Sex: {user?.sex || "N/A"}</p>
      </div>
      {isModalOpen && (
        <ProfileDetailsModal
          user={{ ...user, likesCount }}
          onClose={() => setIsModalOpen(false)}
          onLikeCount={handleVote}
          onGrantAdmin={handleGrantAdmin}
          hasVoted={hasVoted}
        />
      )}
    </div>
  );
};

export default React.memo(Profile);
