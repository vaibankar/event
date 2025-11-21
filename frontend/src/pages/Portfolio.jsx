import React, { useState, useEffect } from 'react';
import { fetchAllEvents } from '../services/API';
import EventCard from '../components/Events/EventCard';

const Portfolio = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      const data = await fetchAllEvents();
      setEvents(data);
      setLoading(false);
    };
    loadEvents();
  }, []);

  if (loading) return <h2>Loading Professional Event Portfolio...</h2>;
  if (events.length === 0) return <h2>No events found.</h2>;

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>✨ Our Event Portfolio</h1>
      <p style={styles.subheader}>Explore the full bundles from our most successful projects.</p>
      <div style={styles.grid}>
        {events.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};

const styles = {
    container: { padding: '20px', textAlign: 'center' },
    header: { color: '#1a1a1a', borderBottom: '2px solid #007bff', paddingBottom: '10px' },
    subheader: { color: '#555', marginBottom: '30px' },
    grid: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }
};

export default Portfolio;