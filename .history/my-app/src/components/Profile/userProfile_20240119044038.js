import React from "react";
import { motion } from "framer-motion";
import Profile from "./Profile";
import "./userProfile.css";

const UserProfile = ({ users, election, candidates }) => {
  if (!candidates || candidates.length === 0) {
    return <div>No candidates available for this election.</div>;
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
      <h2>Candidates</h2>
      <div className="Profile-Wrapper">
        {candidates.map((userId) => (
          <motion.div
            key={userId}
            variants={itemVariants}
            className="UserProfile-Wrapper"
            style={{ overflowY: "auto" }}
          >
            <Profile user={userId} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default UserProfile;