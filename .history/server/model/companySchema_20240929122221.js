const mongoose = require("mongoose");
const addressSchema = require("../model/addressSchema");
const bcrypt = require("bcrypt");

async function validateUniqueCompanyCode(value) {
  const companyExists = await mongoose.models.Company.exists({
    companyCode: value,
  });
  return !companyExists;
}

const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, "Company name is required"],
      unique: true,
      trim: true,
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    companyAddress: {
      type: addressSchema,
      required: true,
    },
    companyEmail: {
      type: String,
      required: [true, "Company email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (email) {
          return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      validate: {
        validator: function (phone) {
          return /^\+?[1-9]\d{1,14}$/.test(phone);
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    companyPhotoUrl: {
      type: String,
      default: "",
    },
    companyCode: {
      type: String,
      required: [true, "Company code is required"],
      unique: true,
      validate: {
        validator: validateUniqueCompanyCode,
        message: "Company code must be unique.",
      },
    },
    adminUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    electionsCreated: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Election",
      },
    ],
  },
  { timestamps: true }
);

companySchema.index({ companyName: 1 });
companySchema.index({ companyEmail: 1 });

companySchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const Company = mongoose.model("Company", companySchema);

module.exports = Company;
