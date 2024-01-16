const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
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
    companyEmail: {
      type: String,
      required: true,
      validate: {
        validator: function (email) {
          return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
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

const Company = mongoose.model("Company", companySchema);

module.exports = Company;
