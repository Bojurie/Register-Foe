import React, { useContext, useEffect, useState } from "react";
import Dashboard from "../Dashboard/Dashboard";
import { AuthContext } from "../AuthContext/AuthContext.jsx";

const Main = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true); // Initialize loading state as true

  useEffect(() => {
    // Check if the user is not null before setting loading to false
    if (user !== null) {
      setLoading(false);
    }
  }, [user]);

  return (
    <div className="Main">
      {loading ? <p>Loading...</p> : <Dashboard user={user} />}
    </div>
  );
};

export default Main;
