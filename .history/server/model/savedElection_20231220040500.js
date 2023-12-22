const mongoose = require("mongoose");

const savedElectionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  election: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Election",
  },
  dateSaved: {
    type: Date,
    default: Date.now,
  },
});

const SavedElection = mongoose.model("SavedElection", savedElectionSchema);

module.exports = SavedElection;
