import React from "react";

const Profile = ({ user }) => {
  return (
    <div>
    <div className="Profile">
        <div className="Profile-Image">
          <img src={user.userProfileImage} />
        </div>
        <div className="Profile-Content">
          <h4>
          {user.firstName} {user.lastName}
          </h4>
          <p>{user.email}</p>
        </div>
    </div>
      
  
      {/* Add more user details here */}
    </div>
  );
};

export default Profile;
