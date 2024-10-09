import React from "react";
import Profile from "../Profile/Profile";
import "./AdminProfile.css";
import { motion } from "framer-motion";

const AdminProfile = ({ admin }) => {
  return (
    <motion.div className="AdminProfile">
      <Profile user={admin} />
    </motion.div>
  );
};

export default AdminProfile;
