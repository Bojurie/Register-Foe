const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
    unique: true,
  },
  companyAddress: {
    type: String,
    required: true,
  },
  CompanyEmail: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  companyPhotoUrl: {
    type: String,
  },
  companyCode: {
    type: String,
    required: true,
    unique: true,
  },
  createdElections: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Election",
    },
  ],
});

const Company = mongoose.model("Company", companySchema);

module.exports = Company;
