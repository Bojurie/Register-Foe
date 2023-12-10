import React, { useState } from "react";
import './Dashboard.css'

const Dashboard = ({ user, onLogout }) => {
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newUsername, setNewUsername] = useState("");

  const handleUpdate = () => {
    // Implement update logic, e.g., send a request to the server to update user information
    console.log("Update successful");
  };

  const handleLogout = () => {
    // Clear the user state when logging out
    setUser(null);
  };
  return (
    <div className="Dashboard">
      <div className="Dashboard-Wrapper">
        <div className="Top_dash">
          <h2>Welcome, !</h2>
          <div
            className="Logout"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>
        <hr />
        <h3>Update Account Information</h3>
        <label>New Email:</label>
        <input
          type="text"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
        />
        <label>New Password:</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <label>New Username:</label>
        <input
          type="text"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
        />
        <button onClick={handleUpdate}>Update</button>
      </div>
    </div>
  );
};

export default Dashboard;
