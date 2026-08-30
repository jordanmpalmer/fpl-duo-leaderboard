import React, { useState, useEffect } from "react";

function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const baseUrl = "";
      const response = await fetch(`${baseUrl}/api/leaderboard`);
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

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 text-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
            <div className="text-gray-400">Loading leaderboard...</div>
          </div>
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 text-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-900/30 border border-red-500 rounded-lg p-6 text-center">
            <div className="text-red-400 font-medium">Error: {error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 text-gray-100">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-white">
          🏆 FPL Duo Leaderboard
        </h1>

        {/* Desktop Table */}
        <div className="hidden md:block bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">#</th>
                  <th className="px-4 py-3 text-left font-medium">Team</th>
                  <th className="px-4 py-3 text-right font-medium">Total</th>
                  <th className="px-4 py-3 text-left font-medium">Player 1</th>
                  <th className="px-4 py-3 text-right font-medium">Points</th>
                  <th className="px-4 py-3 text-left font-medium">Player 2</th>
                  <th className="px-4 py-3 text-right font-medium">Points</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardData.map((team, index) => (
                  <tr
                    key={`${team.player1}-${team.player2}`}
                    className={`border-b border-gray-700 hover:bg-gray-700/50 ${
                      index === 0 ? "bg-yellow-900/40 border-yellow-600" : ""
                    }`}
                  >
                    <td className="px-4 py-4 font-medium">
                      {index === 0 && "🥇"} {index + 1}
                    </td>
                    <td className="px-4 py-4 text-gray-100">
                      {team.player1} & {team.player2}
                    </td>
                    <td className="px-4 py-4 text-right font-bold text-green-400">
                      {team.totalPoints.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-gray-100">{team.player1}</td>
                    <td className="px-4 py-4 text-right text-gray-400">
                      {team.points1.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-gray-100">{team.player2}</td>
                    <td className="px-4 py-4 text-right text-gray-400">
                      {team.points2.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4 mb-6">
          {leaderboardData.map((team, index) => (
            <div
              key={`${team.player1}-${team.player2}`}
              className={`bg-gray-800 rounded-lg shadow-lg p-4 ${
                index === 0 ? "ring-2 ring-yellow-500 bg-yellow-900/20" : ""
              }`}
            >
              <div className="flex justify-between items-center mb-3">
                <span className="text-2xl font-bold text-white">
                  {index === 0 && "🥇"} #{index + 1}
                </span>
                <div className="text-right">
                  <div className="text-sm text-gray-400">Total Points</div>
                  <div className="text-2xl font-bold text-green-400">
                    {team.totalPoints.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-white">
                  {team.player1} & {team.player2}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-900/30 rounded-lg">
                  <div className="font-medium text-gray-200">
                    {team.player1}
                  </div>
                  <div className="text-2xl font-bold text-blue-400">
                    {team.points1.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-400">points</div>
                </div>
                <div className="text-center p-3 bg-purple-900/30 rounded-lg">
                  <div className="font-medium text-gray-200">
                    {team.player2}
                  </div>
                  <div className="text-2xl font-bold text-purple-400">
                    {team.points2.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-400">points</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Refresh */}
        <div className="text-center">
          <button
            onClick={fetchLeaderboard}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200 shadow-lg"
          >
            {loading ? "Refreshing..." : "🔄 Refresh Data"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
