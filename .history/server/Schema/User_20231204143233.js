const mongoose = require("mongoose");
// Rest of your code using mongoose

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  username: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

module.exports = User;