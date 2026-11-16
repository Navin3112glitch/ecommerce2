import React from 'react';
import { Link } from 'react-router-dom';

function LoginChoice() {
    const pageStyle = {
        minHeight: '75vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#f5f5f5'
    };

    const cardStyle = {
        background: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        textAlign: 'center',
        width: '350px'
    };

    const buttonStyle = {
        display: 'block',
        padding: '13px',
        marginTop: '18px',
        borderRadius: '6px',
        textDecoration: 'none',
        color: 'white',
        fontWeight: 'bold'
    };

    return (
        <div style={pageStyle}>
            <div style={cardStyle}>
                <h2>Welcome to QuickKart</h2>
                <p>Please select your login type</p>

                <Link
                    to="/user-login"
                    style={{ ...buttonStyle, background: '#2874f0' }}
                >
                    User Login
                </Link>

                <Link
                    to="/admin-login"
                    style={{ ...buttonStyle, background: '#222' }}
                >
                    Admin Login
                </Link>
            </div>
        </div>
    );
}

export default LoginChoice;