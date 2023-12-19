import React, { useContext, useEffect } from "react";
import Dashboard from "../Dashboard/Dashboard";
import { AuthContext } from "../AuthContext/AuthContext";

const Main = () => {
  const { user } = useContext(AuthContext);
  useEffect(() => {
    // Handle any additional actions when the user context changes
    // You can place any logic here that you want to execute when the user context changes.
  }, [user]);
  return user ? (
    <div className="Main">
      <Dashboard user={user} />
    </div>
  ) : (
    <p>Please login to view this page.</p>
  );
};

export default Main;
