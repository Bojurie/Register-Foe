const mongoose = require("mongoose");
const Company = require("./companySchema");

// Validate company code
async function validateCompanyCode(value) {
  try {
    return await Company.exists({ companyCode: value });
  } catch (error) {
    console.error("Error validating company code:", error);
    return false;
  }
}

// Reaction Schema
const reactionSchema = new mongoose.Schema({
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  likeCount: { type: Number, default: 0 },
  dislikeCount: { type: Number, default: 0 },
});

// Reply Schema
const replySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now },
  reactions: {
    type: reactionSchema,
    default: () => ({ likes: [], dislikes: [], likeCount: 0, dislikeCount: 0 }),
  }, // Initialize reactions
});

// Comment Schema
const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now },
  replies: [replySchema],
  reactions: {
    type: reactionSchema,
    default: () => ({ likes: [], dislikes: [], likeCount: 0, dislikeCount: 0 }),
  }, // Initialize reactions
});

// Topic Schema
const topicSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  dateStart: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        return this.isNew ? value >= new Date() : true;
      },
      message: "Start date cannot be in the past",
    },
  },
  dateEnd: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        return value > this.dateStart;
      },
      message: "End date must be after the start date",
    },
  },
  description: { type: String, required: true, trim: true },
  companyCode: {
    type: String,
    required: true,
    validate: {
      validator: validateCompanyCode,
      message: "No company found with code {VALUE}",
    },
  },
  reactions: {
    type: reactionSchema,
    default: () => ({ likes: [], dislikes: [], likeCount: 0, dislikeCount: 0 }),
  }, // Initialize reactions
  comments: [commentSchema],
});

topicSchema.index({ companyCode: 1 });

// Topic Methods
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
  const newComment = {
    user: userId,
    text,
    reactions: { likes: [], dislikes: [], likeCount: 0, dislikeCount: 0 },
  };
  this.comments.push(newComment);
  await this.save();
  return this;
};

topicSchema.methods.likeComment = async function (commentId, userId) {
  const comment = this.comments.id(commentId);
  if (!comment) throw new Error("Comment not found");

  comment.reactions = comment.reactions || {
    likes: [],
    dislikes: [],
    likeCount: 0,
    dislikeCount: 0,
  }; // Ensure reactions are initialized

  if (!comment.reactions.likes.includes(userId)) {
    comment.reactions.likes.push(userId);
    comment.reactions.dislikes = comment.reactions.dislikes.filter(
      (id) => !id.equals(userId)
    );
    comment.reactions.likeCount = comment.reactions.likes.length;
    comment.reactions.dislikeCount = comment.reactions.dislikes.length;
    await this.save();
  }
  return comment;
};

topicSchema.methods.dislikeComment = async function (commentId, userId) {
  const comment = this.comments.id(commentId);
  if (!comment) throw new Error("Comment not found");

  comment.reactions = comment.reactions || {
    likes: [],
    dislikes: [],
    likeCount: 0,
    dislikeCount: 0,
  }; // Ensure reactions are initialized

  if (!comment.reactions.dislikes.includes(userId)) {
    comment.reactions.dislikes.push(userId);
    comment.reactions.likes = comment.reactions.likes.filter(
      (id) => !id.equals(userId)
    );
    comment.reactions.likeCount = comment.reactions.likes.length;
    comment.reactions.dislikeCount = comment.reactions.dislikes.length;
    await this.save();
  }
  return comment;
};

const Topic = mongoose.model("Topic", topicSchema);
module.exports = Topic;
