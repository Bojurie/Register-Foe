const mongoose = require("mongoose");
const Company = require("./companySchema");

async function validateCompanyCode(value) {
  const company = await Company.findOne({ companyCode: value });
  return !!company;
}

const pastElectionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    election: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Election",
      required: true,
    },
    companyCode: {
      type: String,
      required: [true, "Company code is required"],
      validate: {
        validator: validateCompanyCode,
        message: (props) => `No company found with code ${props.value}`,
      },
    },
    dateVoted: {
      type: Date,
      default: Date.now,
    },
    candidateVotedFor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

pastElectionSchema.index({ user: 1, election: 1 }, { unique: true });

const PastElection = mongoose.model("PastElection", pastElectionSchema);

module.exports = PastElection;
