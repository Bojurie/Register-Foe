const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
require('dotenv').config();
const cors = require("cors");

const loginRoutes = require("./routes/login");
const registerRoutes = require("./routes/register");
const userRoutes = require("./routes/user");
const electionsRoutes = require("./routes/election");


mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

app.use(cors());

// Middleware
app.use(bodyParser.json());

app.use("/login", loginRoutes);
app.use("/register", registerRoutes);
app.use("/user", userRoutes);
app.use("/election", electionsRoutes);

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});