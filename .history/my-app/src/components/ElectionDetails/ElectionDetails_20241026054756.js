import React, { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy, faVoteYea } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import "./ElectionDetails.css";
import Profile from "../Profile/Profile"; // Ensure Profile component for candidate info display

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const ElectionDetails = ({
  election,
  handleVote,
  voteStatus,
  handleDeleteElection,
}) => {
  const [currentLeader, setCurrentLeader] = useState(null);
  const [isElectionEnded, setIsElectionEnded] = useState(false);
  const [totalVotes, setTotalVotes] = useState(0);

  useEffect(() => {
    const now = new Date();
    setIsElectionEnded(now > new Date(election.endDate));

    const total = election.candidates.reduce(
      (sum, candidate) => sum + candidate.votes,
      0
    );
    setTotalVotes(total);

    if (election.candidates.length > 0) {
      const leader = election.candidates.reduce((max, candidate) =>
        candidate.votes > max.votes ? candidate : max
      );
      setCurrentLeader(leader);
    }
  }, [election]);

  const calculatePercentage = (votes) => {
    return totalVotes === 0 ? 0 : ((votes / totalVotes) * 100).toFixed(2);
  };

  const barData = {
    labels: election.candidates.map(
      (candidate) => `${candidate.user.firstName} ${candidate.user.lastName}`
    ),
    datasets: [
      {
        label: "Votes",
        data: election.candidates.map((candidate) => candidate.votes),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const pieData = {
    labels: election.candidates.map(
      (candidate) => `${candidate.user.firstName} ${candidate.user.lastName}`
    ),
    datasets: [
      {
        label: "Vote Share",
        data: election.candidates.map((candidate) =>
          calculatePercentage(candidate.votes)
        ),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div className="ElectionDetails">
      <h1>{election.title}</h1>
      <div className="election-info">
        <p>
          <span>Type:</span> {election.electionType}
        </p>
        <p>
          <span>Start Date:</span>{" "}
          {new Date(election.startDate).toLocaleDateString()}
        </p>
        <p>
          <span>End Date:</span>{" "}
          {new Date(election.endDate).toLocaleDateString()}
        </p>
        <p>
          <span>City:</span> {election.city}
        </p>
        <p>
          <span>State:</span> {election.state}
        </p>
        <p>
          <span>About:</span> {election.description}
        </p>
      </div>

      <div className="election-poll">
        {isElectionEnded ? (
          currentLeader ? (
            <motion.div
              className="winner-announcement"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", duration: 0.6 }}
            >
              <h3>
                <motion.span
                  initial={{ scale: 0.8, rotate: -15 }}
                  animate={{ scale: 1.2, rotate: 0 }}
                  transition={{ yoyo: Infinity, duration: 1 }}
                >
                  <FontAwesomeIcon icon={faTrophy} className="trophy-icon" />
                </motion.span>
                Winner: {currentLeader.user.firstName}{" "}
                {currentLeader.user.lastName}
              </h3>
              <p>Votes: {calculatePercentage(currentLeader.votes)}%</p>
            </motion.div>
          ) : (
            <p>No winner could be determined.</p>
          )
        ) : (
          currentLeader && (
            <motion.div
              className="current-leader"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3>
                Currently Leading: {currentLeader.user.firstName}{" "}
                {currentLeader.user.lastName}
              </h3>
              <p>Votes: {calculatePercentage(currentLeader.votes)}%</p>
            </motion.div>
          )
        )}
      </div>

      <div className="candidates-section">
        <h3>Candidates</h3>
        <div className="chart-section">
          <Bar
            data={barData}
            options={{ responsive: true, maintainAspectRatio: false }}
          />
        </div>
        <div className="chart-section">
          <Pie
            data={pieData}
            options={{ responsive: true, maintainAspectRatio: false }}
          />
        </div>

        <div className="candidates-grid">
          {election.candidates.map((candidate) => (
            <motion.div
              key={candidate._id}
              className="candidate-card"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Profile user={candidate.user} isCandidate />
              <p>Votes: {calculatePercentage(candidate.votes)}%</p>
              {!isElectionEnded && (
                <button onClick={() => handleVote(candidate._id)}>
                  <FontAwesomeIcon icon={faVoteYea} /> Vote for{" "}
                  {candidate.user.firstName}
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {voteStatus && (
        <motion.div
          className={`VoteStatusMessage ${
            voteStatus.includes("success") ? "success" : "error"
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {voteStatus}
        </motion.div>
      )}

      {(user.role === "Admin" || user.isCompany) && (
        <div className="delete-election">
          <button
            onClick={() => handleDeleteElection(election._id)}
            className="delete-button"
          >
            Delete Election
          </button>
        </div>
      )}
    </div>
  );
};

export default ElectionDetails;
