import React, { useState } from 'react';
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import '../Login.css';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const cred = await createUserWithEmailAndPassword(auth, email, password);
            console.log('Signup success:', cred.user.email);
            alert('Account created');
            navigate('/');
        } catch (err) {
            console.error('Signup failed:', err.code, err.message);
            alert(err.code + ' : ' + err.message);
        }
    };

    return (
        <div className="content">
            <form className="login-form" onSubmit={handleSignup}>
                <h1>SIGN UP</h1>
                <div className="unp">
                    <div>
                        <label htmlFor="usr">Email</label>
                        <input 
                            type="text" 
                            className="usr" 
                            id="usr" 
                            required 
                            placeholder="example@domain.com" 
                            pattern="^[^@\s]+@[^@\s]+\.[^@\s]+$"
                            onChange={(e) => setEmail(e.target.value)} 
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input 
                            type="password" 
                            className="pass" 
                            id="password" 
                            required 
                            minLength="6" 
                            placeholder="Minimum 8 characters" 
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                    </div>
                </div>
                <button type="submit" className="login_button">CREATE</button>
                <div style={{marginTop: '10px'}}>
                    <Link to="/login" style={{color: '#102A43'}}>Already have an account? Login</Link>
                </div>
            </form>
        </div>
    );
};

export default Signup;