import json

with open("app/data/projects.json", "r") as f:
    projects = json.load(f)

for p in projects:
    if p["id"] == "soundstream_s3":
        if "Antigravity IDE" not in p["technologies"]:
            p["technologies"].append("Antigravity IDE")
        if "Antigravity IDE (IA)" not in p["tech_used"]:
            p["tech_used"].append("Antigravity IDE (IA)")
        if "Pair-programming IA (Antigravity)" not in p["tech_mastered"]:
            p["tech_mastered"].append("Pair-programming IA (Antigravity)")
            
    elif p["id"] == "portfolio":
        if "Antigravity IDE" not in p["technologies"]:
            p["technologies"].append("Antigravity IDE")
        if "Antigravity IDE (IA)" not in p["tech_used"]:
            p["tech_used"].append("Antigravity IDE (IA)")
        if "Pair-programming IA (Antigravity)" not in p["tech_mastered"]:
            p["tech_mastered"].append("Pair-programming IA (Antigravity)")

with open("app/data/projects.json", "w") as f:
    json.dump(projects, f, indent=2)

print("Added Antigravity IDE to projects")
