import React from 'react';
import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
  return (
    <div style={styles.card}>
      <img src={event.bundle.photos[0] || 'placeholder.jpg'} alt={event.title} style={styles.image} />
      <h3 style={styles.title}>{event.title}</h3>
      <p style={styles.date}>{new Date(event.date).toLocaleDateString()}</p>
      <p style={styles.location}>{event.location}</p>
      <Link to={`/portfolio/${event.id}`} style={styles.link}>
        View Event Bundle »
      </Link>
    </div>
  );
};

const styles = {
    card: { border: '1px solid #ddd', padding: '15px', borderRadius: '8px', margin: '10px', width: '300px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
    image: { width: '100%', height: '180px', objectFit: 'cover', borderRadius: '4px' },
    title: { color: '#333', fontSize: '1.4em' },
    date: { color: '#555', fontSize: '0.9em' },
    location: { color: '#777', fontSize: '0.9em' },
    link: { color: '#007bff', textDecoration: 'none', display: 'block', marginTop: '10px' }
};

export default EventCard;