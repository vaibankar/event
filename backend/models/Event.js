// Using Mongoose to define the schema for an Event
const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    status: { type: String, enum: ['Upcoming', 'Completed', 'Cancelled'], default: 'Upcoming' },
    description: String,
    // The "bundle" data structure
    bundle: {
        prizes: [String],        // List of prizes awarded
        sfx: String,             // Description of SFX/Tech Setup
        photos: [String],        // Image URLs for the gallery
        client: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);