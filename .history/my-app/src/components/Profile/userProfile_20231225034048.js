import React, { useState, useEffect } from "react";
import axios from "axios";
import Profile from "./Profile"; // Import the Profile component
import { GetUsersByCode } from "../AuthAPI/AuthAPI";

function UserProfile() {
  
 const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const source = axios.CancelToken.source();

    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await GetUsersByCode(); // Correctly call GetUsersByCode
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();

    return () => {
      source.cancel("Component unmounted, cancel axios request");
    };
  }, []); // Add dependencies if necessary, e.g., company code

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Render your component with the fetched data
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