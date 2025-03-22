import React from "react";
import { Pie } from "react-chartjs-2";
import "chart.js/auto"; // Ensure Chart.js auto-detects required components
import "./PieChart.css"; // ✅ Correct path


const PieChart = ({ data }) => {
    if (!data || data.length === 0) {
        return <p className="no-data">No financial data available</p>;
    }

    const chartData = {
        labels: data.map((item) => item.stock_symbol),
        datasets: [
            {
                data: data.map((item) => item.close_price),
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"],
                hoverBackgroundColor: ["#FF4364", "#1592EB", "#F4C430", "#2FAFAF", "#8255FF", "#FF7F20"],
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    font: {
                        size: 14,
                    },
                    color: "#333",
                },
            },
        },
    };

    return (
        <div className="pie-chart-container">
            <Pie data={chartData} options={options} />
        </div>
    );
};

export default PieChart;
