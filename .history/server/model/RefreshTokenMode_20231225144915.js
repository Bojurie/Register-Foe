const mongoose = require("mongoose");

const refreshTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming you have a User model
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
      index: true, // Adds an index to expiryDate for efficient querying
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
); // Disables the versionKey (__v)

// Method to check if the token is expired
refreshTokenSchema.methods.isExpired = function () {
  return Date.now() >= this.expiryDate.getTime();
};

// Static method to clean up expired tokens
refreshTokenSchema.statics.cleanUpExpiredTokens = async function () {
  return await this.deleteMany({ expiryDate: { $lt: new Date() } });
};

const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);

module.exports = RefreshToken;
