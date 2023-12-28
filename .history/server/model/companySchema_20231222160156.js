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
    required: false,
  },
  companyCode: {
    type: String,
    required: true,
    unique: true,
  },
});

const Company = mongoose.model("Company", companySchema);

module.exports = Company;
