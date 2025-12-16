import React, { useState } from 'react';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import '../Login.css'; // Import the CSS we just made

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            alert('Login successful');
            navigate('/'); // Redirect to Home
        } catch (err) {
            console.error('Login error:', err.code);
            // Error handling matching your vanilla login.js
            if (
                err.code === 'auth/wrong-password' ||
                err.code === 'auth/invalid-login-credentials'
            ) {
                alert('Incorrect email or password');
            } else if (err.code === 'auth/user-disabled') {
                alert('This account has been disabled');
            } else if (err.code === 'auth/too-many-requests') {
                alert('Too many attempts. Try again later.');
            } else {
                alert(err.message);
            }
        }
    };

    return (
        <div className="content">
            <form className="login-form" onSubmit={handleLogin}>
                <h1>WELCOME</h1>
                <div className="unp">
                    <div>
                        <label htmlFor="usr">Email</label>
                        <input 
                            type="text" 
                            className="usr" 
                            id="usr" 
                            required 
                            placeholder="example@domain.com"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="pass">Password</label>
                        <input 
                            type="password" 
                            className="pass" 
                            id="pass" 
                            required 
                            minLength="8" 
                            placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>
                <button type="submit" className="login_button">LOGIN</button>
                <div style={{marginTop: '10px'}}>
                    <Link to="/signup" style={{color: '#102A43'}}>Sign up</Link>
                </div>
            </form>
        </div>
    );
};

export default Login;