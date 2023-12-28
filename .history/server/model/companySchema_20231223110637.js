const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
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
  electionsCreated: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Election",
    },
  ],
});

const Company = mongoose.model("Company", companySchema);

module.exports = Company;
