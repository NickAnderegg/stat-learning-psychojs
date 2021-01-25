from pathlib import Path
import csv

lines = ["export const resourcesList = ["]

cwd = Path.cwd()
for resource in cwd.glob("**/*"):
    if resource.match(".*"):
        continue
    if resource.match("*.py"):
        continue
    if resource.match("*.wav"):
        continue
    if resource.match("*.sh"):
        continue
    if resource.is_dir():
        continue

    relative_path = resource.relative_to(cwd)

    resource_entry = (
        "  {\n"
        f"    name: '{relative_path}',\n"
        f"    path: 'resources/{relative_path}',\n"
        "  },"
    )

    lines.append(resource_entry)

lines.append("]\n")

merged = "\n".join(lines)

resources_file = Path.cwd() / "../src/resourcesList.js"
with resources_file.open("w", encoding="utf-8") as f:
    f.write(merged)
