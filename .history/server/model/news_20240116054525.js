const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema(
  {
    companyCode: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company", // Reference to the Company model
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const News = mongoose.model("News", newsSchema);

module.exports = News;
