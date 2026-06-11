const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// @desc    Get dashboard details (Protected)
// @route   GET /api/dashboard
// @access  Private
router.get('/', protect, (req, res) => {
  res.status(200).json({
    message: 'Welcome to the secure dashboard! This data is fetched from a protected API endpoint.',
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      createdAt: req.user.createdAt
    }
  });
});

module.exports = router;
