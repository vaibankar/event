const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// GET /api/events - Get all events (for Portfolio/Homepage)
router.get('/', eventController.getEvents);

// GET /api/events/:id - Get specific event details (for EventView page)
router.get('/:id', eventController.getEventDetails);

module.exports = router;