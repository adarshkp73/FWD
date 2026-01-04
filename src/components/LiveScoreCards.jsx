import React, { useState } from 'react';
import VerboseScorecard from './VerboseScorecard';
import { auth, db } from '../firebaseConfig'; // Import Backend connection
import { collection, addDoc } from 'firebase/firestore'; // Import Write functions

// ==================================================================
// HELPER: Database Actions (Reused by all cards)
// ==================================================================
const handleSaveMatch = async (game, sport) => {
    if (!auth.currentUser) return alert("Please Login to save matches!");
    
    try {
        await addDoc(collection(db, "saved_matches"), {
            user_id: auth.currentUser.uid,
            match_id: game.fixture?.id || game.id || "unknown_id",
            sport_type: sport,
            notes: "User saved from dashboard",
            saved_at: new Date().toISOString()
        });
        alert("Match Saved to Dashboard!");
    } catch (err) {
        console.error("Error saving match:", err);
        alert("Failed to save match.");
    }
};

const handleFollowTeam = async (teamName, league) => {
    if (!auth.currentUser) return alert("Please Login to follow teams!");

    const confirmFollow = window.confirm(`Follow ${teamName}?`);
    if (!confirmFollow) return;

    try {
        await addDoc(collection(db, "team_follows"), {
            user_id: auth.currentUser.uid,
            team_name: teamName,
            league: league || "Unknown League",
            followed_at: new Date().toISOString()
        });
        alert(`Now following ${teamName}!`);
    } catch (err) {
        console.error("Error following team:", err);
    }
};

// ==================================================================
// COMPONENT: Comment Input (Shows inside Verbose view)
// ==================================================================
const CommentSection = ({ matchId }) => {
    const [comment, setComment] = useState("");

    const submitComment = async (e) => {
        e.preventDefault();
        if (!auth.currentUser) return alert("Login to comment!");
        if (!comment.trim()) return;

        try {
            await addDoc(collection(db, "comments"), {
                user_id: auth.currentUser.uid,
                match_id: matchId,
                content: comment,
                timestamp: new Date().toISOString()
            });
            alert("Comment posted!");
            setComment("");
        } catch (err) {
            alert("Error posting comment");
        }
    };

    return (
        <div className="comment-section" style={{ marginTop: '15px', borderTop: '1px solid #444', paddingTop: '10px' }}>
            <input 
                type="text" 
                value={comment} 
                onChange={(e) => setComment(e.target.value)} 
                placeholder="Write a comment..."
                style={{ width: '70%', padding: '5px', borderRadius: '4px', border: 'none' }}
                onClick={(e) => e.stopPropagation()} // Prevent card closing when typing
            />
            <button 
                onClick={(e) => { e.stopPropagation(); submitComment(e); }}
                style={{ marginLeft: '5px', padding: '5px 10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
                Post
            </button>
        </div>
    );
};

// ===================================
// 1. FOOTBALL CARD
// ===================================
export const FootballCard = ({ game }) => {
    const league = game.league?.name || 'N/A';
    const location = game.fixture?.venue?.city || 'N/A';
    const homeTeam = game.teams?.home?.name || 'Team 1';
    const awayTeam = game.teams?.away?.name || 'Team 2';
    const status = game.fixture?.status?.long || 'In Play';
    const score = `${game.goals?.home || 0} - ${game.goals?.away || 0}`;
    const currentInfo = `${status} | Score: ${score}`;

    return (
        <div className="sport-card football">
            <div className="card-header">
                <span className="card-game-name">{league}</span>
                {/* ACTION: Save Match */}
                <button 
                    onClick={() => handleSaveMatch(game, 'football')} 
                    style={{ background: 'transparent', border: 'none', color: '#ffd700', cursor: 'pointer', fontSize: '1.2rem' }}
                    title="Save Match"
                >
                    ★
                </button>
            </div>
            {/* ACTION: Click Team to Follow */}
            <div className="card-teams">
                <span onClick={() => handleFollowTeam(homeTeam, league)} style={{cursor: 'pointer', textDecoration: 'underline'}}>{homeTeam}</span> 
                {' vs '} 
                <span onClick={() => handleFollowTeam(awayTeam, league)} style={{cursor: 'pointer', textDecoration: 'underline'}}>{awayTeam}</span>
            </div>
            <div className="card-score-status">{currentInfo}</div>
        </div>
    );
};

// ===================================
// 2. HOCKEY CARD (With Comment Section)
// ===================================
export const HockeyCard = ({ game }) => {
    const [showVerbose, setShowVerbose] = useState(false); 
    
    const toggleVerbose = (e) => {
        e.stopPropagation(); 
        setShowVerbose(prev => !prev);
    };

    const league = game.league?.name || 'N/A';
    const location = game.country?.name || 'N/A';
    const homeTeam = game.teams?.home?.name || 'Team 1';
    const awayTeam = game.teams?.away?.name || 'Team 2';
    const status = game.status?.long || 'In Play';
    const score = `${game.scores?.home || 0} - ${game.scores?.away || 0}`;
    const currentInfo = `${status} | Score: ${score}`;
    
    const periods = [
        { home: game.periods?.first?.home, away: game.periods?.first?.away },
        { home: game.periods?.second?.home, away: game.periods?.second?.away },
        { home: game.periods?.third?.home, away: game.periods?.third?.away }
    ].filter(p => p.home !== undefined || p.away !== undefined);

    return (
        <div className="sport-card hockey" onClick={toggleVerbose}>
            <div className="card-header">
                <span className="card-game-name">{league}</span>
                <button 
                    onClick={(e) => { e.stopPropagation(); handleSaveMatch(game, 'hockey'); }}
                    style={{ background: 'transparent', border: 'none', color: '#ffd700', cursor: 'pointer', fontSize: '1.2rem' }}
                >
                    ★
                </button>
            </div>
            <div className="card-teams">
                <span onClick={(e) => { e.stopPropagation(); handleFollowTeam(homeTeam, league); }} style={{cursor: 'pointer', textDecoration: 'underline'}}>{homeTeam}</span>
                {' vs '}
                <span onClick={(e) => { e.stopPropagation(); handleFollowTeam(awayTeam, league); }} style={{cursor: 'pointer', textDecoration: 'underline'}}>{awayTeam}</span>
            </div>
            <div className="card-score-status">{currentInfo}</div>
            
            {showVerbose && (
                <>
                    <VerboseScorecard 
                        periods={periods} 
                        homeTeamName={homeTeam} 
                        awayTeamName={awayTeam} 
                        score={score} 
                        sport="hockey"
                    />
                    {/* ACTION: Comment Section */}
                    <CommentSection matchId={game.id} />
                </>
            )}
        </div>
    );
};

// ===================================
// 3. BASKETBALL/NBA CARD
// ===================================
export const BasketballCard = ({ game, selectedSport }) => { 
    const [showVerbose, setShowVerbose] = useState(false); 
    
    const toggleVerbose = (e) => {
        e.stopPropagation(); 
        setShowVerbose(prev => !prev);
    };

    const league = game.league?.name || 'N/A';
    const location = game.country?.name || 'N/A';
    const homeTeam = game.teams?.home?.name || 'Team 1';
    const awayTeam = game.teams?.away?.name || 'Team 2';
    const status = game.status?.long || 'In Play';
    const score = `${game.scores?.home?.total || 0} - ${game.scores?.away?.total || 0}`;
    const currentInfo = `${status} | Score: ${score}`;
    
    const cardClass = game.league?.id === 12 || selectedSport === 'nba' ? 'nba' : 'basketball';

    const periods = [
        { home: game.scores?.home?.q1, away: game.scores?.away?.q1 },
        { home: game.scores?.home?.q2, away: game.scores?.away?.q2 },
        { home: game.scores?.home?.q3, away: game.scores?.away?.q3 },
        { home: game.scores?.home?.q4, away: game.scores?.away?.q4 }
    ].filter(p => p.home !== undefined || p.away !== undefined);

    return (
        <div className={`sport-card ${cardClass}`} onClick={toggleVerbose}>
            <div className="card-header">
                <span className="card-game-name">{league}</span>
                <button 
                    onClick={(e) => { e.stopPropagation(); handleSaveMatch(game, 'basketball'); }}
                    style={{ background: 'transparent', border: 'none', color: '#ffd700', cursor: 'pointer', fontSize: '1.2rem' }}
                >
                    ★
                </button>
            </div>
            <div className="card-teams">{homeTeam} vs {awayTeam}</div>
            <div className="card-score-status">{currentInfo}</div>
            
            {showVerbose && (
                <>
                    <VerboseScorecard 
                        periods={periods} 
                        homeTeamName={homeTeam} 
                        awayTeamName={awayTeam} 
                        score={score} 
                        sport={selectedSport}
                    />
                    <CommentSection matchId={game.id} />
                </>
            )}
        </div>
    );
};

// ===================================
// 4. VOLLEYBALL CARD
// ===================================
export const VolleyballCard = ({ game }) => { 
    const league = game.league?.name || 'N/A';
    const location = game.country?.name || 'N/A';
    const homeTeam = game.teams?.home?.name || 'Team 1';
    const awayTeam = game.teams?.away?.name || 'Team 2';
    const status = game.status?.long || 'In Play';
    const score = `${game.scores?.home || 0} - ${game.scores?.away || 0}`; 
    const currentInfo = `${status} | Score: ${score}`;
    
    return (
        <div className="sport-card volleyball">
            <div className="card-header">
                <span className="card-game-name">{league}</span>
                <button 
                    onClick={() => handleSaveMatch(game, 'volleyball')} 
                    style={{ background: 'transparent', border: 'none', color: '#ffd700', cursor: 'pointer', fontSize: '1.2rem' }}
                >
                    ★
                </button>
            </div>
            <div className="card-teams">{homeTeam} vs {awayTeam}</div> 
            <div className="card-score-status">{currentInfo}</div>
        </div>
    );
};

// ===================================
// 5. F1 CARD
// ===================================
export const F1Card = ({ game }) => {
    const raceName = game.competition?.name || 'Formula 1 Race';
    const location = game.circuit?.name || 'N/A';
    const gameDate = new Date(game.date);
    const displayDate = gameDate.toLocaleString(undefined, { 
        weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
    const status = game.status || 'Scheduled';
    const currentInfo = `${status} | ${displayDate}`;
    
    return ( 
        <div className="sport-card f1">
            <div className="card-header">
                <span className="card-game-name">{raceName}</span>
                <button 
                    onClick={() => handleSaveMatch(game, 'f1')} 
                    style={{ background: 'transparent', border: 'none', color: '#ffd700', cursor: 'pointer', fontSize: '1.2rem' }}
                >
                    ★
                </button>
            </div>
            <div className="card-teams">Formula 1 - Race Day</div>
            <div className="card-score-status">{currentInfo}</div>
        </div>
    );
};