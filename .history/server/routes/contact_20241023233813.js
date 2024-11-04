const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  // Validate input
  if (!name || !email || !phone || !subject || !message) {
    return res.status(400).json({ message: "Please fill out all fields" });
  }

  // Here you would handle the data (e.g., save to a database or send an email)
  console.log(`Contact Form Submission:
        Name - ${name}, 
        Email - ${email}, 
        Phone - ${phone}, 
        Subject - ${subject}, 
        Message - ${message}`);

  res
    .status(200)
    .json({ message: "Message received. We will get back to you shortly!" });
});

module.exports = router;