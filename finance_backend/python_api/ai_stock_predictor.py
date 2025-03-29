from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_caching import Cache
import pandas as pd
import numpy as np
import requests
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline
import logging
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

# Configure caching
cache = Cache(app, config={
    'CACHE_TYPE': 'SimpleCache',
    'CACHE_DEFAULT_TIMEOUT': 3600  # Cache for 1 hour
})

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# API Configuration
ALPHA_VANTAGE_API_KEY = "B2SQXGOF2ZMZAV1Z"  # Use environment variable in production
MAX_RETRIES = 3
RETRY_DELAY = 1  # seconds

@app.before_request
def before_request():
    """Log request details"""
    logger.info(f"Incoming request: {request.method} {request.path}")

def fetch_stock_data_with_retry(symbol, retries=MAX_RETRIES):
    """Fetch stock data with retry logic"""
    url = f"https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol={symbol}&apikey={ALPHA_VANTAGE_API_KEY}&outputsize=compact"
    
    for attempt in range(retries):
        try:
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            if "Time Series (Daily)" not in data:
                if "Note" in data and "API call frequency" in data["Note"]:
                    logger.warning("API rate limit approached")
                    return None, "API rate limit exceeded"
                return None, "Invalid stock symbol"
            
            return data, None
        except requests.exceptions.RequestException as e:
            if attempt == retries - 1:
                logger.error(f"Failed to fetch data after {retries} attempts: {str(e)}")
                return None, str(e)
            time.sleep(RETRY_DELAY)

@cache.memoize(timeout=3600)
def fetch_stock_data(symbol):
    """Fetch and process stock data with caching"""
    raw_data, error = fetch_stock_data_with_retry(symbol)
    if error:
        return None, error

    try:
        df = pd.DataFrame.from_dict(raw_data["Time Series (Daily)"], orient="index")
        df = df.rename(columns={
            "1. open": "Open",
            "2. high": "High",
            "3. low": "Low",
            "4. close": "Close",
            "5. volume": "Volume"
        }).astype(float)
        
        df["Date"] = pd.to_datetime(df.index)
        df = df.sort_values("Date")
        
        # Calculate additional features
        df["Daily_Return"] = df["Close"].pct_change()
        df["SMA_5"] = df["Close"].rolling(5).mean()
        df["SMA_20"] = df["Close"].rolling(20).mean()
        
        return df.dropna(), None
    except Exception as e:
        logger.error(f"Data processing error: {str(e)}")
        return None, "Data processing error"

def create_prediction_model():
    """Create a more sophisticated prediction model"""
    return make_pipeline(
        StandardScaler(),
        RandomForestRegressor(
            n_estimators=100,
            random_state=42,
            n_jobs=-1
        )
    )

def predict_stock(symbol):
    """Enhanced stock prediction with more features"""
    df, error = fetch_stock_data(symbol)
    if error:
        return {"error": error}

    try:
        # Prepare features
        df["Days"] = (df["Date"] - df["Date"].min()).dt.days
        X = df[["Days", "Daily_Return", "SMA_5", "SMA_20"]]
        y = df["Close"].values

        # Train model
        model = create_prediction_model()
        model.fit(X, y)

        # Predict next day
        last_day = df["Days"].max()
        next_features = np.array([[
            last_day + 1,
            df["Daily_Return"].iloc[-1],
            df["SMA_5"].iloc[-1],
            df["SMA_20"].iloc[-1]
        ]])
        
        predicted_price = model.predict(next_features)[0]
        
        return {
            "symbol": symbol,
            "predicted_price": round(predicted_price, 2),
            "last_close": round(df["Close"].iloc[-1], 2),
            "prediction_date": (df["Date"].max() + timedelta(days=1)).strftime("%Y-%m-%d"),
            "model": "RandomForestRegressor"
        }
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        return {"error": "Prediction failed"}

@app.route("/predict/<symbol>", methods=["GET"])
def predict(symbol):
    """API endpoint for stock predictions"""
    result = predict_stock(symbol)
    if "error" in result:
        return jsonify(result), 400
    return jsonify(result)

@app.route("/health", methods=["GET"])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat()
    })

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5001, debug=True)
