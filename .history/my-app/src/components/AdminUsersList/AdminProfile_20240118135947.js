import React from 'react'
import Profile from "../Profile/Profile";
import './AdminUsersList.css'
const AdminProfile = ({ admin }) => {
  return (
    <motion.div
      className="AdminProfile"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h2>Admin Users</h2>
      <motion.div
        className="AdminProfile-Wrapper"
        style={{ maxHeight: "300px", overflowY: "auto" }}
      >
        <Profile user={admin} />
      </motion.div>
    </motion.div>
  );
};

export default AdminProfile;