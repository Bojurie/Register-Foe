const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit the process if unable to connect to MongoDB
  }
};

// Event handling for successful connection
mongoose.connection.once("open", () => {
  console.log("MongoDB connection established");
});

// Event handling for connection errors
mongoose.connection.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});

// Event handling for disconnection
mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

// Close the MongoDB connection when the Node process is terminated
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed");
  process.exit(0);
});

module.exports = { connectDB, mongoose };
