const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const { connectDB } = require("./config/database");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
const authRoutes = require("./routes/auth");
const electionRoutes = require("./routes/election");
const refreshTokenRoutes = require("./routes/refreshToken");
const pastElectionRoutes = require("./routes/pastElections");
const savedElectionRoutes = require("./routes/savedElections");

app.use("/auth", authRoutes);
app.use("/api/election", electionRoutes);
app.use("/api/refreshToken", refreshTokenRoutes);
app.use("/api/savedElection", savedElectionRoutes);
app.use("/api/pastElection", pastElectionRoutes);



connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
