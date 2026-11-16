import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    PieChart,
    Pie,
    Cell,
    Legend
} from "recharts";

import "./AdminDashboard.css";

const API_URL = "http://127.0.0.1:8000/api/analytics/";

function AdminDashboard() {
    const navigate = useNavigate();

    const [analytics, setAnalytics] = useState({
        total_visitors: 0,
        real_visitors: 0,
        simulated_visitors: 0,
        country_stats: [],
        recent_visitors: []
    });

    const [loading, setLoading] = useState(true);
    const [simulating, setSimulating] = useState(false);
    const [error, setError] = useState("");

    const fetchAnalytics = useCallback(async () => {
        try {
            const response = await axios.get(`${API_URL}stats/`);

            const data = response.data;
            const visitors = data.recent_visitors || [];

            // Count real and simulated visitors from the complete
            // database totals returned by the backend.
            setAnalytics({
                ...data,
                real_visitors: data.real_visitors ?? 0,
                simulated_visitors: data.simulated_visitors ?? 0,
                country_stats: data.country_stats || [],
                recent_visitors: visitors
            });

            setError("");
        } catch (err) {
            console.error("Analytics loading error:", err);
            setError("Unable to load analytics. Check whether Django is running.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAnalytics();

        const interval = setInterval(fetchAnalytics, 10000);

        return () => clearInterval(interval);
    }, [fetchAnalytics]);

    const simulateVisitors = async () => {
        try {
            setSimulating(true);

            await axios.post(`${API_URL}simulate/`);

            await fetchAnalytics();

            alert("5 simulated visitors added successfully!");
        } catch (err) {
            console.error("Simulation error:", err);
            alert("Unable to simulate visitors. Check the Django server.");
        } finally {
            setSimulating(false);
        }
    };

    const logout = () => {
        localStorage.removeItem("adminAuthenticated");
        navigate("/login");
    };

    const pieData = [
        {
            name: "Real Visitors",
            value: analytics.real_visitors
        },
        {
            name: "Simulated Visitors",
            value: analytics.simulated_visitors
        }
    ].filter(item => item.value > 0);

    const COLORS = ["#16a34a", "#f59e0b"];

    return (
        <div className="admin-dashboard">

            <div className="admin-dashboard-header">
                <div>
                    <h1>QuickKart Admin Dashboard</h1>
                    <p>Visitor analytics and website activity</p>
                </div>

                <div className="admin-dashboard-actions">
                    <button
                        onClick={() => navigate("/admin-css-generator")}
                        className="css-generator-button"
                    >
                        CSS Generator
                    </button>

                    <button
                        onClick={fetchAnalytics}
                        className="refresh-button"
                    >
                        Refresh
                    </button>

                    <button
                        onClick={simulateVisitors}
                        disabled={simulating}
                        className="simulate-button"
                    >
                        {simulating ? "Simulating..." : "Simulate Visitors"}
                    </button>

                    <button onClick={logout} className="logout-button">
                        Logout
                    </button>
                </div>
            </div>

            {error && (
                <div className="analytics-error">
                    {error}
                </div>
            )}

            {loading ? (
                <p>Loading analytics...</p>
            ) : (
                <>
                    {/* Summary Cards */}

                    <div className="analytics-cards">

                        <div className="analytics-card">
                            <h3>Total Visitors</h3>
                            <p>{analytics.total_visitors}</p>
                        </div>

                        <div className="analytics-card real-card">
                            <h3>Real Visitors</h3>
                            <p>{analytics.real_visitors}</p>
                        </div>

                        <div className="analytics-card simulated-card">
                            <h3>Simulated Visitors</h3>
                            <p>{analytics.simulated_visitors}</p>
                        </div>

                        <div className="analytics-card">
                            <h3>Countries Reached</h3>
                            <p>{analytics.country_stats.length}</p>
                        </div>

                    </div>

                    {/* Charts */}

                    <div className="analytics-charts">

                        <div className="chart-container">
                            <h2>Visitors by Country</h2>

                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={analytics.country_stats}>
                                    <CartesianGrid strokeDasharray="3 3" />

                                    <XAxis
                                        dataKey="country"
                                        angle={-15}
                                        textAnchor="end"
                                        height={65}
                                    />

                                    <YAxis allowDecimals={false} />

                                    <Tooltip />

                                    <Bar
                                        dataKey="count"
                                        fill="#2874f0"
                                        name="Visitors"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="chart-container">
                            <h2>Real vs Simulated Visitors</h2>

                            {pieData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={100}
                                            label
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell
                                                    key={entry.name}
                                                    fill={
                                                        COLORS[
                                                            index % COLORS.length
                                                        ]
                                                    }
                                                />
                                            ))}
                                        </Pie>

                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <p>No visitor data available yet.</p>
                            )}
                        </div>

                    </div>

                    {/* Recent Visitors */}

                    <div className="visitor-table-container">

                        <h2>Recent Visitors</h2>

                        <div className="visitor-table-wrapper">
                            <table className="visitor-table">
                                <thead>
                                    <tr>
                                        <th>IP Address</th>
                                        <th>Country</th>
                                        <th>City</th>
                                        <th>Visit Time</th>
                                        <th>Visitor Type</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {analytics.recent_visitors.length > 0 ? (
                                        analytics.recent_visitors.map(visitor => (
                                            <tr key={visitor.id}>
                                                <td>{visitor.ip_address}</td>
                                                <td>{visitor.country}</td>
                                                <td>{visitor.city || "Unknown"}</td>

                                                <td>
                                                    {new Date(
                                                        visitor.visited_at
                                                    ).toLocaleString()}
                                                </td>

                                                <td>
                                                    <span
                                                        className={
                                                            visitor.is_simulated
                                                                ? "visitor-badge simulated-badge"
                                                                : "visitor-badge real-badge"
                                                        }
                                                    >
                                                        {visitor.is_simulated
                                                            ? "SIMULATED"
                                                            : "REAL"}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5">
                                                No visitors recorded yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                    </div>

                    <p className="analytics-update-info">
                        Dashboard automatically refreshes every 10 seconds.
                    </p>
                </>
            )}

        </div>
    );
}

export default AdminDashboard;