const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/user_model');
const { sendVerificationEmail } = require('../utilities');

const router = express.Router();

// Registration
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const userExists = await User.findOne({ $or: [{ username }, { email }] });
  if (userExists) {
    return res.status(400).json({ message: 'Username or email already taken' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationToken = uuidv4();

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    verificationToken,
    isVerified: false,
  });
  await newUser.save();

  sendVerificationEmail(email, verificationToken);
  res.status(201).json({ message: 'User registered. Please verify your email.' });
});

// Email Verification
router.get('/verify-email', async (req, res) => {
  const { token } = req.query;
  const user = await User.findOne({ verificationToken: token });
  if (!user) {
    return res.status(400).json({ message: 'Invalid or expired token' });
  }

  user.isVerified = true;
  user.verificationToken = null;
  await user.save();

  res.status(200).json({ message: 'Email verified. You can now log in.' });
});

// Login
router.post('/login', async (req, res) => {
  const { identifier, password } = req.body;
  if (!identifier || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const user = await User.findOne({ $or: [{ username: identifier }, { email: identifier }, { phone: identifier }] });
  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  if (!user.isVerified) {
    return res.status(400).json({ message: 'Please verify your email first' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.status(200).json({ token });
});

module.exports = router;