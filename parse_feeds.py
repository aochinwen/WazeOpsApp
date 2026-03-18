import re
from pathlib import Path
from bs4 import BeautifulSoup

# Read the HTML file
html_path = Path('/Users/aochinwen/WazeOpsApp/20260318Waze.html')
html_content = html_path.read_text()

# Parse with BeautifulSoup
soup = BeautifulSoup(html_content, 'html.parser')

# Find all links with "JSON" text or waze-feeds URLs
json_links = []
for link in soup.find_all('a'):
    href = link.get('href', '')
    if 'waze-feeds' in href and 'format=1' in href:
        text = link.get_text(strip=True)
        json_links.append({
            'text': text,
            'href': href
        })

print(f"Found {len(json_links)} JSON feed links")

# Try to find feed names near the links
# Look for text patterns that match feed names
feed_data = []

# Search for feed entries in the HTML
# Looking for patterns like: feed name followed by URL
pattern = r'(NSC\s*-?\s*N\d{3}|N\d{3})[^<]*?([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})'
matches = re.findall(pattern, html_content, re.IGNORECASE)

print(f"\nFound {len(matches)} name-UUID pairs")
for name, uuid in matches[:20]:  # Show first 20
    print(f"  {name.strip()} -> {uuid}")

# Also try to extract from any data attributes or JSON structures
print("\nSearching for structured data...")

# Look for Angular component data or JSON
json_pattern = r'\{[^{}]*?"name"[^{}]*?"id"[^{}]*?\}'
json_matches = re.findall(json_pattern, html_content)
print(f"Found {len(json_matches)} potential JSON objects")

# Print the feed URLs we found earlier
feed_urls = [
    "0d9de297-44e8-4c4b-97bb-9d35115dc45b",
    "27b495d6-e791-477c-8ca6-f5c07e69d245",
    "2ae59ac0-2054-4681-9af0-e41a67da94d8",
    "3ad950b5-f813-4fe7-a944-bf6ab2b3449c",
    "3e748db2-ce25-4ce7-a7eb-e80b8958bf3d",
    "6df32654-29e2-41d6-9df2-f287efc799bd",
    "838924d4-1642-4419-9e9f-3d17ffe11fcf",
    "9340dec6-7bb3-4747-8118-74e9e33c1217",
    "a2141ab7-ad83-4456-a614-54c572a780d4",
    "a40b3615-d37b-4bb1-8770-b93292b59ccb",
    "ac49baf5-cbe1-44ea-8ee3-7c9bdbd82ff0",
    "cb390849-f2ef-459f-b136-c28cd473bc24",
    "e0721125-6c5d-4e9a-8bc8-531ae7b32b31",
    "e0c6ef0a-aae0-4e8f-986b-65fb02a5e5a9",
    "ee935c52-98cd-4aa0-bac4-6f918a60b948",
    "ef55d393-77d4-4c5b-b0a5-9e232d306a99",
]

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

print("\n\nManual mapping based on screenshot (12 active feeds):")
print("Note: Need to match UUIDs to feed names - checking HTML for correlations...")

# Try to find which UUID corresponds to which name
for name in feed_names:
    # Search for the name and nearby UUID
    name_pattern = re.escape(name.replace(' ', r'\s*'))
    context_pattern = f'{name_pattern}.{{0,500}}?([a-f0-9]{{8}}-[a-f0-9]{{4}}-[a-f0-9]{{4}}-[a-f0-9]{{4}}-[a-f0-9]{{12}})'
    match = re.search(context_pattern, html_content, re.IGNORECASE)
    if match:
        print(f"{name}: {match.group(1)}")
    else:
        print(f"{name}: UUID not found nearby")
