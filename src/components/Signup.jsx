import React, { useState } from 'react';
import { auth, db } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, writeBatch, collection } from 'firebase/firestore'; 
import { Link, useNavigate } from 'react-router-dom';
import '../Login.css';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            // 1. Authenticate the User
            const cred = await createUserWithEmailAndPassword(auth, email, password);
            const uid = cred.user.uid;

            // 2. Initialize a Batch Write (To create 5 entities at once)
            const batch = writeBatch(db);

            // --- ENTITY 1: USER ---
            // The core profile linked to the Auth ID
            const userRef = doc(db, "users", uid);
            batch.set(userRef, {
                uid: uid,
                email: email,
                display_name: email.split('@')[0],
                role: "user",
                created_at: new Date().toISOString()
            });

            // --- ENTITY 2: PREFERENCE ---
            // 1:1 Relationship (Settings for this specific user)
            const prefRef = doc(db, "preferences", uid);
            batch.set(prefRef, {
                user_id: uid,
                default_sport: "football",
                theme: "dark",
                notifications_enabled: true
            });

            // --- ENTITY 3: TEAM_FOLLOW ---
            // 1:N Relationship (Following a team)
            const followRef = doc(collection(db, "team_follows"));
            batch.set(followRef, {
                follow_id: followRef.id,
                user_id: uid,
                team_name: "NowPlaying Official",
                league: "App Updates",
                followed_at: new Date().toISOString()
            });

            // --- ENTITY 4: SAVED_MATCH ---
            // 1:N Relationship (Saving a game to watch later)
            const saveRef = doc(collection(db, "saved_matches"));
            batch.set(saveRef, {
                save_id: saveRef.id,
                user_id: uid,
                match_id: "demo_match_123",
                sport_type: "system",
                notes: "Welcome to your saved matches!",
                saved_at: new Date().toISOString()
            });

            // --- ENTITY 5: COMMENT ---
            // 1:N Relationship (A user comment on a game)
            const commentRef = doc(collection(db, "comments"));
            batch.set(commentRef, {
                comment_id: commentRef.id,
                user_id: uid,
                match_id: "system_welcome_post",
                content: "Account created successfully.",
                timestamp: new Date().toISOString()
            });

            // 3. Commit the batch to the database
            await batch.commit();

            console.log('5-Entity Backend initialized for:', uid);
            alert('Account created & All 5 Database Entities initialized!');
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