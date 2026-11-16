import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Login() {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await login(username, password);

            // Record successful user login as a real visitor
            try {
                await fetch('http://127.0.0.1:8000/api/analytics/track/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            } catch (trackingError) {
                console.error('User login tracking failed:', trackingError);
            }

            navigate('/profile');

        } catch (err) {
            setError('Invalid username or password.');
        }
    };

    return (
        <div className="auth-container">
            <h1>Login to QuickKart</h1>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />

                <button type="submit">Login</button>
            </form>

            {error && <p className="error-message">{error}</p>}

            <p>New user? <Link to="/register">Register here</Link></p>
        </div>
    );
}

export default Login;