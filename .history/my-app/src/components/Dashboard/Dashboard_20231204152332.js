import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import "./Dashboard.css"; // Import your CSS file

const Dashboard = () => {
  // ... (same as previous code)

  return (
    <motion.div
      className="dashboard-container"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1>Welcome to Your Dashboard</h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Current Time: {currentTime}
      </motion.p>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        Current Location: {currentLocation}
      </motion.p>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        Weather: {weather}
      </motion.p>

      <motion.div
        className="search-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <label htmlFor="userInput">Enter State, City, or Zip Code:</label>
        <input
          type="text"
          id="userInput"
          value={userInput}
          onChange={handleInputChange}
        />
        <motion.button
          onClick={handleFilter}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Search
        </motion.button>
      </motion.div>

      <motion.ul
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        {filteredElections.length > 0 ? (
          filteredElections.map((election) => (
            <motion.li key={election.id} whileHover={{ scale: 1.05 }}>
              <strong>State:</strong> {election.state}, <strong>Date:</strong>{" "}
              {election.date}, <strong>Type:</strong> {election.type},{" "}
              <strong>Candidate:</strong> {election.candidate}
            </motion.li>
          ))
        ) : (
          <p>No elections found.</p>
        )}
      </motion.ul>
    </motion.div>
  );
};

export default Dashboard;
