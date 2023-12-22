import React from "react";
import { Route, Switch, Link } from "react-router-dom";
import { motion } from "framer-motion";
import WeatherWidget from "../WeatherWidget/WeatherWidget";
import ElectionsWidget from "../ElectionsWidget/ElectionsWidget";
import SearchBar from "../SearchBar/SearchBar";
import LogoutButton from "../LogoutButton";
import ElectionList from "../ElectionList /ElectionList";
import SavedElections from "../SavedElections/SavedElections"; // Import SavedElections component
import PastElections from "../PastElections/PastElections"; // Import PastElections component

import "./Dashboard.css";

const Dashboard = ({ user }) => {
  return (
    <motion.div
      className="Dashboard"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      <h1>Welcome, {user ? `${user.firstName} ${user.lastName}` : "Guest"}!</h1>
      <WeatherWidget user={user} />
      <SearchBar />

      {/* Navigation Links */}
      <nav>
        <ul>
          <li>
            <Link to="/dashboard">Home</Link>
          </li>
          {user && (
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

      {/* Routes */}
      <Switch>
        <Route exact path="/dashboard" component={ElectionList} />
        {user && (
          <>
            <Route
              path="/dashboard/saved-elections"
              component={SavedElections}
            />
            <Route path="/dashboard/past-elections" component={PastElections} />
          </>
        )}
      </Switch>

      <LogoutButton />
    </motion.div>
  );
};

export default Dashboard;
