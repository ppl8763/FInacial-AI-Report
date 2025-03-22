import React from 'react';
import './GDPTrendsCard.css';

const GDPTrendsCard = ({ gdpData }) => {
    return (
        <div className="gdp-trends-card">
            <h3>📈 GDP Trends (Year-wise)</h3>
            <table>
                <thead>
                    <tr>
                        <th>Year</th>
                        <th>GDP (in Trillions USD)</th>
                    </tr>
                </thead>
                <tbody>
                    {gdpData.length > 0 ? (
                        gdpData.map((data, index) => (
                            <tr key={index}>
                                <td>{data.year}</td>
                                <td>{data.gdp.toFixed(2)}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="2">Loading GDP data...</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default GDPTrendsCard;
