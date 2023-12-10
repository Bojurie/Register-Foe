const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const electionRoutes = require("./routes/election");

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/election", electionRoutes);

// Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
