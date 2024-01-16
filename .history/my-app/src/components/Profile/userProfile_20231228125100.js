import React, { useState, useEffect } from "react";
import Profile from "./Profile";
import { GetUsersByCode, likeUser, voteForUser } from "../AuthAPI/AuthAPI"; 

function UserProfile() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
   const { user } = useContext(AuthContext);
   
useEffect(() => {
  const fetchUsers = async () => {
    if (user && user.isCompany && user.companyCode) {
      try {
        const fetchedUsers = await GetUsersByCode(user.companyCode);
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    } else {
      console.error("User object is missing or does not have a company code.");
    }
  };

  fetchUsers();
}, [user]);

  const onViewProfile = (user) => {
    // Implement view profile logic here (e.g., navigate to a detailed profile page)
  };

  const onLikeProfile = async (user) => {
    try {
      await likeUser(user._id); // Assuming likeUser is an API call function
      // Update state to reflect the new like count
    } catch (error) {
      console.error("Error liking profile:", error);
      // Handle errors (e.g., show error message)
    }
  };

  const onVoteProfile = async (user) => {
    try {
      await voteForUser(user._id); // Assuming voteForUser is an API call function
      // Update state to reflect the new vote count
    } catch (error) {
      console.error("Error voting for profile:", error);
      // Handle errors (e.g., show error message)
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>User Profiles</h2>
      <div className="Profile-Wrapper">
        {users.map((user) => (
          <Profile
            key={user._id}
            user={user}
            onViewProfile={onViewProfile}
            onLikeProfile={onLikeProfile}
            onVoteProfile={onVoteProfile}
          />
        ))}
      </div>
    </div>
  );
}

export default UserProfile;
