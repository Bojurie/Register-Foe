const express = require("express");
const router = express.Router();
const Reminder = require('../model/reminderSchema')
const verifyToken = require("./verifyToken");

app.post("/api/reminders", async (req, res) => {
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
app.get("/api/reminders/:userId", async (req, res) => {
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
app.delete("/api/reminders/:reminderId", async (req, res) => {
  try {
    const reminderId = req.params.reminderId;
    await Reminder.findByIdAndDelete(reminderId);
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});


module.exports = router;

