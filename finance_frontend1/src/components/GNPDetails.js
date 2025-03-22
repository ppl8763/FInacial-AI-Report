import React from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import "./GNPDetails.css"; // Custom CSS

const GNPDetails = () => {
    // 🌎 **Top 10 Countries by GDP (in Trillions USD)**
    const gdpData = [
        { country: "United States", gdp: 30.34 },
        { country: "China", gdp: 19.53 },
        { country: "Germany", gdp: 4.92 },
        { country: "Japan", gdp: 4.38 },
        { country: "India", gdp: 4.27 },
        { country: "United Kingdom", gdp: 3.73 },
        { country: "France", gdp: 3.28 },
        { country: "Italy", gdp: 2.45 },
        { country: "Canada", gdp: 2.33 },
        { country: "Brazil", gdp: 2.30 }
    ];

    return (
        <div className="gnp-details">
            <h2>🌍 Global GDP Rankings (2024)</h2>

            {/* 📌 GDP Table */}
            <table>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Country</th>
                        <th>GDP (USD Trillion)</th>
                    </tr>
                </thead>
                <tbody>
                    {gdpData.map((item, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.country}</td>
                            <td>{item.gdp}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* 📊 GDP Bar Chart */}
            <div className="chart-container">
                <h3>📈 GDP of Top 10 Economies</h3>
                <Bar
                    data={{
                        labels: gdpData.map((item) => item.country),
                        datasets: [
                            {
                                label: "GDP (USD Trillion)",
                                data: gdpData.map((item) => item.gdp),
                                backgroundColor: "rgba(75, 192, 192, 0.6)",
                            },
                        ],
                    }}
                    options={{
                        indexAxis: "y", // ✅ Horizontal bars for better readability
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            x: {
                                beginAtZero: true,
                                title: {
                                    display: true,
                                    text: "GDP (USD Trillion)",
                                    font: { size: 14 },
                                },
                            },
                            y: {
                                ticks: {
                                    font: { size: 12 },
                                },
                            },
                        },
                        plugins: {
                            legend: { display: false }, // ✅ Hide legend for simplicity
                        },
                    }}
                />
            </div>
        </div>
    );
};

export default GNPDetails;
