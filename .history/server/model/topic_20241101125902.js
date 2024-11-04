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
  reactions: { type: reactionSchema, default: () => ({}) },
});

// Comment Schema
const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now },
  replies: [replySchema],
  reactions: { type: reactionSchema, default: () => ({}) }, // Ensure default is set
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
  reactions: { type: reactionSchema, default: () => ({}) },
  comments: [commentSchema],
});

// Index for company code
topicSchema.index({ companyCode: 1 });

// Add a comment
topicSchema.methods.addComment = async function (userId, text) {
  const newComment = {
    user: userId,
    text,
    reactions: { likes: [], dislikes: [], likeCount: 0, dislikeCount: 0 }, // Initialize reactions
  };
  this.comments.push(newComment);
  await this.save();
  return this;
};

// Consolidated method to react to a comment (like/dislike)
topicSchema.methods.reactToComment = async function (
  commentId,
  userId,
  action
) {
  const comment = this.comments.id(commentId);
  if (!comment) throw new Error("Comment not found");

  // Initialize reactions if undefined
  comment.reactions = comment.reactions || {
    likes: [],
    dislikes: [],
    likeCount: 0,
    dislikeCount: 0,
  };

  const isLikeAction = action === "like";

  // Add or remove like/dislike based on action
  if (isLikeAction) {
    if (!comment.reactions.likes.includes(userId)) {
      comment.reactions.likes.push(userId);
      comment.reactions.dislikes = comment.reactions.dislikes.filter(
        (id) => !id.equals(userId)
      );
    }
  } else {
    if (!comment.reactions.dislikes.includes(userId)) {
      comment.reactions.dislikes.push(userId);
      comment.reactions.likes = comment.reactions.likes.filter(
        (id) => !id.equals(userId)
      );
    }
  }

  // Update counts
  comment.reactions.likeCount = comment.reactions.likes.length;
  comment.reactions.dislikeCount = comment.reactions.dislikes.length;

  await this.save();
  return comment;
};

// Other methods as needed...
const Topic = mongoose.model("Topic", topicSchema);
module.exports = Topic;
