import React, { useContext, useEffect, useState } from "react";
import Dashboard from "../Dashboard/Dashboard";
import { AuthContext } from "../AuthContext/AuthContext.jsx";

const Main = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="Main">
      {user ? <Dashboard user={user} /> : <p>Loading...</p>}
    </div>
  );
};

export default Main;
