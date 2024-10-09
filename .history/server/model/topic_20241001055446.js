const mongoose = require("mongoose");
const Company = require("./companySchema");

async function validateCompanyCode(value) {
  try {
    const exists = await Company.exists({ companyCode: value });
    return exists;
  } catch (error) {
    console.error("Error validating company code:", error);
    return false; 
  }
}

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    required: [true, "Comment text is required"],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  replies: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      text: {
        type: String,
        required: [true, "Reply text is required"],
        trim: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
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
});

const topicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
  },
  dateStart: {
    type: Date,
    required: [true, "Start date is required"],
    validate: {
      validator: function (value) {
        return value >= new Date();
      },
      message: "Start date cannot be in the past",
    },
  },
  dateEnd: {
    type: Date,
    required: [true, "End date is required"],
    validate: {
      validator: function (value) {
        return value > this.dateStart;
      },
      message: "End date must be after the start date",
    },
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    trim: true,
  },
  companyCode: {
    type: String,
    required: [true, "Company code is required"],
    validate: {
      validator: validateCompanyCode,
      message: "No company found with code {VALUE}",
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
  likeCount: {
    type: Number,
    default: 0,
  },
  dislikeCount: {
    type: Number,
    default: 0,
  },
  comments: [commentSchema],
});

topicSchema.index({ companyCode: 1 });

topicSchema.methods.like = function (userId) {
  if (!this.likes.some((id) => id.equals(userId))) {
    this.likes.push(userId);
    this.dislikes = this.dislikes.filter((id) => !id.equals(userId));
    this.likeCount = this.likes.length;
    this.dislikeCount = this.dislikes.length;
  }
  return this.save();
};

topicSchema.methods.dislike = function (userId) {
  if (!this.dislikes.some((id) => id.equals(userId))) {
    this.dislikes.push(userId);
    this.likes = this.likes.filter((id) => !id.equals(userId));
    this.likeCount = this.likes.length;
    this.dislikeCount = this.dislikes.length;
  }
  return this.save();
};

topicSchema.methods.addComment = function (userId, text) {
  this.comments.push({ user: userId, text });
  return this.save();
};

const Topic = mongoose.model("Topic", topicSchema);

module.exports = Topic;
