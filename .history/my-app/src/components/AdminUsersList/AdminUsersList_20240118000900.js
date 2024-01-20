import React from "react";
import AdminProfile from "./AdminProfile";

const AdminUsersList = ({ admins }) => {
  // Extract the 'data' property from the admins object
  const adminsArray = admins?.data || [];

  // Check if adminsArray is an array before mapping
  if (!Array.isArray(adminsArray)) {
    console.error("AdminUsersList: adminsArray is not an array", adminsArray);
    return null; // or handle it in another way based on your requirements
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
