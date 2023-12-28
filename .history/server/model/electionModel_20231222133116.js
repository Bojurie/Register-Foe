const mongoose = require("mongoose");

const electionSchema = new mongoose.Schema({
  electionName: { type: String, required: true },
  electionType: { type: String, require: true },
  electionStartDate: { type: Date, required: true },
  electionEndDate: { type: Date, required: true },
  CompanyName: { type: String, required: true },
  electionDesc: { type: String, required: true },
  candidates: [
    {
      candidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CandidateProfile",
      },
      votes: { type: Number, default: 0, min: 0 }, // Adding min constraint
    },
  ],
});

module.exports = mongoose.model("Election", electionSchema);
