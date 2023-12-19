import React from "react";
import Dashboard from "../Dashboard/Dashboard";
import { useAuth } from "../AuthContext/AuthContext";

const Main = () => {
  const { user } = useAuth();

  return  (
    <div className="Main">
      <Dashboard user={user} />
    </div>
  ) 
};

export default Main;
