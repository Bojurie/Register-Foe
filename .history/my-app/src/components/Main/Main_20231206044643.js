import React from "react";
import Dashboard from "../Dashboard/Dashboard";
import { AuthProvider } from "../AuthContext/AuthContext";


const Main = () => {
  return (
    <div className="Main">
      <AuthProvider>
        <Dashboard />
      </AuthProvider>
      {/* <ElectionList /> */}
    </div>
  );
};

export default Main;