document.addEventListener("DOMContentLoaded", () => {
    
    const API_KEY = "4deb92bc148bb85e924ff124ea64d871";
    const REFRESH_INTERVAL = 3000; //3 seconds, gotta change later tho, free tier is less

    
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
        nba: () => `https://v1.basketball.api-sports.io/games?league=12&date=${getTodayDateString()}`, //12 means nba
        f1: () => `https://v1.formula-1.api-sports.io/races?season=${getCurrentSeason()}&type=Race`,
        volleyball: () => `https://v1.volleyball.api-sports.io/games?date=${getTodayDateString()}`
    };

    let currentIntervalId = null; 

    const mainContent = document.getElementById("main-content");
    const navLinks = {
        football: document.getElementById("nav-football"),
        hockey: document.getElementById("nav-hockey"),
        basketball: document.getElementById("nav-basketball"),
        nba: document.getElementById("nav-nba"),
        f1: document.getElementById("nav-f1"),
        volleyball: document.getElementById("nav-volleyball"),
    };

    navLinks.football.addEventListener("click", (e) => handleSportClick(e, "football"));
    navLinks.hockey.addEventListener("click", (e) => handleSportClick(e, "hockey"));
    navLinks.basketball.addEventListener("click", (e) => handleSportClick(e, "basketball"));
    navLinks.nba.addEventListener("click", (e) => handleSportClick(e, "nba"));
    navLinks.f1.addEventListener("click", (e) => handleSportClick(e, "f1"));
    navLinks.volleyball.addEventListener("click", (e) => handleSportClick(e, "volleyball"));


    function handleSportClick(event, sport) {
        event.preventDefault(); 

        if (currentIntervalId) {
            clearInterval(currentIntervalId);
        }

        mainContent.innerHTML = `<div class="loader-container"><div class="loader"></div><h2>Loading ${sport} games...</h2></div>`;
        
        if (!API_ENDPOINTS[sport]()) {
            displayApiNotAvailable(sport);
            return;
        }

        fetchSportData(sport);
        currentIntervalId = setInterval(() => fetchSportData(sport), REFRESH_INTERVAL);
    }

    async function fetchSportData(sport) {
        const url = API_ENDPOINTS[sport](); 
        const headers = {
            "x-apisports-key": API_KEY,
        };

        try {
            const response = await fetch(url, { headers });
            if (!response.ok) throw new Error(`API request failed: ${response.statusText}`);
            
            const data = await response.json();

            if (data.errors && (Array.isArray(data.errors) ? data.errors.length > 0 : Object.keys(data.errors).length > 0)) {
                console.error("API Error:", data.errors);
                const errorMsg = Array.isArray(data.errors) ? data.errors[0] : (data.errors[Object.keys(data.errors)[0]] || "Unknown API Error");
                displayError(`API Error: ${errorMsg}`);
                clearInterval(currentIntervalId);
                return;
            }

            displayGameCards(sport, data.response);

        } catch (error) {
            console.error("Network issue", error);
            displayError(`Error fetching data: ${error.message}.`);
            clearInterval(currentIntervalId);
        }
    }

    function displayGameCards(sport, games) {
        mainContent.innerHTML = "";
        
        let gamesToDisplay = games;

        const nonLiveStatus = ["Finished", "Not Started", "Cancelled", "Postponed", "Interrupted", "Scheduled"];
        
        if (sport === 'hockey' || sport === 'basketball' || sport === 'nba' || sport === 'volleyball') {
            gamesToDisplay = games.filter(game => !nonLiveStatus.includes(game.status.long));
        }

        if (sport === 'f1') {
            const now = new Date();
            let liveRace = games.find(game => game.status === "Live");
            
            if (liveRace) {
                gamesToDisplay = [liveRace]; 
            } else {
                let upcomingRaces = games
                    .filter(game => game.status === "Scheduled" && new Date(game.date) > now)
                    .sort((a, b) => new Date(a.date) - new Date(b.date)); 
                
                if (upcomingRaces.length > 0) {
                    gamesToDisplay = [upcomingRaces[0]]; 
                } else {
                    gamesToDisplay = []; 
                }
            }
        }

        if (!gamesToDisplay || gamesToDisplay.length === 0) {
            mainContent.innerHTML = `<div class="no-games"><h2>No Live ${sport.toUpperCase()} Games Found</h2><p>Check back soon!</p></div>`;
            return;
        }

        const container = document.createElement("div");
        container.className = "cards-container";

        gamesToDisplay.forEach(game => {
            let cardHtml = "";
            switch (sport) {
                case "football":
                    cardHtml = createFootballCard(game);
                    break;
                case "hockey":
                    cardHtml = createHockeyCard(game);
                    break;
                case "basketball":
                case "nba": 
                    cardHtml = createBasketballCard(game);
                    break;
                case "volleyball":
                    cardHtml = createVolleyballCard(game);
                    break;
                case "f1":
                    cardHtml = createF1Card(game);
                    break;
            }
            container.innerHTML += cardHtml;
        });

        mainContent.appendChild(container);
    }


    function createFootballCard(game) {
        const league = game.league.name || 'N/A';
        const location = game.fixture.venue.city || 'N/A';
        const homeTeam = game.teams.home.name || 'Team 1';
        const awayTeam = game.teams.away.name || 'Team 2';
        const status = game.fixture.status.long || 'In Play';
        const score = `${game.goals.home} - ${game.goals.away}`;
        const currentInfo = `${status} | Score: ${score}`;

        return `
            <div class="sport-card football">
                <div class="card-header">
                    <span class="card-game-name">${league}</span>
                    <span class="card-location">${location}</span>
                </div>
                <div class="card-teams">${homeTeam} vs ${awayTeam}</div>
                <div class="card-score-status">${currentInfo}</div>
            </div>
        `;
    }

    function createHockeyCard(game) {
        const league = game.league.name || 'N/A';
        const location = game.country.name || 'N/A';
        const homeTeam = game.teams.home.name || 'Team 1';
        const awayTeam = game.teams.away.name || 'Team 2';
        const status = game.status.long || 'In Play';
        const score = `${game.scores.home} - ${game.scores.away}`;
        const currentInfo = `${status} | Score: ${score}`;
        
        return `
            <div class="sport-card hockey">
                <div class="card-header">
                    <span class="card-game-name">${league}</span>
                    <span class="card-location">${location}</span>
                </div>
                <div class="card-teams">${homeTeam} vs ${awayTeam}</div>
                <div class="card-score-status">${currentInfo}</div>
            </div>
        `;
    }

    function createBasketballCard(game) {
        const league = game.league.name || 'N/A';
        const location = game.country.name || 'N/A';
        const homeTeam = game.teams.home.name || 'Team 1';
        const awayTeam = game.teams.away.name || 'Team 2';
        const status = game.status.long || 'In Play';
        //showing only total; no quarters n all too complex
        const score = `${game.scores.home.total || 0} - ${game.scores.away.total || 0}`;
        const currentInfo = `${status} | Score: ${score}`;
        
        const cardClass = game.league.id === 12 ? 'nba' : 'basketball';

        return `
            <div class="sport-card ${cardClass}">
                <div class="card-header">
                    <span class="card-game-name">${league}</span>
                    <span class="card-location">${location}</span>
                </div>
                <div class="card-teams">${homeTeam} vs ${awayTeam}</div>
                <div class="card-score-status">${currentInfo}</div>
            </div>
        `;
    }

    function createVolleyballCard(game) {
        const league = game.league.name || 'N/A';
        const location = game.country.name || 'N/A';
        const homeTeam = game.teams.home.name || 'Team 1';
        const awayTeam = game.teams.away.name || 'Team 2';
        const status = game.status.long || 'In Play';
        const score = `${game.scores.home || 0} - ${game.scores.away || 0}`; // Simpler score
        const currentInfo = `${status} | Score: ${score}`;
        
        return `
            <div class="sport-card volleyball">
                <div class="card-header">
                    <span class="card-game-name">${league}</span>
                    <span class="card-location">${location}</span>
                </div>
                <div class="card-teams">${homeTeam} vs ${awayTeam}</div>
                <div class="card-score-status">${currentInfo}</div>
            </div>
        `;
    }

    function createF1Card(game) {
        const raceName = game.competition.name || 'Formula 1 Race';
        const location = game.circuit.name || 'N/A';
        
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
        
        return `
            <div class="sport-card f1">
                <div class="card-header">
                    <span class="card-game-name">${raceName}</span>
                    <span class="card-location">${location}</span>
                </div>
                <div class="card-teams">Formula 1 - Race Day</div>
                <div class="card-score-status">${currentInfo}</div>
            </div>
        `;
    }


    function displayError(message) {
         mainContent.innerHTML = `<div class="info-message error-message">
            <h2>Something Went Wrong</h2>
            <p>${message}</p>
         </div>`;
    }

    function displayApiNotAvailable(sport) {
        mainContent.innerHTML = `<div class="info-message">
            <h2>API Not Available for ${sport}</h2>
            <p>The provided API key does not support this sport. Please provide a valid API key for ${sport} to see live data.</p>
         </div>`;
    }
});