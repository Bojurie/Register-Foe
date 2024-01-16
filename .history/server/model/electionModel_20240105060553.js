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
      required: [true, "Election description is required"],
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
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to User model
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Election creator is required"],
    },
    companyCode: {
      type: String,
      required: [true, "Company code is required"],
    },
    // Additional fields as per your application's requirement
  },
  { timestamps: true }
);

// Validate that startDate is before endDate
electionSchema.pre("validate", function (next) {
  if (this.startDate >= this.endDate) {
    this.invalidate("endDate", "End date must be after start date");
  }
  next();
});

// Adding Indexes for Optimization
electionSchema.index({ companyCode: 1 });
electionSchema.index({ createdBy: 1 });

const Election = mongoose.model("Election", electionSchema);
module.exports = Election;
