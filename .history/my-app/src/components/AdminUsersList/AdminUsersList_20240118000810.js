import React from "react";
import AdminProfile from "./AdminProfile";

const AdminUsersList = ({ admins }) => {
  // Check if admins is an array before mapping
  if (!Array.isArray(admins)) {
    console.error("AdminUsersList: admins is not an array", admins);
    return null; // or handle it in another way based on your requirements
  }

  return (
    <div>
      {admins.map((admin) => (
        <AdminProfile key={admin._id} admin={admin} />
      ))}
    </div>
  );
};

export default AdminUsersList;
