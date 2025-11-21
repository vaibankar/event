const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config({ path: './config/.env' }); // Load .env file
const eventRoutes = require('./routes/eventRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Database Connection (using mock data for now, but keeping structure)
/*
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));
*/

// Middleware
app.use(cors()); 
app.use(express.json());

// Main Routes
app.use('/api/events', eventRoutes);

app.get('/', (req, res) => {
    res.send('Event Management API is ready.');
});

app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});

// Mock data used in controller (put this in backend/config/mockData.js)
// NOTE: For brevity, this mock data is added here, but it should be in `backend/config/mockData.js`
/*
module.exports = [
    {
        id: 1, title: "Tech Summit 2024", date: "2024-11-15", location: "Convention Hall",
        bundle: { prizes: ["$5k Winner", "Best Speaker"], sfx: "LED Walls, Fog Machine", photos: ["/photo1.jpg"] }
    },
    {
        id: 2, title: "Charity Gala", date: "2024-12-05", location: "Grand Ballroom",
        bundle: { prizes: ["Top Donor Award"], sfx: "Ambient Lighting, Jazz Setup", photos: ["/photo2.jpg"] }
    }
];
*/