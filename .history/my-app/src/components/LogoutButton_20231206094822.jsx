import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import { useHistory } from "react-router-dom";

const LogoutButton = () => {
  const { logout } = useAuth();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogout = async () => {
    setLoading(true);
    setError(null);

    try {
      await logout();
      redirectToHome();
    } catch (error) {
      setError("An error occurred during logout.");
    } finally {
      setLoading(false);
    }
  };

  const redirectToHome = () => {
    history.push("/");
  };

  return (
    <button onClick={handleLogout} disabled={loading}>
      {loading ? "Logging out..." : "Logout"}
    </button>
  );
};

export default LogoutButton;
