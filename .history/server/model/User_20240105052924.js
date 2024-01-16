const mongoose = require("mongoose");
const Company = require("./companySchema");

async function validateCompanyCode(value) {
  const company = await Company.findOne({ companyCode: value });
  return !!company;
}

const userSchema = new mongoose.Schema({
  companyCode: {
    type: String,
    required: [true, "Company code is required"],
    validate: {
      validator: validateCompanyCode,
      message: (props) => `No company found with code ${props.value}`,
    },
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function (v) {
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
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
  sex: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  userProfileImage: {
    type: String,
  },
  role: {
    type: String,
    required: true,
    enum: ["User", "Admin"],
    default: "User",
  },
  userProfileDetail: {
    type: String,
    required: true,
  },
  savedElections: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Election",
    },
  ],
  pastElections: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PastElection",
    },
  ],
  votes: [
    {
      election: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Election",
      },
      candidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
  likedCandidates: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const User = mongoose.model("User", userSchema);
module.exports = User;
