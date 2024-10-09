import React, { useState } from "react";
import AdminProfile from "./AdminProfile";
import "./AdminUsersList.css";
import { motion, AnimatePresence } from "framer-motion";

const AdminUsersList = ({ admins }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const adminsArray = Array.isArray(admins) ? admins : [];

  const toggleCollapse = () => setIsCollapsed((prevState) => !prevState);

  const listVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
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
    <motion.div className="Admin-User-List">
      <h1 onClick={toggleCollapse} style={{ cursor: "pointer" }}>
        Admins {isCollapsed ? "(Show)" : "(Hide)"}
      </h1>
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            className="Admin-User-List-Container"
            variants={listVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {adminsArray.length > 0 ? (
              adminsArray.map((admin) => (
                <motion.div
                  key={admin._id}
                  variants={itemVariants}
                  transition={{ duration: 0.5 }}
                >
                  <AdminProfile admin={admin} />
                </motion.div>
              ))
            ) : (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                No admins available.
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminUsersList;
