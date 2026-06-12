import json

with open("app/data/projects.json", "r") as f:
    projects = json.load(f)

for p in projects:
    if p["id"] in ["soundstream_s3", "portfolio"]:
        if "icon-antigravity" not in p["tech_icons"]:
            p["tech_icons"].append("icon-antigravity")

with open("app/data/projects.json", "w") as f:
    json.dump(projects, f, indent=2)

print("Added icon-antigravity to tech_icons")
