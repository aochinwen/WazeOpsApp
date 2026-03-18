import re
from pathlib import Path

# Read the HTML file
html_path = Path('/Users/aochinwen/WazeOpsApp/20260318Waze.html')
html_content = html_path.read_text()

feed_names = [
    "NSC - N106",
    "NSC - N102", 
    "NSC - N115",
    "N108",
    "NSC - N107",
    "NSC-N101",
    "NSC-N103",
    "NSC-N109",
    "NSC-N110",
    "NSC - N111",
    "NSC-N112",
    "N113",
]

print("Searching for feed name to UUID mappings...\n")

# Try to find which UUID corresponds to which name
for name in feed_names:
    # Search for the name and nearby UUID (within 1000 characters)
    name_pattern = re.escape(name).replace(r'\ ', r'\s*').replace(r'\-', r'\s*-?\s*')
    context_pattern = f'{name_pattern}.{{0,1000}}?([a-f0-9]{{8}}-[a-f0-9]{{4}}-[a-f0-9]{{4}}-[a-f0-9]{{4}}-[a-f0-9]{{12}})'
    match = re.search(context_pattern, html_content, re.IGNORECASE)
    if match:
        uuid = match.group(1)
        print(f"{name:20} -> {uuid}")
    else:
        print(f"{name:20} -> UUID not found")

# Also search in reverse - UUID followed by name
print("\n\nSearching reverse (UUID -> name)...\n")
uuid_pattern = r'([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}).{0,1000}?(NSC\s*-?\s*N\d{3}|N\d{3})'
matches = re.findall(uuid_pattern, html_content, re.IGNORECASE)

seen = set()
for uuid, name in matches:
    key = (uuid, name.strip())
    if key not in seen:
        seen.add(key)
        print(f"{name.strip():20} -> {uuid}")
