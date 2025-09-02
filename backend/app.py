# leaderboard_api.py
import os

import requests
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS

app = Flask(__name__, static_folder="../frontend/build")
CORS(app)  # allow requests from frontend

# FPL duo teams
teams = {
    "Aymen S and Corby O": [752513, 2242479],
    "Zach O and Jordan P": [4043393, 2093332],
    "Dylan M and Wesley A": [4837539, 3434753],
    "Jake W and Nick B": [79344, 9134],
    "Athena V and Michael W": [7438371, 466838],
}


def fetch_leaderboard():
    team_points = {}
    for team_name, ids in teams.items():
        data1 = requests.get(
            f"https://fantasy.premierleague.com/api/entry/{ids[0]}/"
        ).json()
        data2 = requests.get(
            f"https://fantasy.premierleague.com/api/entry/{ids[1]}/"
        ).json()
        total = data1["summary_overall_points"] + data2["summary_overall_points"]
        team_points[team_name] = total
    # sort descending
    sorted_teams = sorted(team_points.items(), key=lambda x: x[1], reverse=True)
    return [{"team": t[0], "points": t[1]} for t in sorted_teams]


@app.route("/api/leaderboard")
def leaderboard():
    return jsonify(fetch_leaderboard())


# Serve React frontend
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve(path):
    if path != "" and os.path.exists(app.static_folder + "/" + path):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, "index.html")


if __name__ == "__main__":
    app.run(debug=True)
