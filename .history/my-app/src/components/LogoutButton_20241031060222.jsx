import React from "react";
import { useAuth } from "./AuthContext/AuthContext";

const LogoutButton = () => {
  const { handleLogout } = useAuth();

  return <button onClick={handleLogout} className="button">Logout</button>;
};

export default LogoutButton;
