import React, { useState, useEffect , useContext} from "react";
import Profile from "./Profile";
import { GetUsersByCode, likeUser, voteForUser } from "../AuthAPI/AuthAPI"; 
import {
  AuthContext,
  fetchUserByCompanyCode,
} from "../AuthContext/AuthContext";

import { useSnackbar } from "notistack";

function UserProfile() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, useAuth } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  
  const { fetchUserByCompanyCode } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      if (user && user.isCompany && user.companyCode) {
        try {
          setIsLoading(true);
          const fetchedUsers = await fetchUserByCompanyCode(user.companyCode);
          setUsers(fetchedUsers);
        } catch (error) {
          console.error("Error fetching users:", error);
          enqueueSnackbar("Failed to load user profiles", { variant: "error" });
        } finally {
          setIsLoading(false);
        }
      } else {
        console.error(
          "User object is missing or does not have a company code."
        );
        enqueueSnackbar("Cannot load user profiles", { variant: "error" });
      }
    };

    fetchUsers();
  }, [user, enqueueSnackbar]);

  const onViewProfile = (user) => {
    // Implement view profile logic here
  };

  const onLikeProfile = async (likedUser) => {
    try {
      await likeUser(likedUser._id);
      // Update user's like count in the state
      // Example: setUsers(updatedUsers);
      enqueueSnackbar("Profile liked successfully", { variant: "success" });
    } catch (error) {
      console.error("Error liking profile:", error);
      enqueueSnackbar("Failed to like profile", { variant: "error" });
    }
  };

  const onVoteProfile = async (votedUser) => {
    try {
      await voteForUser(votedUser._id);
      // Update user's vote count in the state
      // Example: setUsers(updatedUsers);
      enqueueSnackbar("Voted successfully", { variant: "success" });
    } catch (error) {
      console.error("Error voting for profile:", error);
      enqueueSnackbar("Failed to vote", { variant: "error" });
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
          <Profile
            key={user._id}
            user={user}
            onViewProfile={() => onViewProfile(user)}
            onLikeProfile={() => onLikeProfile(user)}
            onVoteProfile={() => onVoteProfile(user)}
          />
        ))}
      </div>
    </div>
  );
}

export default UserProfile;