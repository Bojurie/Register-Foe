import React from "react";
import Profile from "./Profile";
import "./userProfile.css";

function UserProfile({ users }) {
  if (!users || users.length === 0) {
    return <div>No user profiles available.</div>;
  }

  return (
    <div className="Profile-Wrapper">
      {users.map((user) => (
        <Profile key={user._id} user={user} />
      ))}
    </div>
  );
}

export default UserProfile;

