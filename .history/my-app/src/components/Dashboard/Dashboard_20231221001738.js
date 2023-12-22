import React from "react";
import { Route, Routes, Link } from "react-router-dom";
import { motion } from "framer-motion";
import WeatherWidget from "../WeatherWidget/WeatherWidget";
import SearchBar from "../SearchBar/SearchBar";
import LogoutButton from "../LogoutButton";
import ElectionList from "../ElectionList /ElectionList";
import SavedElections from "../SavedElections/SavedElections"; // Import SavedElections component
import PastElectionList from "../PastElectionList/PastElectionList"; // Import PastElectionList component

import DashboardNavigation from "../DashboardNavigation/DashboardNavigation";

import "./Dashboard.css";

const Dashboard = ({ user }) => {
  return (
    <motion.div
      className="Dashboard"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      <div>
        <nav className="Nav">
          <ul className="Nav-Links">
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
      </div>
      <h1>Welcome, {user ? `${user.firstName} ${user.lastName}` : "Guest"}!</h1>
      <WeatherWidget user={user} />
      <SearchBar />

      <Routes>
        <Route path="/*" element={<ElectionList />} />
        {user && (
          <>
            <Route path="/saved-elections" element={<SavedElections />} />
            <Route path="/past-elections" element={<PastElectionList />} />
          </>
        )}
      </Routes>

      <LogoutButton />
    </motion.div>
  );
};

export default Dashboard;
