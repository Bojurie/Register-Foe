const mongoose = require("mongoose");

const pastElectionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  election: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Election",
  },
  companyCode: {
    type: String,
    required: true,
    unique: true,
  },
  dateVoted: {
    type: Date,
    default: Date.now,
  },
});

const PastElection = mongoose.model("PastElection", pastElectionSchema);

module.exports = PastElection;
