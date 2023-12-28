const mongoose = require("mongoose");

const electionSchema = new mongoose.Schema({
  electionName: {
    type: String,
    required: true,
  },
  electionType: {
    type: String,
    required: true,
  },
  electionStartDate: {
    type: Date,
    required: true,
  },
  electionEndDate: {
    type: Date,
    required: true,
  },
  electionDesc: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  candidates: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      votes: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
  ],
});

module.exports = mongoose.model("Election", electionSchema);
