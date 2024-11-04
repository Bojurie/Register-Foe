const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

messageSchema.index({ conversation: 1, createdAt: -1 });

messageSchema.index({ readBy: 1 });

messageSchema.virtual("isReadBy", {
  ref: "User",
  localField: "_id",
  foreignField: "readBy",
  justOne: true,
  options: { sort: { createdAt: -1 } },
});

messageSchema.pre("save", function (next) {
  this.content = this.content.trim();
  next();
});

messageSchema.pre("save", function (next) {
  if (this.sender.equals(this.recipient)) {
    return next(new Error("Sender and recipient cannot be the same user."));
  }
  next();
});

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
