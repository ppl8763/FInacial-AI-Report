const express = require("express");
const mysql = require("mysql");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 5000;
const ALPHA_VANTAGE_API_KEY = "B2SQXGOF2ZMZAV1Z"; // 🔑 API Key

app.use(express.json());
app.use(cors()); // ✅ Enable CORS for frontend access

// ✅ MySQL Database Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root@mysql",
    database: "finance_db",
});

db.connect((err) => {
    if (err) {
        console.error("❌ MySQL Connection Failed:", err);
    } else {
        console.log("✅ Connected to MySQL Database");
    }
});

// ✅ Home Route
app.get("/", (req, res) => {
    res.send("Backend is running! 🚀 Visit frontend at http://localhost:3000");
});

// ✅ Get Financial Data from MySQL
app.get("/api/financial-data", (req, res) => {
    const sql = "SELECT * FROM financial_data";
    db.query(sql, (err, result) => {
        if (err) {
            console.error("❌ Error fetching financial data:", err);
            res.status(500).json({ error: "Database Error" });
        } else {
            res.json(result);
        }
    });
});

// ✅ Get Stock Data from Alpha Vantage API
app.get("/api/stock/:symbol", async (req, res) => {
    try {
        const { symbol } = req.params;
        const response = await axios.get(
            `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
        );

        if (response.data["Time Series (Daily)"]) {
            res.json(response.data["Time Series (Daily)"]);
        } else {
            res.status(404).json({ error: "Stock data not found" });
        }
    } catch (error) {
        console.error("❌ Error fetching stock data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ✅ Fetch AI Stock Prediction from Flask
app.get("/api/predict-stock/:symbol", async (req, res) => {
    try {
        const { symbol } = req.params;
        const response = await axios.get(`http://localhost:5001/predict/${symbol}`);

        if (response.data.error) {
            return res.status(404).json({ error: response.data.error });
        }

        // ✅ Store Prediction in MySQL
        const predictedPrice = response.data.predicted_price;
        const sql = "INSERT INTO stock_predictions (symbol, predicted_price) VALUES (?, ?) ON DUPLICATE KEY UPDATE predicted_price=?";
        db.query(sql, [symbol, predictedPrice, predictedPrice], (err) => {
            if (err) {
                console.error("❌ Error saving prediction:", err);
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error("❌ Error calling Flask AI model:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ✅ Get All Stored Stock Predictions
app.get("/api/stock-predictions", (req, res) => {
    const sql = "SELECT * FROM stock_predictions ORDER BY created_at DESC";
    db.query(sql, (err, result) => {
        if (err) {
            console.error("❌ Error fetching stock predictions:", err);
            res.status(500).json({ error: "Database Error" });
        } else {
            res.json(result);
        }
    });
});

// ✅ Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
