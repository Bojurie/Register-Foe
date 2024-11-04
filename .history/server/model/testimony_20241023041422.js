const mongoose = require("mongoose");

const TestimonySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  position: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  testimony: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Testimony", TestimonySchema);
