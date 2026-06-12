import json

with open("app/data/projects.json", "r") as f:
    projects = json.load(f)

# Define categories and sort order
# We will just map IDs to category and sort priority (lower is younger/top)

order_map = {
    "soundstream_s3": (0, "Universitaire"),
    "sae204": (1, "Universitaire"),
    "sae203": (2, "Universitaire"),
    "sae201": (3, "Universitaire"),
    "sae104": (4, "Universitaire"),
    "sae103": (5, "Universitaire"),
    "sae102": (6, "Universitaire"),
    "sae101": (7, "Universitaire"),
    "portfolio": (8, "Personnel"),
    "mobilite": (9, "Personnel"),
    "chifupy": (10, "Personnel"),
    "morpyon": (11, "Personnel")
}

# Update projects
for p in projects:
    pid = p["id"]
    if pid in order_map:
        p["category"] = order_map[pid][1]
        p["_sort_order"] = order_map[pid][0]
    else:
        p["category"] = "Personnel"
        p["_sort_order"] = 99

# Sort
projects.sort(key=lambda x: x["_sort_order"])

# Clean up
for p in projects:
    del p["_sort_order"]

with open("app/data/projects.json", "w") as f:
    json.dump(projects, f, indent=2)

print("projects.json updated successfully")
