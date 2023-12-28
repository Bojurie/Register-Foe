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
const companyRoutes = require('./routes/companyRoutes'); // Adjust the path as needed


app.use("/auth", authRoutes);
app.use("/election", electionRoutes);
app.use("/refreshToken", refreshTokenRoutes);
app.use("/savedElection", savedElectionRoutes);
app.use("/pastElection", pastElectionRoutes);
app.use("/api/company", companyRoutes);



connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
