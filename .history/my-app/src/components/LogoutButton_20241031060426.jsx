import React from "react";
import { useAuth } from "./AuthContext/AuthContext";
import { Button } from "./StyledComponents";

const LogoutButton = () => {
  const { handleLogout } = useAuth();

  return <Button onClick={handleLogout} className="button">Logout</Button>;
};

export default LogoutButton;
