const mongoose = require("mongoose");

const electionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    electionType: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    companyCode: {
      type: String,
      required: true,
      trim: true,
    },
    electionId: {
      type: String,
      required: true,
      unique: true,
    },
    candidates: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Candidate",
        required: true,
      },
    ],
    totalVotes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

electionSchema.methods.castVote = async function (candidateId) {
  try {
    // Find the candidate by candidateId and increment the vote count
    const candidate = this.candidates.find((candidate) =>
      candidate.equals(candidateId)
    );

    if (!candidate) {
      throw new Error("Candidate not found");
    }

    candidate.voteCount += 1;
    this.totalVotes += 1;

    await this.save();
    return { success: true, message: "Vote cast successfully" };
  } catch (error) {
    console.error("Error casting vote:", error);
    throw new Error("Unable to cast vote");
  }
};

const Election = mongoose.model("Election", electionSchema);
module.exports = Election;
