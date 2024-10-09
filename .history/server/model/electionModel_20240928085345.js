const mongoose = require("mongoose");
const { Schema } = mongoose;

const electionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Election title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Election description is required"],
    },
    electionType: {
      type: String,
      required: [true, "Election type is required"],
    },
    startDate: {
      type: Date,
      required: [true, "Election start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "Election end date is required"],
    },
    city: {
      type: String,
      required: [true, "Election city is required"],
    },
    state: {
      type: String,
      required: [true, "Election state is required"],
    },
    candidates: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        votes: [
          {
            voter: {
              type: Schema.Types.ObjectId,
              ref: "User",
              required: true,
            },
            voteDate: {
              type: Date,
              default: Date.now,
            },
          },
        ],
      },
    ],
    companyCode: {
      type: String,
      required: [true, "Company code is required"],
    },
    electionId: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

electionSchema.pre("validate", function (next) {
  if (this.startDate >= this.endDate) {
    this.invalidate("endDate", "End date must be after start date");
  }
  next();
});

electionSchema.index({ companyCode: 1, electionId: 1 }, { unique: true });

electionSchema.virtual("totalVotes").get(function () {
  return this.candidates.reduce((total, candidate) => {
    return total + candidate.votes.length;
  }, 0);
});

const Election = mongoose.model("Election", electionSchema);
module.exports = Election;
