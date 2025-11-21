const Event = require('../models/Event');
// Mock Data for initial testing (replace with actual DB calls later)
const mockEvents = require('../config/mockData'); 

exports.getEvents = async (req, res) => {
    try {
        // In a real app: const events = await Event.find({});
        res.json(mockEvents); // Using mock data for simplicity
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getEventDetails = async (req, res) => {
    try {
        // In a real app: const event = await Event.findById(req.params.id);
        const event = mockEvents.find(e => e.id === parseInt(req.params.id));
        if (event) {
            res.json(event);
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};