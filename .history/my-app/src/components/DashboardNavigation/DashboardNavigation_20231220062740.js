import React from "react";
import { Link } from "react-router-dom";

const DashboardNavigation = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/dashboard/saved-elections">Saved Elections</Link>
        </li>
        <li>
          <Link to="/dashboard/past-elections">Past Elections</Link>
        </li>
      </ul>
    </nav>
  );
};

export default DashboardNavigation;
