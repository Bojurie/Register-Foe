const mongoose = require("mongoose");

const electionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    electionId: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true, trim: true },
    electionType: { type: String, required: true },
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

electionSchema.pre("save", function (next) {
  const now = new Date();
  if (this.startDate > this.endDate) {
    return next(new Error("Election start date must be before the end date."));
  } else if (this.endDate < now) {
    return next(new Error("Election end date cannot be in the past."));
  }
  next();
});

// Method to get leading candidate
electionSchema.methods.getLeadingCandidate = async function () {
  const candidates = await this.populate("candidates").execPopulate();
  return candidates.reduce(
    (prev, current) => {
      return prev.votes > current.votes ? prev : current;
    },
    { votes: 0 }
  );
};

const Election = mongoose.model("Election", electionSchema);
module.exports = Election;
