import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Loading from "./components/Loading";

const Home = lazy(() => import("./components/Home"));
const Dashboard = lazy(() => import("./components/Dashboard"));
const EconomyDashboard = lazy(() => import("./components/EconomyDashboard"));
const GDPDetails = lazy(() => import("./components/GDPDetails"));
const GNPDetails = lazy(() => import("./components/GNPDetails"));
const GDPGrowthDetails = lazy(() => import("./components/GDPGrowthDetails"));
const InflationDetails = lazy(() => import("./components/InflationDetails"));
const StockPredictionPage = lazy(() => import("./components/StockPredictionPage"));
const NotFound = lazy(() => import("./components/NotFound"));

const App = () => {
    return (
        <Router>
            <Navbar />
            <Suspense fallback={<Loading />}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/economy" element={<EconomyDashboard />} />
                    <Route path="/gdp-details" element={<GDPDetails />} />
                    <Route path="/gnp-details" element={<GNPDetails />} />
                    <Route path="/gdp-growth-details" element={<GDPGrowthDetails />} />
                    <Route path="/inflation-details" element={<InflationDetails />} />
                    {/* New Stock Prediction Route */}
                    <Route path="/stock-prediction/:symbol" element={<StockPredictionPage />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Suspense>
            <Footer />
        </Router>
    );
};

export default App;
