import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        setError('');

        if (username === 'admin' && password === 'admin') {
            localStorage.setItem('adminAuthenticated', 'true');

            // Record successful admin login as a real visitor
            try {
                await fetch('http://127.0.0.1:8000/api/analytics/track/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            } catch (trackingError) {
                console.error('Admin login tracking failed:', trackingError);
            }

            navigate('/admin-dashboard');

        } else {
            setError('Invalid admin username or password.');
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleLogin}>
                <h2>Admin Login</h2>

                {error && <p style={{ color: 'red' }}>{error}</p>}

                <input
                    type="text"
                    placeholder="Admin Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Admin Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit">Login as Admin</button>

                <p>
                    <Link to="/login">Back to Login Options</Link>
                </p>
            </form>
        </div>
    );
}

export default AdminLogin;