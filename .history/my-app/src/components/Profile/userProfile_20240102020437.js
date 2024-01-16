import React, { useState, useEffect } from "react";
import Profile from "./Profile";
import ProfileDetailsModal from "./ProfileDetailsModal";
import { likeUser, voteForUser } from "../AuthAPI/AuthAPI";
import { useAuth } from "../AuthContext/AuthContext";
import { useSnackbar } from "notistack";
import axios from "axios";
import './userProfile.css'


function UserProfile() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, fetchUserByCompanyCode } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
    const [selectedUser, setSelectedUser] = useState(null); // User to display in modal
    const [isModalOpen, setIsModalOpen] = useState(false);
 

  useEffect(() => {
    const fetchUsers = async () => {
      if (user && user.isCompany && user.companyCode) {
        try {
          const response = await fetchUserByCompanyCode(user.companyCode);
          if (response && response.length > 0) {
            setUsers(response);
            setIsLoading(false);
          } else {
            console.error("Failed to fetch users");
            setIsLoading(false);
          }
        } catch (error) {
          console.error("Error fetching users:", error);
          setIsLoading(false);
        }
      } else {
        console.error(
          "User object is missing or does not have a company code."
        );
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [user, fetchUserByCompanyCode]);

  const updateUsers = (userId, actionType) => {
    setUsers(
      users.map((u) => {
        if (u._id === userId) {
          return actionType === "like"
            ? { ...u, likes: (u.likes || 0) + 1 }
            : { ...u, votes: (u.votes || 0) + 1 };
        }
        return u;
      })
    );
  };

  const onViewProfile = (selectedUser) => {
    setSelectedUser(selectedUser);
    setIsModalOpen(true);
  };

  const onLikeProfile = async (likedUser) => {
    try {
      await likeUser(likedUser._id);
      updateUsers(likedUser._id, "like");
      enqueueSnackbar("Profile liked successfully", { variant: "success" });
    } catch (error) {
      console.error("Error liking profile:", error);
      enqueueSnackbar("Failed to like profile", { variant: "error" });
    }
  };

  const onVoteProfile = async (votedUser) => {
    try {
      await voteForUser(votedUser._id);
      updateUsers(votedUser._id, "vote");
      enqueueSnackbar("Voted successfully", { variant: "success" });
    } catch (error) {
      console.error("Error voting for profile:", error);
      enqueueSnackbar("Failed to vote", { variant: "error" });
    }
  };

  const handleGrantAdmin = async (user) => {
    try {
      const userId = user._id;
      const response = await axios.patch(
        `http://localhost:3001/user/updateAdminStatus/${userId}`,
        {
          isAdmin: true,
        }
      );
      const updatedUser = response.data;
      console.log(
        `Admin rights granted to ${updatedUser.firstName} ${updatedUser.lastName}`
      );

      // Update the user state or context here to reflect the change on the client side
      // This depends on how you're managing state in your application
      // For example: setUsers((prevUsers) => prevUsers.map((u) => u._id === userId ? updatedUser : u));
    } catch (error) {
      console.error("Error updating user admin status:", error);
      // Handle error (e.g., showing a notification to the user)
    }
  };

  if (isLoading) {
    return <div>Loading user profiles...</div>;
  }


  return (
    <div>
      <h2>User Profiles</h2>
      <div className="Profile-Wrapper">
        {users.map((user) => (
          <Profile key={user._id} user={user} onViewProfile={onViewProfile} />
        ))}
      </div>
      {isModalOpen && (
        <ProfileDetailsModal
          user={selectedUser}
           onClose={() => setIsModalOpen(false)}
            onLikeProfile={onLikeProfile}
            onVoteProfile={onVoteProfile}
            onGrantAdmin={handleGrantAdmin}
        />
      )}
    </div>
  );
}

export default UserProfile;