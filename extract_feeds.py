import re
from pathlib import Path

# Read the HTML file
html_path = Path('/Users/aochinwen/WazeOpsApp/20260318Waze.html')
html_content = html_path.read_text()

# Find all JSON feed URLs
pattern = r'https://www\.waze\.com/row-partnerhub-api/partners/\d+/waze-feeds/[a-f0-9-]+\?format=1'
feed_urls = re.findall(pattern, html_content)

# Remove duplicates and sort
unique_urls = sorted(set(feed_urls))

print("Found feed URLs:")
for url in unique_urls:
    print(url)

# Also extract TVT URLs if present
tvt_pattern = r'https://www\.waze\.com/row-partnerhub-api/feeds-tvt/\?id=\d+'
tvt_urls = re.findall(tvt_pattern, html_content)
unique_tvt = sorted(set(tvt_urls))

print("\nFound TVT URLs:")
for url in unique_tvt:
    print(url)
