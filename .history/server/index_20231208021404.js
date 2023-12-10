const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

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
const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
