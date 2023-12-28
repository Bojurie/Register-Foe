import React, { useContext, useEffect } from "react";
import Dashboard from "../Dashboard/Dashboard";
import { AuthContext } from "../AuthContext/AuthContext.jsx";
import AdminDashboard from "../AdminDashboard/AdminDashboard.js";
import { motion } from "framer-motion";


 const Main = () => {
  const { user } = useContext(AuthContext);
  useEffect(() => {
      // Perform any necessary re-validation of user here, if needed
    }, []);
  return (
    <div className="Main">
      {user ? (
        user.isAdmin ? (
          <AdminDashboard user={user} />
        ) : (
          <Dashboard user={user} />
        )
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Main;