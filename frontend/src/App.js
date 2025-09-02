// src/App.js
import React, { useEffect, useState } from "react";

function App() {
  const [leaderboard, setLeaderboard] = useState([]);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch("/api/leaderboard");
      const data = await response.json();
      setLeaderboard(data);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 60000); // refresh every 60s
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1>FPL Duo Leaderboard</h1>
      <ol>
        {leaderboard.map((team, index) => (
          <li key={index}>
            {team.team}: {team.points} points
          </li>
        ))}
      </ol>
    </div>
  );
}

export default App;
