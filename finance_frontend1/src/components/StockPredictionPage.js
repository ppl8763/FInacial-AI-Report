import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import './StockPredictionPage.css';

const StockPredictionPage = () => {
    const { symbol } = useParams();
    const navigate = useNavigate();
    const [prediction, setPrediction] = useState(null);
    const [historicalData, setHistoricalData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPredictionData = async () => {
            try {
                const [predictionRes, historicalRes] = await Promise.all([
                    fetch(`http://localhost:5000/api/predict-stock/${symbol}`),
                    fetch(`http://localhost:5000/api/stock/${symbol}`)
                ]);

                if (!predictionRes.ok || !historicalRes.ok) {
                    throw new Error('Failed to fetch data');
                }

                const predictionData = await predictionRes.json();
                const historicalData = await historicalRes.json();

                setPrediction(predictionData.predicted_price);
                processHistoricalData(historicalData);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPredictionData();
    }, [symbol]);

    const processHistoricalData = (rawData) => {
        const dates = Object.keys(rawData).sort();
        const closes = dates.map(date => parseFloat(rawData[date]["4. close"]));
        setHistoricalData({ dates, closes });
    };

    if (isLoading) return <div className="loading">🔮 Predicting...</div>;
    if (error) return <div className="error">❌ Error: {error}</div>;

    return (
        <div className="prediction-page">
            <button onClick={() => navigate(-1)} className="back-button">
                ← Back to Dashboard
            </button>

            <h1>{symbol} Stock Prediction</h1>
            
            <div className="prediction-card">
                <h2>Predicted Price: ${prediction}</h2>
                <p className="explanation">
                    This prediction is based on linear regression analysis of recent stock performance.
                    The model considers historical closing prices to forecast potential future values.
                </p>
            </div>

            <div className="chart-container">
                <h3>Historical Closing Prices</h3>
                <Line
                    data={{
                        labels: historicalData.dates,
                        datasets: [{
                            label: 'Closing Price ($)',
                            data: historicalData.closes,
                            borderColor: '#4bc0c0',
                            tension: 0.1
                        }]
                    }}
                    options={{ 
                        responsive: true,
                        scales: {
                            y: {
                                beginAtZero: false
                            }
                        }
                    }}
                />
            </div>
        </div>
    );
};

export default StockPredictionPage;
