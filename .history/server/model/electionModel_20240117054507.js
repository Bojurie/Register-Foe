const mongoose = require("mongoose");

const electionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [false, "Election title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [false, "Election description is required"],
    },
    electionType: {
      type: String,
      required: [false, "Election description is required"],
    },
    startDate: {
      type: Date,
      required: [false, "Election start date is required"],
    },
    endDate: {
      type: Date,
      required: [false, "Election end date is required"],
    },
    city: {
      type: String,
      required: false, // or simply remove the 'required' line
    },
    state: {
      type: String,
      required: false,
    },
    electionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
    },
    candidates: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to User model
      },
    ],
    companyCode: {
      type: String,
      required: [true, "Company code is required"],
    },
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

electionSchema.index({ companyCode: 1, electionId: 1 }, { unique: true });


const Election = mongoose.model("Election", electionSchema);
module.exports = Election;
