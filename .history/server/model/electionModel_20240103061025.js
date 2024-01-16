const mongoose = require("mongoose");
const Company = require("./companySchema");

async function validateCompanyCode(value) {
  const company = await Company.findOne({ companyCode: value });
  return !!company;
}

const electionSchema = new mongoose.Schema({
  electionName: {
    type: String,
    required: true,
  },
  electionType: {
    type: String,
    required: true,
  },
  electionStartDate: {
    type: Date,
    required: true,
  },
  electionEndDate: {
    type: Date,
    required: true,
  },
  electionDesc: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "onModel", // This field will now dynamically use the model specified in 'onModel'
  },
  onModel: {
    type: String,
    required: true,
    enum: ["Company", "User"], // Allowed models
  },
  companyCode: {
    type: String,
    required: [true, "Company code is required"],
    validate: {
      validator: validateCompanyCode,
      message: (props) => `No company found with code ${props.value}`,
    },
  },
  candidates: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      votes: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
  ],
});

module.exports = mongoose.model("Election", electionSchema);
