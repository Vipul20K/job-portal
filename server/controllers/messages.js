const express = require('express');
const router = express.Router();
const Message = require('../models/message');

// Fetch last N messages for a room
router.get('/:room', async (req, res) => {
  const { room } = req.params;
  try {
    const messages = await Message.find({ room })
      .sort({ createdAt: 1 })
      .limit(200);
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
