const { v4: uuidv4 } = require("uuid");
const Election = require("../model/electionModel");

const createUniqueElection = async (electionData, candidateDocs) => {
  let attemptCount = 0;
  const maxAttempts = 5;

  while (attemptCount < maxAttempts) {
    try {
      // Assign a unique election ID
      electionData.electionId = uuidv4();

      // Properly format each candidate object with both user and votes fields
      const formattedCandidates = candidateDocs.map((doc) => ({
        user: doc._id,
        votes: { totalVotes: 0 },
      }));

      // Create a new Election document
      const newElection = new Election({
        ...electionData,
        candidates: formattedCandidates,
      });

      // Save the election to the database
      await newElection.save();
      return newElection;
    } catch (error) {
      if (error.code === 11000) {
        // Handle duplicate key error
        attemptCount++;
        console.warn(
          "Duplicate electionId, retrying... Attempt:",
          attemptCount
        );
      } else {
        console.error("Error creating election:", error);
        throw new Error("Failed to create election.");
      }
    }
  }

  throw new Error("Max attempts reached. Failed to create election.");
};

module.exports = createUniqueElection;
