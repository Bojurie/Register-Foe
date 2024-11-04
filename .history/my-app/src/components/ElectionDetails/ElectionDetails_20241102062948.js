import React, { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrophy,
  faVoteYea,
  faHandshake,
} from "@fortawesome/free-solid-svg-icons";
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
import Profile from "../Profile/Profile";
import { useAuth } from "../AuthContext/AuthContext";
import { Button } from "../StyledComponents";
import "./ElectionDetails.css";

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
  const { user } = useAuth();
  const [currentLeader, setCurrentLeader] = useState(null);
  const [isElectionEnded, setIsElectionEnded] = useState(false);
  const [totalVotes, setTotalVotes] = useState(0);
  const [tieCandidates, setTieCandidates] = useState([]);

  useEffect(() => {
    const now = new Date();
    setIsElectionEnded(now > new Date(election.endDate));

    const total = election.candidates.reduce(
      (sum, candidate) => sum + candidate.votes,
      0
    );
    setTotalVotes(total);

    if (election.candidates.length > 0) {
      const sortedCandidates = [...election.candidates].sort(
        (a, b) => b.votes - a.votes
      );
      const highestVoteCount = sortedCandidates[0].votes;
      const ties = sortedCandidates.filter(
        (candidate) => candidate.votes === highestVoteCount
      );
      setTieCandidates(ties.length > 1 ? ties : []);
      setCurrentLeader(ties.length === 1 ? ties[0] : null);
    }
  }, [election]);

  const calculatePercentage = (votes) =>
    totalVotes === 0 ? 0 : ((votes / totalVotes) * 100).toFixed(2);

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
        {/* Render the winner or tie announcement */}
      </div>

      <div className="whole-chart">
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
              <Button onClick={() => handleVote(candidate._id)}>
                <FontAwesomeIcon icon={faVoteYea} /> Vote for{" "}
                {candidate.user.firstName}
              </Button>
            )}
          </motion.div>
        ))}
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
          <Button
            onClick={() => handleDeleteElection(election._id)}
            className="delete-button"
          >
            Delete Election
          </Button>
        </div>
      )}
    </div>
  );
};

export default ElectionDetails;
