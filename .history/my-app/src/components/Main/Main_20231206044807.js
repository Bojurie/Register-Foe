import React from "react";
import Dashboard from "../Dashboard/Dashboard";
import { AuthProvider } from "../PrivateRoute/PrivateRoute";


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