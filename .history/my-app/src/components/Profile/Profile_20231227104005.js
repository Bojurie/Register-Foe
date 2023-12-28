import React from "react";
import './Profile.css'
const Profile = ({ user }) => {
  return (
    <div>
    <div className="Profile">
        <div className="Profile-Image">
          <img src={user.userProfileImage} alt="Profile Image"/>
        </div>
        <div className="Profile-Content">
          <h4>
          {user.firstName} {user.lastName}
          </h4>
          <p>{user.email}</p>
        </div>
    </div>

    </div>
  );
};

export default Profile;
