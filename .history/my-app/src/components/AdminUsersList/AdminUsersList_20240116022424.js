import React from "react";
import AdminProfile from "./AdminProfile";

const AdminUsersList = ({ admins }) => {
  return (
    <div>
      {admins.map((admin) => (
        <AdminProfile key={admin._id} admin={admin} />
      ))}
    </div>
  );
};

export default AdminUsersList;