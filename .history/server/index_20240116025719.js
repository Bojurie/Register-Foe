const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const { connectDB } = require("./config/database");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.use(bodyParser.json());

// Import and use routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const electionRoutes = require("./routes/election");
const refreshTokenRoutes = require("./routes/refreshToken");
const pastElectionRoutes = require("./routes/pastElections");
const savedElectionRoutes = require("./routes/savedElections");
const companyRoutes = require("./routes/companyRoutes");
const topicRoutes = require("./routes/topic");
const verifyTokenRoutes = require("./routes/verifyToken");

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/election", electionRoutes);
app.use("/refreshToken", refreshTokenRoutes);
app.use("/savedElection", savedElectionRoutes);
app.use("/pastElection", pastElectionRoutes);
app.use("/company", companyRoutes);
app.use("/topic", topicRoutes);
app.use("/verifyToken", verifyTokenRoutes);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

startServer();
