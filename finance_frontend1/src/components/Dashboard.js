import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PieChart from "./PieChart";
import LineGraph from "./LineGraph";
import "./Dashboard.css";

const Dashboard = () => {
    const navigate = useNavigate();
    const [financialData, setFinancialData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [symbol, setSymbol] = useState("");
    const [stockData, setStockData] = useState(null);
    const [predictedPrice, setPredictedPrice] = useState(null);
    const [filterDays, setFilterDays] = useState(30);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/financial-data");
                const data = await response.json();
                setFinancialData(data);
                setFilteredData(data);
            } catch (error) {
                console.error("Error fetching MySQL data:", error);
                setError("Failed to load financial data");
            }
        };
        fetchData();
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
        if (!symbol) {
            setError("Please enter a stock symbol");
            return;
        }
        
        setIsLoading(true);
        setError(null);
        
        try {
            const response = await fetch(`http://localhost:5000/api/stock/${symbol}`);
            if (!response.ok) throw new Error("Failed to fetch stock data");
            const data = await response.json();
            setStockData(data);
        } catch (error) {
            console.error("Error fetching stock data:", error);
            setError(error.message);
        } finally {
            setIsLoading(false);
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

            {/* Stock Search & Navigation */}
            <div className="search-container">
                <input
                    type="text"
                    value={symbol}
                    onChange={(e) => {
                        setSymbol(e.target.value);
                        setError(null);
                    }}
                    placeholder="Enter Stock Symbol (AAPL, GOOGL, TESL etc)"
                    disabled={isLoading}
                />
                <button 
                    onClick={fetchStockData}
                    disabled={isLoading || !symbol}
                >
                    {isLoading ? "⌛ Loading..." : "🔍 Search"}
                </button>
                <button 
                    onClick={() => navigate(`/stock-prediction/${symbol}`)}
                    disabled={!symbol || !stockData}
                >
                    📊 View Detailed Prediction
                </button>
            </div>

            {/* Error Messages */}
            {error && <p className="error-message">❌ {error}</p>}

            {/* Stock Data Filter */}
            <div className="filter-container">
                <label>Filter: </label>
                <select 
                    value={filterDays} 
                    onChange={(e) => setFilterDays(Number(e.target.value))}
                    disabled={!stockData}
                >
                    <option value="7">Last 7 Days</option>
                    <option value="30">Last 30 Days</option>
                    <option value="90">Last 3 Months</option>
                    <option value="365">Last 1 Year</option>
                </select>
            </div>

            {/* Stock Data Display */}
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
                                    <td>${parseFloat(item.open).toFixed(2)}</td>
                                    <td>${parseFloat(item.close).toFixed(2)}</td>
                                    <td>{parseInt(item.volume).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <LineGraph data={getFilteredStockData()} />
                </div>
            )}

            {/* Financial Data Pie Chart */}
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
