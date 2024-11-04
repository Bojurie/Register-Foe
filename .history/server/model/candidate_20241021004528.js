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
    partyAffiliation: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const Candidate = mongoose.model("Candidate", candidateSchema);
module.exports = Candidate;
