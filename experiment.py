import requests

# Aymen (752513) and Corby (2242479)
# Zach O (4043393) and Jordan P (2093332)
# Dylan (4837539) and Wesley (3434753)
# Jake W (79344) and Nick B (9134)
# Athena (7438371) and Michael W (466838)
# team_id = 2093332
teams = {}
teams["Aymen S and Corby O"] = [752513, 2242479]
teams["Zach O and Jordan P"] = [4043393, 2093332]
teams["Dylan M and Wesley A"] = [4837539, 3434753]
teams["Jake W and Nick B"] = [79344, 9134]
teams["Athena V and Michael W"] = [7438371, 466838]
team_points = {}
for team_name, ids in teams.items():
    url = f"https://fantasy.premierleague.com/api/entry/{ids[0]}/"
    response = requests.get(url)
    data1 = response.json()

    url = f"https://fantasy.premierleague.com/api/entry/{ids[1]}/"
    response = requests.get(url)
    data2 = response.json()

    # print("Manager:", data1["player_first_name"], data1["player_last_name"])
    # print("Total points:", data1["summary_overall_points"])
    # print("This GW points:", data1["summary_event_points"])
    # print("")
    # print("Manager:", data2["player_first_name"], data2["player_last_name"])
    # print("Total points:", data2["summary_overall_points"])
    # print("This GW points:", data2["summary_event_points"])
    # print("")
    # print(
    #     "Total Duo Points",
    #     data1["summary_overall_points"] + data2["summary_overall_points"],
    # )
    # print("=================================================")
    team_points[team_name] = (
        data1["summary_overall_points"] + data2["summary_overall_points"]
    )

print("")

# Sort by points descending
sorted_teams = sorted(team_points.items(), key=lambda x: x[1], reverse=True)

print("=== Leaderboard ===")
for team_name, points in sorted_teams:
    print(f"{team_name}: {points}")
