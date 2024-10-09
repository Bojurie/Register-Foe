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

voteSchema.index({ election: 1, voter: 1 }, { unique: true });

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
