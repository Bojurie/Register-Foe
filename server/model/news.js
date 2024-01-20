const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema(
  {
    companyCode: {
      ref: "Company",
      required: true,
      type: String,
      index: true, 
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: false,
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
