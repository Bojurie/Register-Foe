import React, { useEffect } from "react";
import CompanyDashboard from "../CompanyDashboard/CompanyDashboard";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext/AuthContext";

const Main = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  return user ? <CompanyDashboard user={user} /> : null;
};

export default Main;
