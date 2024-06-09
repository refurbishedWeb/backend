require("dotenv").config();

const config = require("./config.json");
const mongoose = require("mongoose");

mongoose.connect(config.connectionString);

const express = require("express");
const cors = require("cors");
const app = express();

const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./middleware/authenticateToken");
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');

app.use(express.json());
app.use(cors({
  origin: "*",
})
);
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);

app.get("/", (req, res) => {
  res.json({data: "Hello World!"});
});

// Create Account
app.post("/create-account", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username) {
    return res.status(400).json({ error: true, message: "Username is required" });
  }
  if (!email) {
    return res.status(400).json({ error: true, message: "Email is required" });
  }
  if (!password) {
    return res.status(400).json({ error: true, message: "Password is required" });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

module.exports = app;