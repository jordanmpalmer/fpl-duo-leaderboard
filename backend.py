# leaderboard_api.py
import requests
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

teams = {
    "Aymen S and Corby O": [752513, 2242479],
    "Zach O and Jordan P": [4043393, 2093332],
    "Dylan M and Wesley A": [4837539, 3434753],
    "Jake W and Nick B": [79344, 9134],
    "Athena V and Michael W": [7438371, 466838],
}


def get_team_points():
    team_points = {}
    for team_name, ids in teams.items():
        data1 = requests.get(
            f"https://fantasy.premierleague.com/api/entry/{ids[0]}/"
        ).json()
        data2 = requests.get(
            f"https://fantasy.premierleague.com/api/entry/{ids[1]}/"
        ).json()
        team_points[team_name] = (
            data1["summary_overall_points"] + data2["summary_overall_points"]
        )
    sorted_teams = sorted(team_points.items(), key=lambda x: x[1], reverse=True)
    return [{"team": t[0], "points": t[1]} for t in sorted_teams]


@app.route("/leaderboard")
def leaderboard():
    return jsonify(get_team_points())


if __name__ == "__main__":
    app.run(debug=True)
