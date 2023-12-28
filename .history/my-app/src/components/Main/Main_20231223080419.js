import React, { useContext, useEffect } from "react";
import Dashboard from "../Dashboard/Dashboard";
import { AuthContext } from "../AuthContext/AuthContext.jsx";
import CompanyDashboard from "../CompanyDashboard/CompanyDashboard.js";
import { motion } from "framer-motion";

const Main = () => {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    console.log("Current User:", user); // Add this line for debugging
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
        <p>Loading...</p> // Consider handling this state, maybe a redirect to login?
      )}
    </motion.div>
  );
};

export default Main;
