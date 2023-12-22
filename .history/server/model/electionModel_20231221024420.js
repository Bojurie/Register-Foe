const mongoose = require("mongoose");

const electionSchema = new mongoose.Schema({
  electionName: { type: String, required: true },
  electionDate: { type: Date, required: true },
  constituency: String,

});

const Election = mongoose.model("Election", electionSchema);

module.exports = Election;
