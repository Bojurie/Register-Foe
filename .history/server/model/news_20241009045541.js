const mongoose = require("mongoose");
const Company = require("./companySchema");

async function validateCompanyCode(value) {
  const company = await Company.findOne({ companyCode: value });
  return !!company;
}

const newsSchema = new mongoose.Schema(
  {
    companyCode: {
      type: String,
      ref: "Company",
      required: [true, "Company code is required"],
      validate: {
        validator: validateCompanyCode,
        message: (props) => `No company found with code ${props.value}`,
      },
      index: true,
    },
    title: {
      type: String,
      required: [true, "News title is required"],
      trim: true,
    },
    image: {
      type: String,
      required: false,
      default: "https://example.com/default-news-image.jpg",
    },
    content: {
      type: String,
      required: [true, "News content is required"],
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isNew: { type: Boolean, default: true }, 

    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        content: {
          type: String,
          required: [true, "Comment content is required"],
          trim: true,
        },
        likes: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
        ],
        dislikes: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
        ],
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

newsSchema.virtual("likeCount").get(function () {
  return this.likes.length;
});

newsSchema.virtual("commentCount").get(function () {
  return this.comments.length;
});

const News = mongoose.model("News", newsSchema);

module.exports = News;
