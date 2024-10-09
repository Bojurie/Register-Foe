const mongoose = require("mongoose");

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
    companyCode: {
      type: String,
      required: [true, "Company code is required"],
    },
    electionId: {
      type: String,
      required: true,
      unique: true,
    },
    candidates: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Candidate",
      },
    ],
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

const Election = mongoose.model("Election", electionSchema);
module.exports = Election;
