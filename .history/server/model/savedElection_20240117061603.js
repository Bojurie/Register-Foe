const mongoose = require("mongoose");

const saveElectionSchema = new mongoose.Schema({
  electionRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Election",
    required: true,
  },
  userRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true,
  },
  savedAt: {
    type: Date,
    default: Date.now,
  },
  // You can add more fields relevant to the 'save' action if necessary
});

const SavedElection = mongoose.model("SavedElection", saveElectionSchema);
module.exports = SavedElection;
