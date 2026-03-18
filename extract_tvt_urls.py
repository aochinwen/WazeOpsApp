import re
from pathlib import Path

# Read the Traffic View HTML file
html_path = Path('/Users/aochinwen/WazeOpsApp/WazeHTML/WazeTrafficView.html')
html_content = html_path.read_text()

# Read current constants.ts to get feed UUIDs
constants_path = Path('/Users/aochinwen/WazeOpsApp/constants.ts')
constants_content = constants_path.read_text()

# Extract feed UUIDs from constants.ts
feed_uuid_pattern = r'waze-feeds/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})'
feed_uuids_in_constants = re.findall(feed_uuid_pattern, constants_content)

print(f"Found {len(feed_uuids_in_constants)} feed UUIDs in constants.ts\n")

# Extract TVT URLs from the Traffic View HTML
tvt_pattern = r'feeds-tvt/\?id=(\d+)'
tvt_ids = re.findall(tvt_pattern, html_content)

print(f"Found {len(tvt_ids)} TVT IDs in WazeTrafficView.html")
print(f"Unique TVT IDs: {len(set(tvt_ids))}\n")

# Try to find mappings between feed UUIDs and TVT IDs
# Look for patterns where UUID and TVT ID appear close together
mappings = {}

for uuid in feed_uuids_in_constants:
    # Search for TVT ID near this UUID
    pattern = re.escape(uuid) + r'.{0,500}?feeds-tvt/\?id=(\d+)'
    match = re.search(pattern, html_content)
    if match:
        tvt_id = match.group(1)
        mappings[uuid] = tvt_id
    else:
        # Try reverse search
        pattern = r'feeds-tvt/\?id=(\d+).{0,500}?' + re.escape(uuid)
        match = re.search(pattern, html_content)
        if match:
            tvt_id = match.group(1)
            mappings[uuid] = tvt_id

print("Feed UUID to TVT ID Mappings:")
print("=" * 80)
for uuid, tvt_id in mappings.items():
    print(f"{uuid} -> {tvt_id}")

print(f"\n\nMapped {len(mappings)} out of {len(feed_uuids_in_constants)} feeds")

# Show unique TVT IDs found
unique_tvt_ids = sorted(set(tvt_ids))
print(f"\n\nAll unique TVT IDs found in HTML:")
for tvt_id in unique_tvt_ids:
    print(f"  {tvt_id}")
