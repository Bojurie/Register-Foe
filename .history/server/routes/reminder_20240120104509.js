const express = require("express");
const router = express.Router();
const Reminder = require('../model/reminderSchema')
const verifyToken = require("./verifyToken");

router.post("/reminders", verifyToken, async (req, res) => {
  try {
    const { userId, date, text } = req.body;
    const reminder = new Reminder({ userId, date, text });
    await reminder.save();
    res.status(201).json(reminder);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Get all reminders for a user
router.get("/reminders/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const reminders = await Reminder.find({ userId });
    res.json(reminders);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Delete reminder
router.delete("/reminders/:reminderId", (req, res) => {
  const { reminderId } = req.params;
  const reminderIndex = reminders.findIndex(
    (reminder) => reminder.id === reminderId
  );

  if (reminderIndex !== -1) {
    reminders.splice(reminderIndex, 1);
    res.status(204).end(); // No content for a successful deletion
  } else {
    res.status(404).json({ error: "Reminder not found" });
  }
});


module.exports = router;

