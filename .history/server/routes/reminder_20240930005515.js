const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Reminder = require("../model/reminderSchema");
const verifyToken = require("./verifyToken");
const { body, validationResult } = require("express-validator");

// Helper function to check if an ID is a valid ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Create a new reminder
router.post(
  "/reminders",
  verifyToken,
  [
    body("userId").custom((value) => {
      if (!isValidObjectId(value)) {
        throw new Error("Invalid User ID format");
      }
      return true;
    }),
    body("date").isISO8601().withMessage("Invalid date format"),
    body("text").notEmpty().withMessage("Reminder text is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { userId, date, text } = req.body;
      if (!isValidObjectId(userId)) {
        return res.status(400).json({ error: "Invalid User ID format" });
      }
      const reminder = new Reminder({ userId, date, text });
      await reminder.save();
      res.status(201).json(reminder);
    } catch (error) {
      console.error("Error creating reminder:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Get all reminders for a user
router.get("/reminders/:userId", verifyToken, async (req, res) => {
  const userId = req.params.userId;

  try {
    if (!isValidObjectId(userId)) {
      return res.status(400).json({ error: "Invalid User ID format" });
    }

    const reminders = await Reminder.find({ userId });
    if (!reminders.length) {
      return res
        .status(404)
        .json({ error: "No reminders found for this user" });
    }

    res.status(200).json(reminders);
  } catch (error) {
    console.error("Error fetching reminders:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete reminder
router.delete("/reminders/:reminderId", verifyToken, async (req, res) => {
  const { reminderId } = req.params;

  try {
    if (!isValidObjectId(reminderId)) {
      return res.status(400).json({ error: "Invalid Reminder ID format" });
    }

    const deletedReminder = await Reminder.findByIdAndDelete(reminderId);
    if (!deletedReminder) {
      return res.status(404).json({ error: "Reminder not found" });
    }

    res.status(200).json({ message: "Reminder deleted successfully" });
  } catch (error) {
    console.error("Error deleting reminder:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
