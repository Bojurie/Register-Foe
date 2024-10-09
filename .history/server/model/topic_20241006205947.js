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

const reactionSchema = new mongoose.Schema({
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
});

const replySchema = new mongoose.Schema({
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
  reactions: {
    type: reactionSchema,
    default: () => ({}),
  },
});

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
  replies: [replySchema],
  reactions: {
    type: reactionSchema,
    default: () => ({}),
  },
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
  reactions: {
    type: reactionSchema,
    default: () => ({}),
  },
  comments: [commentSchema],
});

topicSchema.index({ companyCode: 1 });

topicSchema.methods.like = async function (userId) {
  if (!this.reactions.likes.includes(userId)) {
    this.reactions.likes.push(userId);
    this.reactions.dislikes = this.reactions.dislikes.filter(
      (id) => !id.equals(userId)
    );
    this.reactions.likeCount = this.reactions.likes.length;
    this.reactions.dislikeCount = this.reactions.dislikes.length;
    await this.save();
  }
  return this;
};

topicSchema.methods.dislike = async function (userId) {
  if (!this.reactions.dislikes.includes(userId)) {
    this.reactions.dislikes.push(userId);
    this.reactions.likes = this.reactions.likes.filter(
      (id) => !id.equals(userId)
    );
    this.reactions.likeCount = this.reactions.likes.length;
    this.reactions.dislikeCount = this.reactions.dislikes.length;
    await this.save();
  }
  return this;
};

topicSchema.methods.addComment = async function (userId, text) {
  this.comments.push({ user: userId, text });
  await this.save();
  return this;
};

commentSchema.methods.like = async function (userId) {
  if (!this.reactions.likes.includes(userId)) {
    this.reactions.likes.push(userId);
    this.reactions.dislikes = this.reactions.dislikes.filter(
      (id) => !id.equals(userId)
    );
    this.reactions.likeCount = this.reactions.likes.length;
    this.reactions.dislikeCount = this.reactions.dislikes.length;
    await this.parent().save(); // Saves the parent document (topic)
  }
  return this;
};

commentSchema.methods.dislike = async function (userId) {
  if (!this.reactions.dislikes.includes(userId)) {
    this.reactions.dislikes.push(userId);
    this.reactions.likes = this.reactions.likes.filter(
      (id) => !id.equals(userId)
    );
    this.reactions.likeCount = this.reactions.likes.length;
    this.reactions.dislikeCount = this.reactions.dislikes.length;
    await this.parent().save(); // Saves the parent document (topic)
  }
  return this;
};

const Topic = mongoose.model("Topic", topicSchema);

module.exports = Topic;
