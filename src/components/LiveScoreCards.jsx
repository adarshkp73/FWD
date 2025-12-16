import React, { useState } from 'react'; // <-- ADDED: useState for toggling visibility
// <-- ADDED: Missing imports for all card components (CRITICAL FIX)
import VerboseScorecard from './VerboseScorecard'; // <-- ADDED: Import new component

// ===================================
// 1. FOOTBALL CARD (OK)
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
                <span className="card-location">{location}</span>
            </div>
            <div className="card-teams">{homeTeam} vs {awayTeam}</div>
            <div className="card-score-status">{currentInfo}</div>
        </div>
    );
};

// ===================================
// 2. HOCKEY CARD (Modified for Click-to-Show)
// ===================================
export const HockeyCard = ({ game }) => {
    // 1. ADD STATE: Local state for toggling verbose view
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
    
    // Data preparation for the VerboseScorecard
    const periods = [
        { home: game.periods?.first?.home, away: game.periods?.first?.away },
        { home: game.periods?.second?.home, away: game.periods?.second?.away },
        { home: game.periods?.third?.home, away: game.periods?.third?.away }
    ].filter(p => p.home !== undefined || p.away !== undefined);

    return (
        // 2. ADD onClick HANDLER to the card
        <div className="sport-card hockey" onClick={toggleVerbose}>
            <div className="card-header">
                <span className="card-game-name">{league}</span>
                <span className="card-location">{location}</span>
            </div>
            <div className="card-teams">{homeTeam} vs {awayTeam}</div>
            <div className="card-score-status">{currentInfo}</div>
            
            {/* 3. CONDITIONAL RENDER */}
            {showVerbose && (
                <VerboseScorecard 
                    periods={periods} 
                    homeTeamName={homeTeam} 
                    awayTeamName={awayTeam} 
                    score={score} 
                    sport="hockey"
                />
            )}
        </div>
    );
};

// ===================================
// 3. BASKETBALL/NBA CARD (Modified for Click-to-Show)
// ===================================
export const BasketballCard = ({ game, selectedSport }) => { 
    // 1. ADD STATE: Local state for toggling verbose view
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

    // Data preparation for the VerboseScorecard
    const periods = [
        { home: game.scores?.home?.q1, away: game.scores?.away?.q1 },
        { home: game.scores?.home?.q2, away: game.scores?.away?.q2 },
        { home: game.scores?.home?.q3, away: game.scores?.away?.q3 },
        { home: game.scores?.home?.q4, away: game.scores?.away?.q4 }
    ].filter(p => p.home !== undefined || p.away !== undefined);

    return (
        // 2. ADD onClick HANDLER to the card
        <div className={`sport-card ${cardClass}`} onClick={toggleVerbose}>
            <div className="card-header">
                <span className="card-game-name">{league}</span>
                <span className="card-location">{location}</span>
            </div>
            <div className="card-teams">{homeTeam} vs {awayTeam}</div>
            <div className="card-score-status">{currentInfo}</div>
            
            {/* 3. CONDITIONAL RENDER */}
            {showVerbose && (
                <VerboseScorecard 
                    periods={periods} 
                    homeTeamName={homeTeam} 
                    awayTeamName={awayTeam} 
                    score={score} 
                    sport={selectedSport}
                />
            )}
        </div>
    );
};

// ===================================
// 4. VOLLEYBALL CARD (Fixed)
// ===================================
export const VolleyballCard = ({ game }) => { 
// ... (VolleyballCard content remains the same)
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
                <span className="card-location">{location}</span>
            </div>
            <div className="card-teams">{homeTeam} vs {awayTeam}</div> 
            <div className="card-score-status">{currentInfo}</div>
        </div>
    );
};

// ===================================
// 5. F1 CARD (CRITICAL FIX)
// ===================================
export const F1Card = ({ game }) => {
// ... (F1Card content remains the same)
    const raceName = game.competition?.name || 'Formula 1 Race';
    const location = game.circuit?.name || 'N/A';
    
    const gameDate = new Date(game.date);
    const displayDate = gameDate.toLocaleString(undefined, { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
    });

    const status = game.status || 'Scheduled';
    const currentInfo = `${status} | ${displayDate}`;
    
    return ( 
        <div className="sport-card f1">
            <div className="card-header">
                <span className="card-game-name">{raceName}</span>
                <span className="card-location">{location}</span>
            </div>
            <div className="card-teams">Formula 1 - Race Day</div>
            <div className="card-score-status">{currentInfo}</div>
        </div>
    );
};