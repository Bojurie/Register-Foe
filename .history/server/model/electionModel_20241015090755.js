const mongoose = require("mongoose");

const electionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    electionId: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true, trim: true },
    electionType: {
       electionType: {
    type: String, 
    required: true,
       }
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    companyCode: { type: String, required: true, trim: true },
    candidates: [{ type: mongoose.Schema.Types.ObjectId, ref: "Candidate" }],
    totalVotes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Pre-save hook to validate election dates
electionSchema.pre("save", function (next) {
  const now = new Date();
  if (this.startDate > this.endDate) {
    return next(new Error("Election start date must be before the end date."));
  } else if (this.endDate < now) {
    return next(new Error("Election end date cannot be in the past."));
  }
  next();
});

const Election = mongoose.model("Election", electionSchema);
module.exports = Election;
