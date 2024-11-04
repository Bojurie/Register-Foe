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
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  }, // Unique ID for each reply
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now },
  reactions: { type: reactionSchema, default: () => ({}) },
});

// Comment Schema
const commentSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  }, // Unique ID for each comment
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now },
  replies: [replySchema],
  reactions: { type: reactionSchema, default: () => ({}) },
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
    _id: new mongoose.Types.ObjectId(), // Unique ID for the new comment
    user: userId,
    text,
    reactions: { likes: [], dislikes: [], likeCount: 0, dislikeCount: 0 },
  };
  this.comments.push(newComment);
  await this.save();
  return this;
};

// Consolidated method to react to a comment or reply
const updateReactions = (entity, userId, action) => {
  const isLikeAction = action === "like";

  if (isLikeAction) {
    if (!entity.likes.includes(userId)) {
      entity.likes.push(userId);
      entity.dislikes = entity.dislikes.filter((id) => !id.equals(userId));
    }
  } else {
    if (!entity.dislikes.includes(userId)) {
      entity.dislikes.push(userId);
      entity.likes = entity.likes.filter((id) => !id.equals(userId));
    }
  }

  entity.likeCount = entity.likes.length;
  entity.dislikeCount = entity.dislikes.length;
};

// React to a comment or reply
topicSchema.methods.reactToCommentOrReply = async function (
  commentId,
  replyId,
  userId,
  action
) {
  const comment = this.comments.id(commentId);
  if (!comment) throw new Error("Comment not found");

  const target = replyId ? comment.replies.id(replyId) : comment;
  if (!target) throw new Error("Reply not found");

  updateReactions(target.reactions, userId, action);
  await this.save();
  return target;
};

const Topic = mongoose.model("Topic", topicSchema);
module.exports = Topic;
