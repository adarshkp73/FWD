import React from 'react';

/**
 * A simple component to display detailed, period-by-period scores in a table.
 * @param {{
 * periods: Array<Object>, 
 * homeTeamName: string, 
 * awayTeamName: string, 
 * score: string,
 * sport: string 
 * }} props
 */
const VerboseScorecard = ({ periods, homeTeamName, awayTeamName, score, sport }) => {
    // If no period data is available, display a simple message
   /* if (!periods || periods.length === 0) {
        return <p className="verbose-score-note">Detailed scores not available for this game.</p>;
    }*/

    // Determine the label for each period based on the sport
    const getPeriodLabel = (index) => {
        if (sport === 'basketball' || sport === 'nba') {
            return `Q${index + 1}`; // Quarter 1, Q2, etc.
        }
        if (sport === 'hockey') {
            return `P${index + 1}`; // Period 1, P2, etc.
        }
        return `P${index + 1}`;
    };

    const homeTotal = periods.reduce((sum, p) => sum + (p.home || 0), 0);
    const awayTotal = periods.reduce((sum, p) => sum + (p.away || 0), 0);

    return (
        <div className="verbose-scorecard-container">
            <h4 className="verbose-score-title">Detailed Score: {score}</h4>
            
            <table className="score-table">
                <thead>
                    <tr>
                        <th className="team-col">Team</th>
                        {periods.map((_, index) => (
                            <th key={index} className="period-col">{getPeriodLabel(index)}</th>
                        ))}
                        <th className="total-col">TOTAL</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Home Team Row */}
                    <tr>
                        <td className="team-col home-team">{homeTeamName}</td>
                        {periods.map((period, index) => (
                            <td key={`home-${index}`} className="period-col">{period.home || 0}</td>
                        ))}
                        <td className="total-col total-score">{homeTotal}</td>
                    </tr>
                    {/* Away Team Row */}
                    <tr>
                        <td className="team-col away-team">{awayTeamName}</td>
                        {periods.map((period, index) => (
                            <td key={`away-${index}`} className="period-col">{period.away || 0}</td>
                        ))}
                        <td className="total-col total-score">{awayTotal}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default VerboseScorecard;