import React from "react";
import Dashboard from "../Dashboard/Dashboard";
import { AuthContext } from "../AuthContext/AuthContext";

const Main = () => {
  const { user } = useContext(AuthContext);

  return user ? (
    <div className="Main">
      <Dashboard user={user} />
    </div>
  ) : (
    <p>Please login to view this page.</p>
  );
};

export default Main;
