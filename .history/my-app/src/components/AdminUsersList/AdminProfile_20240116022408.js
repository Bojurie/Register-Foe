import React from 'react'
import Profile from "../Profile/Profile";

function AdminProfile({ admin }) {
  return (
    <div>
      <Profile user={admin} />
    </div>
  );
}

export default AdminProfile;