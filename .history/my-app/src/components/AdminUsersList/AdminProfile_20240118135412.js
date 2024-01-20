import React from 'react'
import Profile from "../Profile/Profile";

function AdminProfile({ admin }) {
  return (
    <div>
    <h2>Admin Users</h2>
    <div>
        <Profile user={admin} />
    </div>
    
    </div>
  );
}

export default AdminProfile;