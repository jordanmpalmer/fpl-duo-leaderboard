import React, { useState, useEffect } from "react";

function Leaderboard() {
  // State - this is like a variable that can trigger re-renders when it changes
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect - runs code when component mounts (like window.onload)
  useEffect(() => {
    fetchLeaderboard();
  }, []); // Empty array means "run once when component loads"

  // Function to fetch data from your backend
  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/leaderboard");

      if (!response.ok) {
        throw new Error("Failed to fetch leaderboard");
      }

      const data = await response.json();
      setLeaderboardData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading leaderboard...</div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="container">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  // Main render - this is like your HTML template
  return (
    <div className="container">
      <h1 className="title">FPL Duo Leaderboard</h1>

      <div className="table-container">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th className="rank-header">#</th>
              <th className="team-header">Team Name</th>
              <th className="points-header">Total Points</th>
              <th className="player-header">Player 1</th>
              <th className="points-header">Points 1</th>
              <th className="player-header">Player 2</th>
              <th className="points-header">Points 2</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData.map((team, index) => (
              <tr
                key={`${team.player1}-${team.player2}`}
                className={`table-row ${index === 0 ? "first-place" : ""}`}
              >
                <td className="rank-cell">{index + 1}</td>
                <td className="team-cell">
                  {team.player1} & {team.player2}
                </td>
                <td className="total-points-cell">
                  {team.totalPoints.toLocaleString()}
                </td>
                <td className="player-cell">{team.player1}</td>
                <td className="points-cell">{team.points1.toLocaleString()}</td>
                <td className="player-cell">{team.player2}</td>
                <td className="points-cell">{team.points2.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="refresh-button" onClick={fetchLeaderboard}>
        Refresh Data
      </button>
    </div>
  );
}

export default Leaderboard;
