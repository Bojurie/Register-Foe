const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      // Replace useNewUrlParser and useUnifiedTopology with the new options
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB Connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
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
