const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Company = require("./companySchema");

async function validateCompanyCode(value) {
  const companyExists = await Company.exists({ companyCode: value });
  return companyExists;
}

const userSchema = new mongoose.Schema(
  {
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
      required: [true, "First name is required"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
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
      required: [true, "Username is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    sex: String,
    dob: {
      type: Date,
      required: [true, "Date of birth is required"],
    },
    age: {
      type: Number,
      default: function () {
        const now = new Date();
        const birthDate = new Date(this.dob);
        let age = now.getFullYear() - birthDate.getFullYear();
        const monthDiff = now.getMonth() - birthDate.getMonth();
        if (
          monthDiff < 0 ||
          (monthDiff === 0 && now.getDate() < birthDate.getDate())
        ) {
          age--;
        }
        return age;
      },
    },
    userProfileImage: String,
    role: {
      type: String,
      required: true,
      enum: ["User", "Admin"],
      default: "Use",
    },
    userProfileDetail: {
      type: String,
      required: [true, "User profile detail is required"],
    },
    votedElections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Election",
      },
    ],
    savedElections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Election",
      },
    ],
    pastElections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Election",
      },
    ],
    candidateInElections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Election",
      },
    ],
    votesCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
