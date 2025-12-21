import React, { useState, useEffect, useCallback } from 'react';
import { FootballCard, HockeyCard, BasketballCard, F1Card, VolleyballCard } from './LiveScoreCards';
import SportMedia from './SportMedia'; // Ensure this import is correct

// API CONFIGURATION
const API_KEY = "eb4d0dc2d87f194e9b654de953d6180e"; // Your Key
const REFRESH_INTERVAL = 3000;

function getTodayDateString() {
    return new Date().toISOString().split("T")[0];
}

function getCurrentSeason() {
    return new Date().getFullYear().toString();
}

const API_ENDPOINTS = {
    football: () => "https://v3.football.api-sports.io/fixtures?live=all",
    hockey: () => `https://v1.hockey.api-sports.io/games?date=${getTodayDateString()}`,
    basketball: () => `https://v1.basketball.api-sports.io/games?date=${getTodayDateString()}`,
    nba: () => `https://v1.basketball.api-sports.io/games?league=12&date=${getTodayDateString()}`,
    f1: () => `https://v1.formula-1.api-sports.io/races?season=${getCurrentSeason()}&type=Race`,
    volleyball: () => `https://v1.volleyball.api-sports.io/games?date=${getTodayDateString()}`
};

const LiveScores = ({ selectedSport }) => {
    const [games, setGames] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const nonLiveStatus = ["Finished", "Not Started", "Cancelled", "Postponed", "Interrupted", "Scheduled"];

    const normalizeGames = useCallback((sport, apiResponse) => {
        let gamesToDisplay = apiResponse;
        if (['hockey', 'basketball', 'nba', 'volleyball'].includes(sport)) {
            gamesToDisplay = apiResponse.filter(game => !nonLiveStatus.includes(game.status.long));
        } else if (sport === 'f1') {
            const now = new Date();
            let liveRace = apiResponse.find(game => game.status === "Live");

            if (liveRace) {
                gamesToDisplay = [liveRace];
            } else {
                let upcomingRaces = apiResponse
                    .filter(game => game.status === "Scheduled" && new Date(game.date) > now)
                    .sort((a, b) => new Date(a.date) - new Date(b.date));

                gamesToDisplay = upcomingRaces.length > 0 ? [upcomingRaces[0]] : [];
            }
        }
        return gamesToDisplay;
    }, []);

    const fetchSportData = useCallback(async (sport) => {
        if (!API_ENDPOINTS[sport]) return;

        const url = API_ENDPOINTS[sport]();
        const headers = { "x-apisports-key": API_KEY };

        try {
            const response = await fetch(url, { headers });

            if (response.status === 429) {
                throw new Error("API Limit Reached. Please try again tomorrow.");
            }

            if (!response.ok) throw new Error(`API request failed: ${response.statusText}`);

            const data = await response.json();

            if (data.errors && (Array.isArray(data.errors) ? data.errors.length > 0 : Object.keys(data.errors).length > 0)) {
                const errorMsg = Array.isArray(data.errors) ? data.errors[0] : (data.errors[Object.keys(data.errors)[0]] || "Unknown API Error");
                setError(`API Error: ${errorMsg}`);
                return;
            }

            const normalized = normalizeGames(sport, data.response);
            setGames(normalized);
            setError(null);

        } catch (err) {
            console.error("Fetch Error:", err);
            setError(`${err.message}`);
        } finally {
            setIsLoading(false);
        }
    }, [normalizeGames]);

    useEffect(() => {
        if (!selectedSport) {
            setGames(null);
            setError(null);
            return;
        }

        setIsLoading(true);
        fetchSportData(selectedSport);

        const intervalId = setInterval(() => {
            fetchSportData(selectedSport);
        }, REFRESH_INTERVAL);

        return () => {
            clearInterval(intervalId);
        };
    }, [selectedSport, fetchSportData]);

    // ------------------------------------------------------------------
    // RENDER LOGIC
    // ------------------------------------------------------------------

    // 1. Initial State: No Sport Selected
    if (!selectedSport) {
        return (
            <div className="welcome-message">
                <h2>Welcome to NowPlaying!</h2>
                <p>Select a sport from the left to see live scores.</p>
            </div>
        );
    }

    // 2. Define the content area separately so it doesn't block the Header/Media
    let content;

    if (isLoading) {
        content = (
            <div className="loader-container">
                <div className="loader"></div>
                <h2>Loading {selectedSport.toUpperCase()} games...</h2>
            </div>
        );
    } else if (error) {
        content = (
            <div className="info-message error-message">
                <h2>Something Went Wrong</h2>
                <p>{error}</p>
            </div>
        );
    } else if (!games || games.length === 0) {
        content = (
            <div className="no-games">
                <h2>No Live {selectedSport.toUpperCase()} Games Found</h2>
                <p>Check back soon or watch the highlights above!</p>
            </div>
        );
    } else {
        // Render Games List
        content = (
            <div className="cards-container">
                {games.map((game) => {
                    switch (selectedSport) {
                        case "football": return <FootballCard key={game.fixture.id} game={game} />;
                        case "hockey": return <HockeyCard key={game.id} game={game} />;
                        case "basketball":
                        case "nba": return <BasketballCard key={game.id} game={game} selectedSport={selectedSport} />;
                        case "f1": return <F1Card key={game.id || game.date} game={game} />;
                        case "volleyball": return <VolleyballCard key={game.id} game={game} />;
                        default: return null;
                    }
                })}
            </div>
        );
    }

    // 3. Final Return: Renders Media FIRST, then the Content variable
    return (
        <div className="live-scores-container">
            <SportMedia sport={selectedSport} />
            <hr className="divider" style={{margin: "20px 0", borderColor: "#444"}} />
            {content}
        </div>
    );
};

export default LiveScores;