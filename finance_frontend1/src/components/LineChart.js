import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import axios from "axios";

const LineChart = ({ stockSymbol }) => {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        if (!stockSymbol) return;

        axios.get(`http://localhost:5000/api/financial-data/${stockSymbol}`)
            .then(response => {
                console.log("Stock Data:", response.data);

                const sortedData = response.data.sort((a, b) => new Date(a.date) - new Date(b.date));

                setChartData({
                    labels: sortedData.map((item) => item.date),
                    datasets: [
                        {
                            label: `${stockSymbol} Closing Price`,
                            data: sortedData.map((item) => Number(item.close_price)),
                            borderColor: "#007bff",
                            backgroundColor: "rgba(0, 123, 255, 0.2)",
                            fill: true,
                            borderWidth: 2,
                            pointRadius: 4,
                            pointBackgroundColor: "#007bff",
                        },
                    ],
                });
            })
            .catch(error => console.error("Error fetching stock data:", error));
    }, [stockSymbol]);

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
        <div className="line-chart-container">
            <h3>📈 {stockSymbol} Stock Trends</h3>
            {chartData ? <Line data={chartData} options={options} /> : <p>Loading...</p>}
        </div>
    );
};

export default LineChart;
