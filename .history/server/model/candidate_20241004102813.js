const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    election: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Election",
      required: true,
    },
    votes: {
      type: Number,
      default: 0,
    },
    partyAffiliation: String,
    voters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

candidateSchema.methods.castVote = async function (voterId) {
  if (this.voters.includes(voterId)) {
    throw new Error("User has already voted for this candidate.");
  }

  this.voters.push(voterId);
  this.votes += 1;
  await this.save();

  // Update user's voted elections
  const User = mongoose.model("User");
  await User.findByIdAndUpdate(voterId, {
    $addToSet: { votedElections: this.election },
  });

  return { success: true, message: "Vote cast successfully" };
};

const Candidate = mongoose.model("Candidate", candidateSchema);
module.exports = Candidate;
