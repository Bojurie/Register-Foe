import React from "react";
import Dashboard from "../Dashboard/Dashboard";
import { AuthProvider } from "../AuthContext/AuthContext";


// ...
  
const Main = () => {

  const user = // fetch or set the user data
  const currentTime = // set the current time
  const currentLocation = // set the current location

  return (
    <div className="Main">
      <AuthProvider>
        <Dashboard user={user} currentTime={currentTime} currentLocation={currentLocation}  />
      </AuthProvider>
      {/* <ElectionList /> */}
    </div>
  );
};

export default Main;