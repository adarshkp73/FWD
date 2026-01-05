import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const Navbar = ({ onSportSelect }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
        await signOut(auth);
        alert('You have been logged out successfully');
        navigate('/login');
    } catch (err) {
        console.error('Sign out error', err);
    }
  };

  const handleClick = (e, sport) => {
    e.preventDefault();
    if (onSportSelect) onSportSelect(sport);
  };

  return (
    <>
        <nav className="topnav">
            <Link to="/" className="logo-link">
                <img src="assets/logo.png" alt="logo" className="logo" width="30" height="30"/>
            </Link>
            
            <Link to="/">NowPlaying!</Link>
            
            <div className="auth-buttons">
                {user ? (
                    <>
                        <button className="login" onClick={() => navigate('/profile')}>PROFILE</button>
                        <button className="login" onClick={handleLogout}>LOGOUT</button>
                    </>
                ) : (
                    <button className="login" onClick={() => navigate('/login')}>LOGIN</button>
                )}
            </div>
        </nav>

        <nav className="sidenav">
            <h2>Sports</h2>
            <div className="sports">
                <button id="nav-football" className="sport-football" onClick={(e)=>handleClick(e,"football")}><img src="assets/soccer-ball-variant.png" height="30px"/>FOOTBALL</button>
                <button id="nav-hockey" className="sport-hockey" onClick={(e)=>handleClick(e,"hockey")}><img src="assets/hockey.png" height="30px"/>HOCKEY</button>
                <button id="nav-basketball" className="sport-basketball" onClick={(e) => handleClick(e, "basketball")}><img src="assets/basketball.png" height="30px"/>BASKETBALL</button> 
                <button id="nav-nba" className="sport-nba" onClick={(e) => handleClick(e, "nba")}><img src="assets/nba.png" height="30px"/>NBA</button>
                <button id="nav-f1" className="sport-f1" onClick={(e) => handleClick(e, "f1")}><img src="assets/f1.png" height="30px"/>FORMULA 1</button>
                <button id="nav-volleyball" className="sport-volleyball" onClick={(e) => handleClick(e, "volleyball")}><img src="assets/volleyball.png" height="30px"/>VOLLEYBALL</button>
            </div>
        </nav>
    </>
  );
};
export default Navbar;