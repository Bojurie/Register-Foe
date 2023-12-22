import React from "react";
import { Link } from "react-router-dom";

const DashboardNavigation = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/main/saved-elections">Saved Elections</Link>
        </li>
        <li>
          <Link to="/main/past-elections">Past Elections</Link>
        </li>
      </ul>
    </nav>
  );
};

export default DashboardNavigation;
