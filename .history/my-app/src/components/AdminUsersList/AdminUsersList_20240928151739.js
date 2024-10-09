import React, { useState } from "react";
import AdminProfile from "./AdminProfile";
import "./AdminUsersList.css";
import { motion } from "framer-motion";

const AdminUsersList = ({ admins }) => {
  const [isCollapsed, setIsCollapsed] = useState(true); // Initially collapsed for a cleaner UI

  // Ensure adminsArray is always an array
  const adminsArray = Array.isArray(admins?.data) ? admins.data : [];

  if (admins && !Array.isArray(adminsArray)) {
    console.error("AdminUsersList: adminsArray is not an array", adminsArray);
    return null;
  }

  const toggleCollapse = () => setIsCollapsed((prevState) => !prevState);

  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div className="Admin-User-List" initial="hidden" animate="visible">
      <h1 onClick={toggleCollapse} style={{ cursor: "pointer" }}>
        Admins
      </h1>
      <motion.div
        className={`Admin-User-List-Container ${
          isCollapsed ? "collapsed" : ""
        }`}
        variants={listVariants}
        initial="hidden"
        animate={isCollapsed ? "hidden" : "visible"}
      >
        {!isCollapsed &&
          adminsArray.length > 0 &&
          adminsArray.map((admin) => (
            <motion.div
              key={admin._id}
              variants={itemVariants}
              transition={{ duration: 0.5 }}
            >
              <AdminProfile admin={admin} />
            </motion.div>
          ))}
        {!isCollapsed && adminsArray.length === 0 && (
          <p>No admins available.</p>
        )}
      </motion.div>
    </motion.div>
  );
};

export default AdminUsersList;
