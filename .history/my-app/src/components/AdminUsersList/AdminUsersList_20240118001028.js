import React from "react";
import AdminProfile from "./AdminProfile";

const AdminUsersList = ({ admins }) => {
  const adminsArray = admins?.data || [];

  if (!Array.isArray(adminsArray)) {
    console.error("AdminUsersList: adminsArray is not an array", adminsArray);
    return null; 
  }

  return (
    <div>
      {adminsArray.map((admin) => (
        <AdminProfile key={admin._id} admin={admin} />
      ))}
    </div>
  );
};

export default AdminUsersList;
