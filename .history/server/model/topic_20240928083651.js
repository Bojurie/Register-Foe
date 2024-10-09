const mongoose = require("mongoose");
const Company = require("./companySchema");

async function validateCompanyCode(value) {
  const companyExists = await Company.exists({ companyCode: value });
  return companyExists;
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

topicSchema.pre("save", function (next) {
  this.title = this.title.trim();
  this.description = this.description.trim();
  this.likeCount = this.likes.length;
  this.dislikeCount = this.dislikes.length;
  next();
});


topicSchema.methods.like = function (userId) {
  if (!this.likes.includes(userId)) {
    this.likes.push(userId);
    this.dislikes = this.dislikes.filter((id) => !id.equals(userId)); 
  }
  this.likeCount = this.likes.length;
  this.dislikeCount = this.dislikes.length;
  return this.save();
};

topicSchema.methods.dislike = function (userId) {
  if (!this.dislikes.includes(userId)) {
    this.dislikes.push(userId);
    this.likes = this.likes.filter((id) => !id.equals(userId)); 
  }
  this.likeCount = this.likes.length;
  this.dislikeCount = this.dislikes.length;
  return this.save();
};

topicSchema.methods.addComment = function (userId, text) {
  this.comments.push({ user: userId, text });
  return this.save();
};

const Topic = mongoose.model("Topic", topicSchema);

module.exports = Topic;
