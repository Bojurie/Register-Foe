import React from "react";
import { useAuth } from "./AuthContext";

const SomeComponent = () => {
  const { user, login, logout } = useAuth();

  const handleLogin = () => {
    // Call your authentication logic (e.g., API request) and then update the context
    login({ username: "exampleUser" });
  };

  const handleLogout = () => {
    // Call your logout logic (e.g., API request) and then update the context
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

export default SomeComponent;
