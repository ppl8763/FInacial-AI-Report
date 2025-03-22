import React, { useState } from "react";
import "./Economy.css";
import GDPDetails from "./GDPDetails"; // ✅ Import GDPDetails Component

const Economy = () => {
    const [selectedMetric, setSelectedMetric] = useState(""); 
    const [showGDPDetails, setShowGDPDetails] = useState(false); // ✅ Track GDPDetails visibility

    const economyData = {
        GDP: "Gross Domestic Product (GDP) is the total market value of all final goods and services produced in a country in a given period.",
        GNP: "Gross National Product (GNP) is the total economic output of a country's residents, including income earned abroad.",
        Inflation: "Inflation is the rate at which the general level of prices for goods and services rises, eroding purchasing power.",
        Unemployment: "The unemployment rate represents the percentage of the labor force that is without work but actively seeking employment.",
        Forex: "Foreign Exchange (Forex) refers to the global marketplace for buying and selling currencies.",
        TradeBalance: "Trade Balance is the difference between a country's exports and imports.",
    };

    return (
        <div className="economy-container">
            <h2>🌍 Global Economic Overview</h2>
            <div className="card-container">
                {Object.keys(economyData).map((metric) => (
                    <div
                        key={metric}
                        className={`card ${selectedMetric === metric ? "active" : ""}`}
                        onClick={() => {
                            setSelectedMetric(metric);
                            console.log(`Clicked on: ${metric}`); // ✅ Check which card is clicked
                            if (metric === "GDP") {
                                setShowGDPDetails(true); // ✅ Open GDPDetails
                                console.log("Opening GDP Details..."); // ✅ Debugging
                            }
                        }}
                    >
                        <h3>📊 {metric}</h3>
                    </div>
                ))}
            </div>

            {/* ✅ Show GDPDetails when GDP is selected */}
            {showGDPDetails && <GDPDetails onClose={() => {
                setShowGDPDetails(false);
                console.log("Closing GDP Details...");
            }} />}
        </div>
    );
};

export default Economy;
