import React, {useState, useContext, useEffect } from "react";
import Dashboard from "../Dashboard/Dashboard";
import { AuthContext } from "../AuthContext/AuthContext.jsx";

const Main = () => {
  const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);

  useEffect(() => {
     if (user !== null) {
      setLoading(false);
     }
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
