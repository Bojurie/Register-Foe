import React from "react";
import { motion } from "framer-motion";
import Profile from "./Profile";
import "./userProfile.css";

function UserProfile({ users }) {
  if (!users || users.length === 0) {
    return <div>No user profiles available.</div>;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { x: -10, opacity: 0 },
    visible: { x: 0, opacity: 1 },
  };

  return (
    <motion.div
      className="Profile-Wrapper"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ overflowY: "auto" }}
    >
      <h2>User Profiles</h2>
      {users.map((user) => (
        <motion.div key={user._id} variants={itemVariants}>
          <Profile user={user} />
        </motion.div>
      ))}
    </motion.div>
  );
}

export default UserProfile;