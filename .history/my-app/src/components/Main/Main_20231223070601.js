import React, { useContext, useEffect } from "react";
import Dashboard from "../Dashboard/Dashboard";
import { AuthContext } from "../AuthContext/AuthContext.jsx";
import CompanyDashboard from "../CompanyDashboard/CompanyDashboard.js";
import { motion } from "framer-motion";

const Main = () => {
  const { user } = useContext(AuthContext);

  // This useEffect will re-run if user changes
  useEffect(() => {
    // You can add logic here if needed when user changes
  }, [user]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="Main"
    >
      {user ? (
        user.isCompany ? (
          <CompanyDashboard company={user} />
        ) : (
          <Dashboard user={user} />
        )
      ) : (
        <p>Loading...</p> // Consider adding a timeout or a redirect if the user is null for too long
      )}
    </motion.div>
  );
};

export default Main;