import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchEventDetails } from '../services/API';

const EventView = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadEvent = async () => {
            const data = await fetchEventDetails(id);
            setEvent(data);
            setLoading(false);
        };
        loadEvent();
    }, [id]);

    if (loading) return <h2>Loading Event Bundle...</h2>;
    if (!event) return <h2>Event ID: {id} not found.</h2>;

    const { bundle } = event;

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>{event.title} Details</h1>
            <p><strong>Date:</strong> {new Date(event.date).toDateString()}</p>
            <p><strong>Location:</strong> {event.location}</p>

            <div style={styles.section}>
                <h2>🏆 Prize Breakdown</h2>
                {bundle.prizes.length > 0 ? (
                    <ul style={styles.list}>
                        {bundle.prizes.map((prize, index) => <li key={index}>{prize}</li>)}
                    </ul>
                ) : <p>No prizes recorded for this event.</p>}
            </div>

            <div style={styles.section}>
                <h2>🔊 SFX & Technical Setup</h2>
                <p>{bundle.sfx || "Detailed technical setup information unavailable."}</p>
            </div>

            <div style={styles.section}>
                <h2>📸 Photo Gallery</h2>
                <div style={styles.gallery}>
                    {bundle.photos.map((photoUrl, index) => (
                        <img key={index} src={photoUrl} alt={`Gallery image ${index + 1}`} style={styles.photo} />
                    ))}
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: { padding: '40px', maxWidth: '1000px', margin: '0 auto' },
    title: { color: '#007bff', borderBottom: '3px solid #f0f0f0', paddingBottom: '10px' },
    section: { marginTop: '30px', padding: '20px', border: '1px solid #eee', borderRadius: '8px' },
    list: { listStyle: 'disc', marginLeft: '20px' },
    gallery: { display: 'flex', flexWrap: 'wrap', gap: '15px' },
    photo: { width: '200px', height: '150px', objectFit: 'cover', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }
};

export default EventView;