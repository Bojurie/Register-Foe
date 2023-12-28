import React, { useState, useEffect } from "react";
import Profile from "./Profile";
import { GetUsersByCode } from "../AuthAPI/AuthAPI";


function UserProfile() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await GetUsersByCode();
        setUsers(response);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const onViewProfile = (user) => {
    // Handle view profile action
    console.log("Viewing profile of", user.firstName, user.lastName);
    // Implement navigation or modal display logic here
  };

  const onLikeProfile = (user) => {
    // Handle like profile action
    console.log("Liking profile of", user.firstName, user.lastName);
    // Implement like logic here
  };

  const onVoteProfile = (user) => {
    // Handle vote profile action
    console.log("Voting for", user.firstName, user.lastName);
    // Implement vote logic here
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