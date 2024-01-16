const mongoose = require("mongoose");

const electionSchema = new mongoose.Schema(
  {
    electionTitle: {
      type: String,
      required: [true, "Election title is required"],
      trim: true,
    },
    electionType: {
      type: String,
      required: [true, "Type of Election is required"],
    },
    electionDesc: {
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
    candidates: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        // Optional: Add validation for candidate existence
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Election creator is required"],
      // Optional: Add validation for user existence
    },
    companyCode: {
      type: String,
      required: [true, "Company code is required"],
      // Index for optimization
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