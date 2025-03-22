import React from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import "./LineGraph.css";

const LineGraph = ({ data }) => {
    if (!data || data.length === 0) {
        return <p className="no-data">No financial data available</p>;
    }

    // ✅ Ensure Data is in Correct Format
    const chartData = {
        labels: data.map((item) => item.date),
        datasets: [
            {
                label: "Stock Closing Price",
                data: data.map((item) => parseFloat(item.close.replace("$", ""))), // ✅ FIX: Convert to Number
                borderColor: "#007bff",
                backgroundColor: "rgba(0, 123, 255, 0.2)",
                fill: true,
                borderWidth: 2,
                pointRadius: 4,
                pointBackgroundColor: "#007bff",
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: { title: { display: true, text: "Date" } },
            y: { title: { display: true, text: "Close Price ($)" }, beginAtZero: false },
        },
        plugins: { legend: { position: "bottom" } },
    };

    return (
        <div className="line-graph-container">
            <h3>📉 Stock Price Trends</h3>
            <Line data={chartData} options={options} />
        </div>
    );
};

export default LineGraph;
