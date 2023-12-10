import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
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
    navigate("/");
  };

  return (
    <button onClick={handleLogout} disabled={loading}>
      {loading ? "Logging out..." : "Logout"}
    </button>
  );
};

export default LogoutButton;
