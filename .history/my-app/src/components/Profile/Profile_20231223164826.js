import React from "react";

const Profile = ({ user }) => {
  return (
    <div>
      <h3>
        {user.firstName} {user.lastName}
      </h3>
      <p>Email: {user.email}</p>
      {/* Add more user details here */}
    </div>
  );
};

export default Profile;
