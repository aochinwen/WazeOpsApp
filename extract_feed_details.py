import re
import json
from pathlib import Path

# Read the HTML file
html_path = Path('/Users/aochinwen/WazeOpsApp/20260318Waze.html')
html_content = html_path.read_text()

# Extract feed data - looking for patterns that contain both name and URL
# The HTML likely has structured data with feed names and their corresponding URLs

# Find all feed UUIDs
feed_pattern = r'([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})'
feed_uuids = re.findall(feed_pattern, html_content)

# Find feed names (NSC-N### or N###)
name_pattern = r'(?:NSC\s*-\s*)?N\d{3,}'
feed_names = re.findall(name_pattern, html_content)

# Find TVT IDs
tvt_pattern = r'feeds-tvt/\?id=(\d+)'
tvt_ids = re.findall(tvt_pattern, html_content)

print("Feed UUIDs found:", len(set(feed_uuids)))
print("Feed names found:", len(feed_names))
print("TVT IDs found:", len(set(tvt_ids)))

# Try to extract structured data
# Look for JSON-like structures or data attributes
json_pattern = r'\{[^}]*"name"[^}]*"uuid"[^}]*\}'
potential_json = re.findall(json_pattern, html_content)

print("\nAttempting to find structured feed data...")

# Print unique feed UUIDs
unique_uuids = sorted(set(feed_uuids))
print("\nUnique Feed UUIDs:")
for i, uuid in enumerate(unique_uuids, 1):
    print(f"{i}. {uuid}")

# Print unique feed names
unique_names = []
seen = set()
for name in feed_names:
    normalized = name.strip()
    if normalized not in seen:
        seen.add(normalized)
        unique_names.append(normalized)

print("\nUnique Feed Names:")
for i, name in enumerate(unique_names, 1):
    print(f"{i}. {name}")

# Print unique TVT IDs
unique_tvt = sorted(set(tvt_ids))
print("\nUnique TVT IDs:")
for i, tvt_id in enumerate(unique_tvt, 1):
    print(f"{i}. {tvt_id}")
