const mongoose = require("mongoose");
const Company = require("./companySchema");

// Asynchronous function to validate company code
async function isValidCompanyCode(value) {
  const company = await Company.findOne({ companyCode: value });
  return !!company;
}

const newsSchema = new mongoose.Schema(
  {
    companyCode: {
      type: String,
      required: [true, "Company code is required"],
      validate: {
        // Asynchronous validation wrapped in a synchronous function
        validator: async function (value) {
          return await isValidCompanyCode(value);
        },
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
      default: "https://example.com/default-news-image.jpg",
    },
    content: {
      type: String,
      required: [true, "News content is required"],
    },
    readBy: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isNew: {
      type: Boolean,
      default: true,
      index: true,
    },
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
          validate: {
            validator: (value) => value.trim().length > 0,
            message: "Comment content cannot be empty",
          },
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
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual fields for likes and comments count
newsSchema.virtual("likeCount").get(function () {
  return this.likes.length;
});

newsSchema.virtual("commentCount").get(function () {
  return this.comments.length;
});

// Combined pre-save hook
newsSchema.pre("save", function (next) {
  // Trim title if new and modified
  if (this.isNew && this.isModified("title")) {
    this.title = this.title.trim();
  }

  // Validate each comment content for empty strings
  const invalidComment = this.comments.find((comment) => {
    return typeof comment.content !== "string" || !comment.content.trim();
  });

  if (invalidComment) {
    return next(new Error("Comment content cannot be empty."));
  }

  next();
});

const News = mongoose.model("News", newsSchema);

module.exports = News;
