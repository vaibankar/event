import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:3001/api', // Connects to the backend server
});

export const fetchAllEvents = async () => {
    try {
        const response = await API.get('/events');
        return response.data;
    } catch (error) {
        console.error("Error fetching events:", error);
        return [];
    }
};

export const fetchEventDetails = async (id) => {
    try {
        const response = await API.get(`/events/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching event ${id}:`, error);
        return null;
    }
};