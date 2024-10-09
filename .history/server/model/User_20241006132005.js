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
    role: {
      type: String,
      required: true,
      enum: ["User", "Admin"],
      default: "User",
    },
    votesCount: {
      type: Number,
      default: 0,
    },
    userProfileImage: String,
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
