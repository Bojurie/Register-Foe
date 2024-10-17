const mongoose = require("mongoose");
const Company = require("./companySchema");

async function validateCompanyCode(value) {
  try {
    return await Company.exists({ companyCode: value });
  } catch (error) {
    console.error("Error validating company code:", error);
    return false;
  }
}

const reactionSchema = new mongoose.Schema({
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  likeCount: { type: Number, default: 0 },
  dislikeCount: { type: Number, default: 0 },
});

const replySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now },
  reactions: { type: reactionSchema, default: () => ({}) },
});

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now },
  replies: [replySchema],
  reactions: { type: reactionSchema, default: () => ({}) },
});

const topicSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  dateStart: {
    type: Date,
    required: true,
    validate: {
      validator: (value) => value >= new Date(),
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
    default: () => ({
      likes: [],
      dislikes: [],
      likeCount: 0,
      dislikeCount: 0,
    }),
  },
  comments: [commentSchema],
});

topicSchema.index({ companyCode: 1 });

topicSchema.methods.like = async function (userId) {
  if (!this.reactions) {
    this.reactions = { likes: [], dislikes: [], likeCount: 0, dislikeCount: 0 };
  }

  if (!this.reactions.likes.some((id) => id.equals(userId))) {
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
  if (!this.reactions) {
    this.reactions = { likes: [], dislikes: [], likeCount: 0, dislikeCount: 0 };
  }

  if (!this.reactions.dislikes.some((id) => id.equals(userId))) {
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

const Topic = mongoose.model("Topic", topicSchema);
module.exports = Topic;
