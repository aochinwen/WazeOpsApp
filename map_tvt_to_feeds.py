import re
from pathlib import Path

# Read the Traffic View HTML file
html_path = Path('/Users/aochinwen/WazeOpsApp/WazeHTML/WazeTrafficView.html')
html_content = html_path.read_text()

# Feed names we're looking for
feed_names = [
    'NSC-N101', 'NSC - N102', 'NSC-N103', 'NSC - N106', 'NSC - N107',
    'NSC-N109', 'NSC-N110', 'NSC - N111', 'NSC-N112', 'NSC - N115',
    'N113', 'N105', 'NSC - N105'
]

print("Searching for feed name to TVT ID mappings in Traffic View HTML...\n")

# Try to find which TVT ID corresponds to which name
for name in feed_names:
    # Search for the name and nearby TVT ID (within 1000 characters)
    name_pattern = re.escape(name).replace(r'\ ', r'\s*').replace(r'\-', r'\s*-?\s*')
    context_pattern = f'{name_pattern}.{{0,1000}}?feeds-tvt/\\?id=(\\d+)'
    match = re.search(context_pattern, html_content, re.IGNORECASE)
    if match:
        tvt_id = match.group(1)
        print(f"{name:20} -> TVT ID: {tvt_id}")
    else:
        # Try reverse search
        context_pattern = f'feeds-tvt/\\?id=(\\d+).{{0,1000}}?{name_pattern}'
        match = re.search(context_pattern, html_content, re.IGNORECASE)
        if match:
            tvt_id = match.group(1)
            print(f"{name:20} -> TVT ID: {tvt_id} (reverse)")
        else:
            print(f"{name:20} -> TVT ID not found")

# Also search for all TVT URLs with context
print("\n\nSearching for all TVT URLs with surrounding context...")
tvt_context_pattern = r'(.{50})feeds-tvt/\?id=(\d+)(.{50})'
matches = re.findall(tvt_context_pattern, html_content)

print(f"\nFound {len(matches)} TVT URL contexts (showing first 20):")
for i, (before, tvt_id, after) in enumerate(matches[:20], 1):
    # Clean up the context
    before_clean = before.replace('\n', ' ').replace('\r', ' ')[-50:]
    after_clean = after.replace('\n', ' ').replace('\r', ' ')[:50]
    print(f"\n{i}. TVT ID {tvt_id}:")
    print(f"   ...{before_clean}[TVT]{after_clean}...")
