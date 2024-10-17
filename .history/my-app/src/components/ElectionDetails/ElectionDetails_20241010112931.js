import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Profile from "../Profile/Profile";
import "./ElectionDetails.css";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const ElectionDetails = ({ election, handleVote, voteStatus }) => {
  const [currentLeader, setCurrentLeader] = useState(null);
  const [isElectionEnded, setIsElectionEnded] = useState(false);
  const [totalVotes, setTotalVotes] = useState(0);

  useEffect(() => {
    const now = new Date();
    const endDate = new Date(election.endDate);
    setIsElectionEnded(now > endDate);

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

  const calculatePercentage = (votes) =>
    totalVotes === 0 ? 0 : ((votes / totalVotes) * 100).toFixed(2);

  const pieData = election.candidates.map((candidate) => ({
    name: `${candidate.user.firstName} ${candidate.user.lastName}`,
    value: candidate.votes,
  }));

  return (
    <div className="ElectionDetails">
      <h1>{election.title}</h1>
      <div className="election-info">
        <p>Type of Election: {election.electionType}</p>
        <p>Start Date: {new Date(election.startDate).toLocaleDateString()}</p>
        <p>End Date: {new Date(election.endDate).toLocaleDateString()}</p>
        <p>City: {election.city}</p>
        <p>State: {election.state}</p>
        <p>About: {election.description}</p>
      </div>

      <div className="election-poll">
        <h3>Vote Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={pieData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8">
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius="80%"
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(2)}%`
              }
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {isElectionEnded ? (
        <div className="winner-announcement">
          {currentLeader ? (
            <h3>
              The Winner is: {currentLeader.user.firstName}{" "}
              {currentLeader.user.lastName}
            </h3>
          ) : (
            <p>No winner could be determined.</p>
          )}
        </div>
      ) : (
        currentLeader && (
          <div className="current-leader">
            <h3>
              Currently Leading: {currentLeader.user.firstName}{" "}
              {currentLeader.user.lastName}
            </h3>
            <p>Votes: {calculatePercentage(currentLeader.votes)}%</p>
          </div>
        )
      )}

      <div className="candidates-section">
        <h3>Candidates</h3>
        <div className="candidates-grid">
          {election.candidates.map((candidate) => (
            <div key={candidate._id} className="candidate-card">
              <Profile user={candidate.user} isCandidate />
              <p>Votes: {calculatePercentage(candidate.votes)}%</p>
              {!isElectionEnded && (
                <button onClick={() => handleVote(candidate._id)}>
                  Vote for {candidate.user.firstName}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {voteStatus && (
        <div
          className={`VoteStatusMessage ${
            voteStatus.includes("success") ? "success" : "error"
          }`}
        >
          {voteStatus}
        </div>
      )}
    </div>
  );
};

export default ElectionDetails;
