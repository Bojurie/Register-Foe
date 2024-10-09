const { v4: uuidv4 } = require("uuid");
const Election = require("../model/electionModel");

const createUniqueElection = async (electionData, candidateDocs) => {
  let attemptCount = 0;
  const maxAttempts = 5;

  while (attemptCount < maxAttempts) {
    try {
      electionData.electionId = uuidv4();

      const newElection = new Election({
        ...electionData,
        candidates: candidateDocs.map((doc) => ({
          user: doc._id,
          votes: 0, // Ensure `votes` field is initialized properly
        })),
      });

      await newElection.save();
      return newElection;
    } catch (error) {
      if (error.code === 11000) {
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
