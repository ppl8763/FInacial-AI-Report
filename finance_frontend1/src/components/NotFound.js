import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div style={{ textAlign: "center", padding: "50px" }}>
            <h2>⚠️ Page Not Found</h2>
            <p>The page you are looking for does not exist.</p>
            <button onClick={() => navigate("/")} style={{
                padding: "10px 20px",
                background: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "16px"
            }}>
                Go to Home
            </button>
        </div>
    );
};

export default NotFound;
