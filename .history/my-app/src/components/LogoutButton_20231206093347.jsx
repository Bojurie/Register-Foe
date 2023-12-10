import React from "react";
import { useAuth } from "./Context/UserContext";
import { useHistory } from "react-router-dom";

const LogoutButton = () => {
  const { logout } = useAuth();
  const history = useHistory();

  const handleLogout = async () => {
    await logout();
    history.push("/"); // Redirect to the home page
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
