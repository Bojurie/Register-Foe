import React from "react";

const AdminUsersList = ({ admins }) => {
  return (
    <div>
      <h3>Admin Users</h3>
      {admins.map((admin) => (
        <div key={admin.id}>
          <p>
            {admin.firstName} {admin.lastName}
          </p>
          {/* Additional details */}
        </div>
      ))}
    </div>
  );
};

export default AdminUsersList;
