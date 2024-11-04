const express = require("express");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const router = express.Router();

// OAuth2 setup
const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2(
  process.env.GMAIL_CLIENT_ID, // Client ID from Google Developer Console
  process.env.GMAIL_CLIENT_SECRET, // Client Secret from Google Developer Console
  "https://developers.google.com/oauthplayground" // Redirect URL (set this up in OAuth2 playground)
);

oauth2Client.setCredentials({
  refresh_token: process.env.GMAIL_REFRESH_TOKEN,
});

// Contact form POST route
router.post("/", async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  // Validate input
  if (!name || !email || !phone || !subject || !message) {
    return res.status(400).json({ message: "Please fill out all fields" });
  }

  try {
    const accessToken = await oauth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.GMAIL_USER, // Your Gmail account
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
        accessToken: accessToken.token, // Get access token from OAuth2 client
      },
    });

    const mailOptions = {
      from: `Your Website <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER, // Send to your Gmail
      subject: `New Contact Form Submission: ${subject}`,
      text: `
        Name: ${name}
        Email: ${email}
        Phone: ${phone}
        Subject: ${subject}
        Message: ${message}
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return res
      .status(200)
      .json({
        message: "Message sent successfully. We will get back to you shortly!",
      });
  } catch (error) {
    console.error("Error sending email:", error);
    return res
      .status(500)
      .json({ message: "Failed to send message. Please try again later." });
  }
});

module.exports = router;
