import React, { useState } from "react";
import Profile from "./Profile";
import ProfileDetailsModal from "./ProfileDetailsModal";
import { likeUser, voteForUser } from "../AuthAPI/AuthAPI";
import { useSnackbar } from "notistack";
import axios from "axios";
import "./userProfile.css";

function UserProfile({ users }) {
  if (!Array.isArray(users) || users.length === 0) {
    return <div>No topics available.</div>;
  }
  // const profileImageUrl = user.userProfileImage || placeholderImage;

  return (
    <div className="Profile-Wrapper">
      {users.map((user) => (
        <Profile key={user._id} topic={user} />
      ))}
    </div>
  );
}

export default UserProfile;
