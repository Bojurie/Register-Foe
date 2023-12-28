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
        // Assuming response is directly the array of users
        setUsers(response);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>User Profiles</h2>
      {users.map((user) => (
        <Profile key={user._id} user={user} />
      ))}
    </div>
  );
}

export default UserProfile;
