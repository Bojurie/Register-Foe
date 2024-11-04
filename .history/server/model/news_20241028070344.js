const mongoose = require("mongoose");
const Company = require("./companySchema");

async function validateCompanyCode(value) {
  try {
    const company = await Company.findOne({ companyCode: value });
    return !!company;
  } catch (error) {
    console.error("[ERROR] Error validating company code:", error);
    throw new Error("Error validating company code");
  }
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
  // Trim title if new
  if (this.isNew && this.isModified("title")) {
    this.title = this.title.trim();
  }

  // Validate each comment content
  if (this.comments) {
    this.comments.forEach((comment) => {
      if (typeof comment.content !== "string" || !comment.content.trim()) {
        next(new Error("Comment content cannot be empty."));
      }
    });
  }

  next();
});

const News = mongoose.model("News", newsSchema);

module.exports = News;
