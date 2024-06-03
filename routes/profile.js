const express = require('express');
const User = require('../models/user_model');
const authenticateToken = require('../middleware/authenticateToken');

const router = express.Router();

router.put('/profile', authenticateToken, async (req, res) => {
  const { phone } = req.body;
  const userId = req.user.userId;

  await User.findByIdAndUpdate(userId, { phone });
  res.status(200).json({ message: 'Profile updated successfully' });
});

module.exports = router;
