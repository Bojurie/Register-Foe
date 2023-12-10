const bcrypt = require("bcrypt");
const User = require("../model/User");

const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, username, password } = req.body;
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ error: "Username already taken" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      email,
      username,
      password: hashedPassword,
    });
    await newUser.save();

    res.status(201).json({ id: newUser.id, username: newUser.username });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const loginUser = async (req, res) => {
  try {
    // Implementation for user login
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({ id: user.id, username: user.username });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getUserDetails = async (req, res) => {
  try {
    const { id, firstName, lastName } = req.user;
    res.json({ id, firstName, lastName });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { registerUser, loginUser, getUserDetails };