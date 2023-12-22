import React, {useState, useContext, useEffect } from "react";
import Dashboard from "../Dashboard/Dashboard";
import { AuthContext } from "../AuthContext/AuthContext.jsx";

const Main = () => {
  const { user } = useContext(AuthContext);

  useEffect(() => {
     if (user !== null) {
      setLoading(false);
     }
  }, [user]);
  return user ? (
    <div className="Main">
      <Dashboard user={user} />
    </div>
  ) 
};

export default Main;
