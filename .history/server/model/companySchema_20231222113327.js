const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  photoUrl: {
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
