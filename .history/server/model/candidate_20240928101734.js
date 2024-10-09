const mongoose = require("mongoose");

// Define the Candidate schema
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
    partyAffiliation: {
      type: String,
      required: false, // Optional field for party information
    },
  },
  { timestamps: true }
);

// Create an index to improve query performance for finding candidates by election
candidateSchema.index({ election: 1, user: 1 }, { unique: true });

const Candidate = mongoose.model("Candidate", candidateSchema);

module.exports = Candidate;
