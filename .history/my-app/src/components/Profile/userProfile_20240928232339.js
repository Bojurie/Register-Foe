import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Profile from "./Profile";
import "./userProfile.css";

const UserProfile = ({ users }) => {
  // Initially set to false to show the profiles when the component mounts
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => setIsCollapsed((prev) => !prev);

  if (!users || users.length === 0) {
    return <p>No user profiles available.</p>;
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const containerVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  };

  return (
    <motion.div className="UserProfile">
      <h1
        onClick={toggleCollapse}
        style={{ cursor: "pointer" }}
        aria-expanded={!isCollapsed}
      >
        Employees {isCollapsed ? "(Show)" : "(Hide)"}
      </h1>

      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            className="ProfilesContainer"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {users.map((user) => (
              <motion.div
                key={user._id}
                variants={itemVariants}
                transition={{ duration: 0.5 }}
              >
                <Profile user={user} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default UserProfile;
