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
  verifyToken, // Middleware to authenticate and verify user
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
      return res.status(400).json({ errors: errors.array() }); // Return validation errors
    }

    const { userId, date, text } = req.body;

    try {
      // Validate the userId format again in case of manual request
      if (!isValidObjectId(userId)) {
        return res.status(400).json({ error: "Invalid User ID format" });
      }

      // Create and save the new reminder
      const reminder = new Reminder({ userId, date, text });
      await reminder.save();

      res.status(201).json({
        message: "Reminder created successfully!",
        reminder, // Return created reminder object
      });
    } catch (error) {
      console.error("Error creating reminder:", error);

      res.status(500).json({
        error: "Internal Server Error",
        message: error.message,
      });
    }
  }
);

// Get all reminders for a user
router.get("/reminders/:userId", async (req, res) => {
  const userId = req.params.userId;

  if (!mongoose.isValidObjectId(userId)) {
    return res.status(400).json({ error: "Invalid User ID format" });
  }

  try {
    const reminders = await Reminder.find({ userId });

    if (!reminders.length) {
      return res
        .status(404)
        .json({ error: "No reminders found for this user" });
    }

    const currentDate = new Date();
    const activeReminders = [];

    for (const reminder of reminders) {
      if (new Date(reminder.date) < currentDate) {
        await Reminder.findByIdAndDelete(reminder._id); 
      } else {
        activeReminders.push(reminder); 
      }
    }

    res.status(200).json(activeReminders);
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
