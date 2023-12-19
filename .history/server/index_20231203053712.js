const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");


const app = express();


// MongoDB connection (replace 'your-mongodb-uri' with your actual MongoDB URI)
mongoose.connect("your-mongodb-uri", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});



// Middleware
app.use(bodyParser.json());

// Register route


// Login route

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});