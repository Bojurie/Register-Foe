import React from "react";
import { useAuth } from "../AuthContext/AuthContext";

const AuthContext = () => {
  const { user, login, logout } = useAuth();

  const handleLogin = () => {
    login({ username: "exampleUser" });
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div>
      {user ? (
        <>
          <p>Welcome, {user.username}!</p>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
};

export default AuthContext;
