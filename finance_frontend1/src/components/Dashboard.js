import React, { useEffect, useState } from "react";
import PieChart from "./PieChart";
import LineGraph from "./LineGraph";
import "./Dashboard.css";

const Dashboard = () => {
    const [financialData, setFinancialData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [symbol, setSymbol] = useState("");
    const [stockData, setStockData] = useState(null);
    const [predictedPrice, setPredictedPrice] = useState(null);
    const [filterDays, setFilterDays] = useState(30);

    useEffect(() => {
        fetch("http://localhost:5000/api/financial-data")
            .then((response) => response.json())
            .then((data) => {
                setFinancialData(data);
                setFilteredData(data);
            })
            .catch((error) => console.error("Error fetching MySQL data:", error));
    }, []);

    useEffect(() => {
        if (searchQuery) {
            const filtered = financialData.filter(item =>
                item.state.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredData(filtered);
        } else {
            setFilteredData(financialData);
        }
    }, [searchQuery, financialData]);

    const fetchStockData = async () => {
        if (!symbol) return;
        try {
            const response = await fetch(`http://localhost:5000/api/stock/${symbol}`);
            const data = await response.json();
            setStockData(data);
        } catch (error) {
            console.error("Error fetching stock data:", error);
        }
    };

    const fetchStockPrediction = async () => {
        if (!symbol) return;
        try {
            const response = await fetch(`http://localhost:5000/api/predict-stock/${symbol}`);
            const data = await response.json();
            setPredictedPrice(data.error ? "Prediction not available" : `Predicted Price: $${data.predicted_price}`);
        } catch (error) {
            console.error("Error fetching stock prediction:", error);
            setPredictedPrice("Prediction error");
        }
    };

    const getFilteredStockData = () => {
        if (!stockData) return [];
        const dates = Object.keys(stockData).sort().slice(-filterDays);
        return dates.map((date) => ({
            date,
            open: stockData[date]["1. open"],
            close: stockData[date]["4. close"],
            volume: stockData[date]["5. volume"],
        }));
    };

    return (
        <div className="dashboard-container">
            <h2>📊 Financial Dashboard</h2>

            {/* 📈 Stock Search & Prediction */}
            <div className="search-container">
                <input
                    type="text"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    placeholder="Enter Stock Symbol (AAPL, GOOGL, etc)"
                />
                <button onClick={fetchStockData}>🔍 Search</button>
                <button onClick={fetchStockPrediction}>🤖 Predict</button>
            </div>

            {/* 🎯 Predicted Price Result */}
            {predictedPrice && <p className="prediction-result">{predictedPrice}</p>}

            {/* 📌 Stock Data Filter */}
            <div className="filter-container">
                <label>Filter: </label>
                <select value={filterDays} onChange={(e) => setFilterDays(Number(e.target.value))}>
                    <option value="7">Last 7 Days</option>
                    <option value="30">Last 30 Days</option>
                    <option value="90">Last 3 Months</option>
                    <option value="365">Last 1 Year</option>
                </select>
            </div>

            {/* 📊 Stock Data Table & Line Graph */}
            {stockData && (
                <div className="stock-data-container">
                    <h3>📈 Stock Data for {symbol.toUpperCase()}</h3>
                    <table className="financial-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Open</th>
                                <th>Close</th>
                                <th>Volume</th>
                            </tr>
                        </thead>
                        <tbody>
                            {getFilteredStockData().map((item, index) => (
                                <tr key={index}>
                                    <td>{item.date}</td>
                                    <td>${item.open}</td>
                                    <td>${item.close}</td>
                                    <td>{item.volume.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <LineGraph data={getFilteredStockData()} />
                </div>
            )}

            {/* 🏦 Financial Data Pie Chart */}
            {filteredData.length > 0 ? (
                <>
                    <h3>📊 Financial Insights</h3>
                    <PieChart data={filteredData} />
                </>
            ) : (
                <p className="no-data">No financial data available</p>
            )}
        </div>
    );
};

export default Dashboard;