import React, { useState, useEffect } from "react";
import Profile from "./Profile"; // Import the Profile component

function UserProfile() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("user/users/byCompanyCode"); 
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

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
