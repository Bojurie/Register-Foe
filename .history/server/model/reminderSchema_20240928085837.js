const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value > new Date();
        },
        message: "Reminder date must be in the future",
      },
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

reminderSchema.pre("save", function (next) {
  if (this.date <= new Date()) {
    this.invalidate("date", "Reminder date must be set in the future");
  }
  next();
});

reminderSchema.methods.markAsCompleted = function () {
  this.isCompleted = true;
  return this.save();
};

reminderSchema.virtual("formattedDate").get(function () {
  return this.date.toLocaleString();
});

const Reminder = mongoose.model("Reminder", reminderSchema);

module.exports = Reminder;
