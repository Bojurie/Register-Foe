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
const testimonyRoutes = require("./routes/testimony");
const electionRoutes = require("./routes/election");
const refreshTokenRoutes = require("./routes/refreshToken");
const pastElectionRoutes = require("./routes/pastElections");
const messageRoutes = require("./routes/messages");
const reminderRoutes = require("./routes/reminder");
const savedElectionRoutes = require("./routes/savedElections");
const companyRoutes = require("./routes/companyRoutes");
const topicRoutes = require("./routes/topic");
const voteRoutes = require("./routes/vote");
const newsRoutes = require("./routes/news");
const verifyTokenRoutes = require("./routes/verifyToken");

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/testimonies", testimonyRoutes);
app.use("/election", electionRoutes);
app.use("/refreshToken", refreshTokenRoutes);
app.use("/savedElection", savedElectionRoutes);
app.use("/reminder", reminderRoutes);
app.use("/pastElection", pastElectionRoutes);
app.use("/message", messageRoutes);
app.use("/company", companyRoutes);
app.use("/vote", voteRoutes);
app.use("/topic", topicRoutes);
app.use("/news", newsRoutes);
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
