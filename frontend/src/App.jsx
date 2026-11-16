import VisitorTracker from "./components/VisitorTracker";
import React, { useContext, useEffect } from 'react';
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from 'react-router-dom';

import './App.css';

import Navbar from './components/Navbar';

import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

import LoginChoice from './pages/LoginChoice';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import CSSGenerator from './pages/CSSGenerator';

import { CartProvider } from './context/CartContext';
import {
    AuthProvider,
    AuthContext
} from './context/AuthContext';


// Protect normal user routes
function ProtectedRoute({ children }) {
    const { token } = useContext(AuthContext);

    return token
        ? children
        : <Navigate to="/login" />;
}


// Protect admin routes
function AdminProtectedRoute({ children }) {
    const isAdmin =
        localStorage.getItem('adminAuthenticated') === 'true';

    return isAdmin
        ? children
        : <Navigate to="/admin-login" />;
}


// Load saved custom CSS throughout the website
function GlobalCustomCSS() {
    useEffect(() => {
        const savedCSS = localStorage.getItem(
            'quickkart-custom-css'
        );

        if (savedCSS) {
            let styleElement = document.getElementById(
                'quickkart-custom-theme'
            );

            if (!styleElement) {
                styleElement = document.createElement('style');
                styleElement.id = 'quickkart-custom-theme';

                document.head.appendChild(styleElement);
            }

            styleElement.textContent = savedCSS;
        }
    }, []);

    return null;
}


function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <BrowserRouter>
                    <VisitorTracker />

                    {/* Load saved website styling */}
                    <GlobalCustomCSS />

                    {/* Existing QuickKart navbar */}
                    <Navbar />

                    <Routes>

                        {/* Home */}
                        <Route
                            path="/"
                            element={<Home />}
                        />

                        {/* Products */}
                        <Route
                            path="/products/:id"
                            element={<ProductDetails />}
                        />

                        {/* Shopping Cart */}
                        <Route
                            path="/cart"
                            element={<Cart />}
                        />

                        {/* Login Selection */}
                        <Route
                            path="/login"
                            element={<LoginChoice />}
                        />

                        {/* User Authentication */}
                        <Route
                            path="/user-login"
                            element={<Login />}
                        />

                        <Route
                            path="/register"
                            element={<Register />}
                        />

                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute>
                                    <Profile />
                                </ProtectedRoute>
                            }
                        />

                        {/* Admin Authentication */}
                        <Route
                            path="/admin-login"
                            element={<AdminLogin />}
                        />

                        {/* Admin Dashboard */}
                        <Route
                            path="/admin-dashboard"
                            element={
                                <AdminProtectedRoute>
                                    <AdminDashboard />
                                </AdminProtectedRoute>
                            }
                        />

                        {/* CSS Generator */}
                        <Route
                            path="/admin-css-generator"
                            element={
                                <AdminProtectedRoute>
                                    <CSSGenerator />
                                </AdminProtectedRoute>
                            }
                        />

                    </Routes>

                </BrowserRouter>
            </CartProvider>
        </AuthProvider>
    );
}

export default App;