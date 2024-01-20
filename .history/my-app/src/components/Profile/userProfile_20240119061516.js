import React from "react";
import { motion } from "framer-motion";
import Profile from "./Profile";
import "./userProfile.css";

const UserProfile = ({ users}) => {
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
      className="UserProfile"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h2>Candidate </h2>
      <div className="Profile-Wrapper">
        {users.map((user) => (
          <motion.div
            key={user._id}
            variants={itemVariants}
            className="UserProfile-Wrapper"
            style={{ overflowY: "auto" }}
          >
            <Profile key={user?._id} user={user} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default UserProfile;
