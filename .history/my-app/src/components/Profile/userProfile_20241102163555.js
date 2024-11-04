import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Profile from "./Profile";
import "./userProfile.css";
import {UserProfileWrapper} from '../StyledComponents'

const UserProfile = ({ users }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

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
    <UserProfileWrapper className="UserProfile">
      <h2
        onClick={toggleCollapse}
        className="UserProfile-Header"
        aria-expanded={!isCollapsed}
      >
        Employees {isCollapsed ? "(Show)" : "(Hide)"}
      </h2>

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
                className="ProfileItem"
              >
                <Profile user={user} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </UserProfileWrapper>
  );
};

export default UserProfile;
