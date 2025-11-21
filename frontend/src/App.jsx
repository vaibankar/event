import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Portfolio from './pages/Portfolio';
import EventView from './pages/EventView';

const Navbar = () => (
    <nav style={navStyles.navbar}>
        <div style={navStyles.brand}>EventPro</div>
        <div style={navStyles.links}>
            <Link to="/" style={navStyles.link}>Home</Link>
            <Link to="/portfolio" style={navStyles.link}>Portfolio</Link>
        </div>
    </nav>
);

const navStyles = {
    navbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 40px', background: '#1a1a1a', color: 'white' },
    brand: { fontSize: '1.5em', fontWeight: 'bold' },
    links: { display: 'flex', gap: '20px' },
    link: { color: 'white', textDecoration: 'none', fontSize: '1.1em' }
};

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* The main page showcasing all events */}
        <Route path="/portfolio" element={<Portfolio />} />
        {/* Detail page for a specific event bundle */}
        <Route path="/portfolio/:id" element={<EventView />} />
        {/* Placeholder for the home page */}
        <Route path="/" element={<div style={{padding: '50px', textAlign: 'center'}}><h1>Welcome to Professional Event Management</h1><p>Check out our <Link to="/portfolio">Portfolio</Link>!</p></div>} />
      </Routes>
    </Router>
  );
}

export default App;