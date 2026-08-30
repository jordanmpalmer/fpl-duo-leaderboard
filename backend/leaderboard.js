// V2 - LAMBDA

const axios = require("axios");

const players = {
  "Athena V": 3873099,
  "Aymen S": 211041,
  "Corby O": 2536990,
  "Dan S": 4436262,
  "Dylan M": 7352092,
  "Jake W": 966,
  "Jordan P": 1575309,
  "Michael W": 21088,
  "Nick B": 114933,
  "Ryan R": 4084744,
  "Skyler B": 265508,
  "Wesley A": 203106,
};

// FPL duo teams
const teams = [
  ["Wesley A", "Athena V"],
  ["Dan S", "Dylan M"],
  ["Jordan P", "Nick B"],
  ["Skyler B", "Jake W"],
  ["Michael W", "Corby O"],
  ["Aymen S", "Ryan R"],
];

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

    teamDetails.push({
      totalPoints: points1 + points2,
      player1,
      points1,
      player2,
      points2,
    });
  }

  return teamDetails.sort((a, b) => b.totalPoints - a.totalPoints);
}

// AWS Lambda handler
exports.handler = async (event) => {
  try {
    const leaderboard = await fetchLeaderboard();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(leaderboard),
    };
  } catch (error) {
    console.error("Failed to fetch leaderboard:", error);

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        error: "Failed to fetch leaderboard data",
      }),
    };
  }
};
