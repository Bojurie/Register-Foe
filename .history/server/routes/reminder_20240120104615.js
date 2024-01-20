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
router.delete("/reminders/:reminderId", async (req, res) => {
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

