from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import requests
from sklearn.linear_model import LinearRegression

app = Flask(__name__)
CORS(app)


# ✅ Function to fetch stock data from Alpha Vantage
def fetch_stock_data(symbol):
    api_key = "B2SQXGOF2ZMZAV1Z"  # Replace with your API key
    url = f"https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol={symbol}&apikey={api_key}&outputsize=compact"
    response = requests.get(url).json()

    if "Time Series (Daily)" not in response:
        return None

    df = pd.DataFrame.from_dict(response["Time Series (Daily)"], orient="index")
    df = df.rename(columns={"4. close": "Close"}).astype(float)
    df["Date"] = pd.to_datetime(df.index)
    df = df[["Date", "Close"]].sort_values("Date")
    return df


# ✅ AI Model: Predict Future Stock Price
def predict_stock(symbol):
    df = fetch_stock_data(symbol)

    if df is None:
        return {"error": "Invalid stock symbol or API limit exceeded"}

    df["Days"] = (df["Date"] - df["Date"].min()).dt.days
    X = df[["Days"]].values
    y = df["Close"].values

    model = LinearRegression()
    model.fit(X, y)

    future_day = df["Days"].max() + 1
    future_price = model.predict([[future_day]])[0]

    return {"symbol": symbol, "predicted_price": round(future_price, 2)}


# ✅ API Route to Get Stock Prediction
@app.route("/predict/<symbol>", methods=["GET"])
def predict(symbol):
    result = predict_stock(symbol)
    return jsonify(result)


# ✅ API Home Route to Prevent 404 Errors
@app.route("/", methods=["GET"])
def home():
    return "Flask Stock Prediction API is Running! 🚀"


# ✅ Run Flask Server
if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5001, debug=True)
