const express = require("express");
// const cors = require("cors");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// app.use(cors());
app.use(express.json());

// Serve static files from React build
app.use(express.static(path.join(__dirname, "frontend/build")));

const players = {
  "Aymen S": 752513,
  "Corby O": 2242479,
  "Zach O": 4043393,
  "Jordan P": 2093332,
  "Dylan M": 4837539,
  "Wesley A": 3434753,
  "Jake W": 79344,
  "Nick B": 9134,
  "Athena V": 7438371,
  "Michael W": 466838,
};

// FPL duo teams
const teams = [
  ["Aymen S", "Corby O"],
  ["Zach O", "Jordan P"],
  ["Dylan M", "Wesley A"],
  ["Jake W", "Nick B"],
  ["Athena V", "Michael W"],
];

// Function to fetch leaderboard data
async function fetchLeaderboard() {
  const teamDetails = [];

  for (const [player1, player2] of teams) {
    const [response1, response2] = await Promise.all([
      axios.get(
        `https://fantasy.premierleague.com/api/entry/${players[player1]}/`,
      ),
      axios.get(
        `https://fantasy.premierleague.com/api/entry/${players[player2]}/`,
      ),
    ]);

    const points1 = response1.data.summary_overall_points;
    const points2 = response2.data.summary_overall_points;
    const total = points1 + points2;

    teamDetails.push({
      totalPoints: total,
      player1,
      points1,
      player2,
      points2,
    });
  }

  // Sort teams by totalPoints descending
  return teamDetails.sort((a, b) => b.totalPoints - a.totalPoints);
}

// API route
app.get("/api/leaderboard", async (req, res) => {
  try {
    const leaderboard = await fetchLeaderboard();
    res.json(leaderboard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch leaderboard data" });
  }
});

// Catch-all: serve React for all other routes
app.get("/{*any}", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/build", "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
