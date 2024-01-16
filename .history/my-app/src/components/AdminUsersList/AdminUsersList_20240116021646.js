import React from "react";
import AdminProfile from "./AdminProfile";

const AdminUsersList = ({ admins }) => {
  return (
    <div>
           <AdminProfile admins={admins}/>
    </div>
  );
};

export default AdminUsersList;
