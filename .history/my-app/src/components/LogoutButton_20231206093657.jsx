import React from "react";
import { useAuth } from "./AuthContext/AuthContext";
import { useHistory } from "react-router-dom";

const LogoutButton = () => {
  const { logout } = useAuth();
  const history = useHistory();

  const handleLogout = async () => {
    await logout();
    history.push("/"); 
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
