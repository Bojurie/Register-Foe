const mongoose = require("mongoose");
const Company = require("./companySchema");
const bcrypt = require("bcrypt");

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
  isAdmin: {
    type: Boolean,
    default: false,
  },
  userProfileImage: {
    type: String,
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
        ref: "Candidate",
      },
    },
  ],
  likedCandidates: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
    },
  ],
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
