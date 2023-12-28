import React, { useState, useEffect } from "react";
import axios from "axios";
import Profile from "./Profile"; // Import the Profile component

function UserProfile() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/user/users/byCompanyCode");
        setUsers(response.data); // Axios automatically parses the JSON
      } catch (error) {
        console.error("Error fetching users:", error);
        // Handle error based on response status if needed
        // e.g., if (error.response && error.response.status === 404) { ... }
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
