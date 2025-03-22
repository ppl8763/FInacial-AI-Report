import React from "react";
import { Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";
import "./GDPDetails.css"; // Custom CSS

const GDPDetails = () => {
    // 🔹 Indian States GSDP Data (All States Included)
    const gdpData = [
        { state: "Maharashtra", gsdp: 32.24 },
        { state: "Tamil Nadu", gsdp: 20.91 },
        { state: "Gujarat", gsdp: 18.85 },
        { state: "Karnataka", gsdp: 18.05 },
        { state: "Uttar Pradesh", gsdp: 17.91 },
        { state: "West Bengal", gsdp: 14.70 },
        { state: "Rajasthan", gsdp: 11.33 },
        { state: "Telangana", gsdp: 11.08 },
        { state: "Andhra Pradesh", gsdp: 10.81 },
        { state: "Kerala", gsdp: 9.78 },
        { state: "Madhya Pradesh", gsdp: 9.62 },
        { state: "Haryana", gsdp: 9.40 },
        { state: "Delhi", gsdp: 8.56 },
        { state: "Bihar", gsdp: 6.86 },
        { state: "Punjab", gsdp: 6.44 },
        { state: "Odisha", gsdp: 5.85 },
        { state: "Assam", gsdp: 4.09 },
        { state: "Jharkhand", gsdp: 3.83 },
        { state: "Chhattisgarh", gsdp: 3.62 },
        { state: "Uttarakhand", gsdp: 2.93 }
    ];

    // 📊 Bar Chart Data
    const barChartData = {
        labels: gdpData.map((item) => item.state),
        datasets: [
            {
                label: "GSDP (₹ Lakh Crore)",
                data: gdpData.map((item) => item.gsdp),
                backgroundColor: "rgba(54, 162, 235, 0.7)",
                borderColor: "#ffffff",
                borderWidth: 2,
            },
        ],
    };

    // 🍕 Pie Chart Data
    const pieChartData = {
        labels: gdpData.map((item) => item.state),
        datasets: [
            {
                data: gdpData.map((item) => item.gsdp),
                backgroundColor: [
                    "#007bff", "#28a745", "#ffc107", "#dc3545", "#17a2b8",
                    "#6610f2", "#fd7e14", "#6c757d", "#20c997", "#e83e8c",
                    "#ff5733", "#c70039", "#900c3f", "#581845", "#00a896",
                    "#ff9f1c", "#d81159", "#8f2d56", "#218380", "#73d2de"
                ],
                borderColor: "#ffffff",
                borderWidth: 2,
            },
        ],
    };

    return (
        <div className="gdp-container">
            <h2>📊 Indian States GDP Overview</h2>

            {/* 🔹 Flex Container (Table + Charts) */}
            <div className="gdp-content">
                {/* 📋 GDP Table */}
                <div className="gdp-table">
                    <h3>📑 GDP Data</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>State</th>
                                <th>GSDP (₹ Lakh Crore)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {gdpData.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.state}</td>
                                    <td>{item.gsdp}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* 📊 GDP Charts */}
                <div className="gdp-charts">
                    {/* 📈 Bar Chart */}
                    <div className="chart-container">
                        <h3>📊 GDP Bar Chart</h3>
                        <Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                    </div>

                    {/* 🍕 Pie Chart */}
                    <div className="chart-container">
                        <h3>🍕 GDP Pie Chart</h3>
                        <Pie data={pieChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GDPDetails;
