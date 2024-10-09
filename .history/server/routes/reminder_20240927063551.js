const express = require("express");
const router = express.Router();
const Reminder = require("../model/reminderSchema");
const verifyToken = require("./verifyToken");
const { body, validationResult } = require("express-validator");

// Create a new reminder
router.post(
  "/reminders",
  verifyToken,
  [
    body("userId").notEmpty().withMessage("User ID is required"),
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
  try {
    const userId = req.params.userId;
    const reminders = await Reminder.find({ userId });
    res.json(reminders);
  } catch (error) {
    console.error("Error fetching reminders:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete reminder
router.delete("/reminders/:reminderId", verifyToken, async (req, res) => {
  const { reminderId } = req.params;

  try {
    const deletedReminder = await Reminder.findByIdAndDelete(reminderId);
    if (deletedReminder) {
      res.status(204).end();
    } else {
      res.status(404).json({ error: "Reminder not found" });
    }
  } catch (error) {
    console.error("Error deleting reminder:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
