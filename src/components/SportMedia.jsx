import React from 'react';

// ==========================================
// DATA CONFIGURATION
// You can update these Video IDs and URLs periodically
// ==========================================
const MEDIA_DATA = {
    football: {
        title: "Premier League Highlights",
        videoId: "p16BiAYCZGQ", // Example: Highlights Video ID
        standingsUrl: "https://www.premierleague.com/tables",
        standingsLabel: "View League Standings"
    },
    hockey: {
        title: "NHL Latest Action",
        videoId: "h1Fk6K7c", // Example ID
        standingsUrl: "https://www.nhl.com/standings",
        standingsLabel: "NHL Standings"
    },
    basketball: {
        title: "FIBA/International Highlights",
        videoId: "M5u5z5", // Example ID
        standingsUrl: "https://www.fiba.basketball/",
        standingsLabel: "FIBA Rankings"
    },
    nba: {
        title: "NBA Top Plays",
        videoId: "Iqg6k-sKjVQ", // Example ID
        standingsUrl: "https://www.nba.com/standings",
        standingsLabel: "NBA Conference Standings"
    },
    f1: {
        title: "Formula 1: Race Highlights",
        videoId: "3f4iRs_y_3g", // Example ID
        standingsUrl: "https://www.formula1.com/en/results.html/2024/drivers.html",
        standingsLabel: "F1 Driver Standings"
    },
    volleyball: {
        title: "Volleyball World Best Moments",
        videoId: "VideoID_Here", // Replace with real ID
        standingsUrl: "https://en.volleyballworld.com/standings",
        standingsLabel: "VNL Standings"
    }
};

const SportMedia = ({ sport }) => {
    const data = MEDIA_DATA[sport];

    // If no data is found for the sport (or specific ID missing), render nothing or a fallback
    if (!data) return null;

    return (
        <div className="media-container">
            <div className="media-header">
                <h3>{data.title}</h3>
                <a 
                    href={data.standingsUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="standings-btn"
                >
                    {data.standingsLabel} &rarr;
                </a>
            </div>

            <div className="video-responsive">
                <iframe
                    width="853"
                    height="480"
                    src={`https://www.youtube.com/embed/${data.videoId}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>
        </div>
    );
};

export default SportMedia;