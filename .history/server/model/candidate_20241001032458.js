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
      totalVotes: {
        type: Number,
        default: 0,
      },
    },
    partyAffiliation: String,
  },
  { timestamps: true }
);

candidateSchema.index({ election: 1, user: 1 }, { unique: true });

const Candidate = mongoose.model("Candidate", candidateSchema);

module.exports = Candidate;
