import React from "react";
import { Link, useLocation } from "react-router-dom";

const DashboardNavigation = ({ user }) => {
  const location = useLocation();

  // Check if the user is logged in and on the main dashboard
  const isMainDashboard =
    user && location.pathname === "/dashboard" && location.state === null;

  return (
    <nav>
      <ul>
        <li>
          <Link to="/dashboard">Home</Link>
        </li>
        {user && isMainDashboard && (
          <>
            <li>
              <Link to="/dashboard/saved-elections">Saved Elections</Link>
            </li>
            <li>
              <Link to="/dashboard/past-elections">Past Elections</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default DashboardNavigation;
