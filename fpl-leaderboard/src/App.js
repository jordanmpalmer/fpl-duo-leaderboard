// src/App.js
import { useEffect, useState } from "react";

function App() {
  const [teams, setTeams] = useState([]);

  async function fetchLeaderboard() {
    const response = await fetch("http://127.0.0.1:5000/leaderboard");
    const data = await response.json();
    setTeams(data);
  }

  useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 60000); // refresh every 60s
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>FPL Duo Leaderboard</h1>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Team</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team, index) => (
            <tr key={index}>
              <td>{team.team}</td>
              <td>{team.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
