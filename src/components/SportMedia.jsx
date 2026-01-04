import React from 'react';

// ==========================================
// DATA CONFIGURATION
// 1. videoSrc: Hardcoded YouTube Embed URL
// 2. standingsUrl: Link to the official sport standings
// ==========================================
const MEDIA_DATA = {
    football: {
        title: "Premier League Highlights",
        // Premier League Highlights
        videoSrc: "https://www.youtube.com/embed/N-_wj7rGU4M", 
        standingsUrl: "https://www.premierleague.com/tables",
        standingsLabel: "View League Standings"
    },
    hockey: {
        title: "NHL Season Highlights",
        // NHL Top Goals
        videoSrc: "https://www.youtube.com/embed/243qGrjk9l8?si=XjUuZwEkuf2SL_oQ", 
        standingsUrl: "https://www.nhl.com/standings",
        standingsLabel: "NHL Standings"
    },
    basketball: {
        title: "FIBA World Cup Highlights",
        // FIBA Best Plays
        videoSrc: "https://www.youtube.com/embed/YNwgjkkisAE?si=57ZSMScEWxLQcxPv", 
        standingsUrl: "https://www.fiba.basketball/",
        standingsLabel: "FIBA Rankings"
    },
    nba: {
        title: "NBA Game Highlights",
        // NBA Top 10 Plays
        videoSrc: "https://www.youtube.com/embed/cZJQKbo6PE4?si=t0uEtaN1D7ARnIOV", 
        standingsUrl: "https://www.nba.com/standings",
        standingsLabel: "NBA Conference Standings"
    },
    f1: {
        title: "F1 Race Highlights",
        // F1 Season Best Moments
        videoSrc: "https://www.youtube.com/embed/ac8o3yRoFIo?si=V1GKH8LsdJdhja_M", 
        standingsUrl: "https://www.formula1.com/en/results.html/2024/drivers.html",
        standingsLabel: "F1 Driver Standings"
    },
    volleyball: {
        title: "Volleyball World Highlights",
        // Best Volleyball Rallies
        videoSrc: "https://www.youtube.com/embed/QEyDaU8P-XM?si=vGZBaoJkzE5ChXro", 
        standingsUrl: "https://en.volleyballworld.com/standings",
        standingsLabel: "VNL Standings"
    }
};

const SportMedia = ({ sport }) => {
    const data = MEDIA_DATA[sport];

    // If no data is found for the sport, render nothing
    if (!data) return null;

    return (
        <div className="media-container">
            {/* Header containing Title and Standings Button */}
            <div className="media-header">
                <h3>{data.title}</h3>
                <a 
                    href={data.standingsUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="standings-btn"
                    style={{
                        backgroundColor: '#007bff',
                        color: 'white',
                        padding: '8px 16px',
                        textDecoration: 'none',
                        borderRadius: '5px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        display: 'inline-block'
                    }}
                >
                    {data.standingsLabel} &rarr;
                </a>
            </div>

            {/* Video Player */}
            <div className="video-responsive">
                <iframe
                    width="853"
                    height="480"
                    src={data.videoSrc}
                    title={data.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>
        </div>
    );
};

export default SportMedia;