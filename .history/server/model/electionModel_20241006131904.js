const mongoose = require("mongoose");

const electionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    electionType: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    companyCode: { type: String, required: true, trim: true },
    electionId: { type: String, required: true, unique: true },
    candidates: [{ type: mongoose.Schema.Types.ObjectId, ref: "Candidate" }],
    totalVotes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Election = mongoose.model("Election", electionSchema);
module.exports = Election;
