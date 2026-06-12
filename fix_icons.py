import json
import urllib.request

# 1. Fetch devicon.json to get exact versions
url = "https://raw.githubusercontent.com/devicons/devicon/master/devicon.json"
try:
    with urllib.request.urlopen(url) as response:
        devicons = json.loads(response.read().decode())
except Exception as e:
    print(f"Error fetching devicons: {e}")
    devicons = []

devicon_dict = {}
for icon in devicons:
    devicon_dict[icon["name"]] = icon["versions"]["font"]

# Helper to find the best class
def get_devicon_class(name):
    name = name.lower()
    if name in devicon_dict:
        versions = devicon_dict[name]
        if "plain" in versions:
            return f"devicon-{name}-plain"
        elif "original" in versions:
            return f"devicon-{name}-original"
        else:
            return f"devicon-{name}-{versions[0]}"
    return f"devicon-{name}-plain" # fallback

with open("app/data/projects.json", "r") as f:
    projects = json.load(f)

for p in projects:
    new_icons = []
    
    # Custom fixes before mapping
    if p["id"] == "portfolio":
        # Ensure flask, react, tailwindcss are there
        raw_icons = ["python", "flask", "react", "tailwindcss", "html5", "css3", "javascript"]
    elif p["id"] == "soundstream_s3":
        raw_icons = ["python", "flask", "linux", "git"]
    elif p["id"] == "mobilite":
        raw_icons = ["python", "mysql", "pandas", "jupyter"]
    elif p["id"] == "sae204":
        raw_icons = ["mysql", "python"]
    elif p["id"] == "sae203":
        raw_icons = ["linux", "bash", "nginx"]
    elif p["id"] == "sae201":
        raw_icons = ["java", "git"]
    elif p["id"] == "sae104":
        raw_icons = ["mysql", "postgresql"]
    elif p["id"] == "sae103":
        raw_icons = ["linux", "bash"]
    elif p["id"] == "sae102":
        raw_icons = ["python", "markdown", "jupyter"]
    elif p["id"] == "sae101":
        raw_icons = ["python", "markdown", "git"]
    elif p["id"] == "chifupy":
        raw_icons = ["python"]
    elif p["id"] == "morpyon":
        raw_icons = ["python"]
    else:
        raw_icons = p["tech_icons"]

    for icon_name in raw_icons:
        # Devicon might have different names (e.g. pandas)
        cls = get_devicon_class(icon_name)
        new_icons.append(cls)
        
    p["tech_icons"] = new_icons

with open("app/data/projects.json", "w") as f:
    json.dump(projects, f, indent=2)

print("Updated projects.json")
