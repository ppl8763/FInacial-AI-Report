import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-brand">
                {/* Add a logo or icon here */}
                <img src="https://i.ebayimg.com/images/g/9vMAAOSw4KJiX9Qz/s-l1200.jpg" alt="Logo" className="navbar-logo" />
                <h2>AI Financial Insights</h2>
            </div>
            <ul className="navbar-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/economy">Economy</Link></li> {/* ✅ Add Economy Page */}
                <li><button className="cta-button">Get Started</button></li> {/* Call-to-action button */}
            </ul>
        </nav>
    );
};

export default Navbar;