import React, { useState, useEffect } from "react";
import styled from "styled-components";
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

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

// Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr;
`;

const Header = styled.h1`
  text-align: center;
  font-size: 2.2rem;
  color: #333;
`;

const InfoGrid = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  padding: 20px;
  background: #f0f2f5;
  border-radius: 12px;
`;

const ChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
`;

const CandidatesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
`;

const CandidateCard = styled(motion.div)`
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease;
`;

const StatusMessage = styled(motion.div)`
  margin-top: 20px;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  font-weight: bold;
  color: ${({ status }) => (status === "success" ? "#28a745" : "#dc3545")};
  background: ${({ status }) => (status === "success" ? "#d4edda" : "#f8d7da")};
`;

const DeleteButton = styled(Button)`
  background-color: #d9534f;
  color: white;
  &:hover {
    background-color: #c0392b;
  }
`;

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
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
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
      },
    ],
  };

  return (
    <Container>
      <Header>{election.title}</Header>
      <InfoGrid>
        <p>
          <strong>Type:</strong> {election.electionType}
        </p>
        <p>
          <strong>Start Date:</strong>{" "}
          {new Date(election.startDate).toLocaleDateString()}
        </p>
        <p>
          <strong>End Date:</strong>{" "}
          {new Date(election.endDate).toLocaleDateString()}
        </p>
        <p>
          <strong>Location:</strong> {election.city}, {election.state}
        </p>
        <p>
          <strong>About:</strong> {election.description}
        </p>
      </InfoGrid>

      <ChartContainer>
        <Bar
          data={barData}
          options={{ responsive: true, maintainAspectRatio: false }}
        />
        <Pie
          data={pieData}
          options={{ responsive: true, maintainAspectRatio: false }}
        />
      </ChartContainer>

      <CandidatesGrid>
        {election.candidates.map((candidate) => (
          <CandidateCard key={candidate._id} whileHover={{ scale: 1.05 }}>
            <Profile user={candidate.user} isCandidate />
            <p>Votes: {calculatePercentage(candidate.votes)}%</p>
            {!isElectionEnded && (
              <Button onClick={() => handleVote(candidate._id)}>
                <FontAwesomeIcon icon={faVoteYea} /> Vote for{" "}
                {candidate.user.firstName}
              </Button>
            )}
          </CandidateCard>
        ))}
      </CandidatesGrid>

      {voteStatus && (
        <StatusMessage
          status={voteStatus.includes("success") ? "success" : "error"}
        >
          {voteStatus}
        </StatusMessage>
      )}

      {(user.role === "Admin" || user.isCompany) && (
        <DeleteButton onClick={() => handleDeleteElection(election._id)}>
          Delete Election
        </DeleteButton>
      )}
    </Container>
  );
};

export default ElectionDetails;
