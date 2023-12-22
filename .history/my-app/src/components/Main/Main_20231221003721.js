import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../Dashboard/Dashboard";
import { AuthContext } from "../AuthContext/AuthContext.jsx";

const Main = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="Main">
      {user ? (
        <Routes>
          <Route path="/main/*" element={<Dashboard user={user} />} />
        </Routes>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Main;
