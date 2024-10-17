const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema(
  {
    election: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Election",
      required: true,
    },
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    voter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Index to ensure one vote per voter per election
voteSchema.index({ election: 1, voter: 1 }, { unique: true });

// Pre-save hook to check if the voter has already voted in the election
voteSchema.pre("save", async function (next) {
  try {
    const existingVote = await Vote.findOne({
      election: this.election,
      voter: this.voter,
    });

    if (existingVote) {
      const error = new Error("Voter has already voted in this election");
      error.status = 400;
      return next(error);
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Vote = mongoose.model("Vote", voteSchema);
module.exports = Vote;
