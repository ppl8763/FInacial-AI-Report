import React from "react";
import { Line, Bar, Pie } from "react-chartjs-2";
import { useNavigate } from "react-router-dom"; // 📌 React Router
import "chart.js/auto";
import "./EconomyDashboard.css";

const EconomyDashboard = () => {
    const navigate = useNavigate(); // 📌 Navigation function

    // 📊 Dummy Data
    const gdpData = {
        labels: ["2018", "2019", "2020", "2021", "2022", "2023"],
        datasets: [
            {
                label: "GDP (in Trillions USD)",
                data: [21.0, 22.1, 20.5, 23.0, 24.2, 25.5],
                borderColor: "#007bff",
                backgroundColor: "rgba(0, 123, 255, 0.2)",
                fill: true,
                borderWidth: 2,
                pointRadius: 4,
                pointBackgroundColor: "#007bff",
            },
        ],
    };

    const gnpData = {
        labels: ["2018", "2019", "2020", "2021", "2022", "2023"],
        datasets: [
            {
                label: "GNP (in Trillions USD)",
                data: [19.5, 20.2, 19.0, 21.3, 22.5, 23.8],
                borderColor: "#28a745",
                backgroundColor: "rgba(40, 167, 69, 0.2)",
                fill: true,
                borderWidth: 2,
                pointRadius: 4,
                pointBackgroundColor: "#28a745",
            },
        ],
    };

    const inflationData = {
        labels: ["2018", "2019", "2020", "2021", "2022", "2023"],
        datasets: [
            {
                label: "Inflation Rate (%)",
                data: [2.1, 1.8, 1.2, 5.4, 6.2, 4.5],
                backgroundColor: ["#ffcc00", "#ff6600", "#ff3300", "#ff0000", "#cc0000", "#990000"],
            },
        ],
    };

    const gdpGrowthData = {
        labels: ["2018", "2019", "2020", "2021", "2022", "2023"],
        datasets: [
            {
                label: "GDP Growth Rate (%)",
                data: [2.9, 2.3, -3.4, 5.9, 2.1, 2.5],
                backgroundColor: "#ff5733",
            },
        ],
    };

    return (
        <div className="economy-dashboard">
            <h2>📊 Global Economy Insights</h2>
            
            <div className="chart-container">
                <div className="chart-card">
                    <h3>📈 GDP Trends</h3>
                    <Line data={gdpData} />
                    <button className="details-button" onClick={() => navigate("/gdp-details")}>
                        View Details
                    </button>
                </div>

                <div className="chart-card">
                    <h3>📊 GNP Trends</h3>
                    <Line data={gnpData} />
                    <button className="details-button" onClick={() => navigate("/gnp-details")}>
                        View Details
                    </button>
                </div>

                <div className="chart-card">
                    <h3>📉 GDP Growth Rate</h3>
                    <Bar data={gdpGrowthData} />
                    <button className="details-button" onClick={() => navigate("/gdp-growth-details")}>
                        View Details
                    </button>
                </div>

                <div className="chart-card">
                    <h3>💰 Inflation Rate</h3>
                    <Pie data={inflationData} />
                    <button className="details-button" onClick={() => navigate("/inflation-details")}>
                        View Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EconomyDashboard;
