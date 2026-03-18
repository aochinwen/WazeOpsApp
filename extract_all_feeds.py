import re
from pathlib import Path

# Read the HTML file
html_path = Path('/Users/aochinwen/WazeOpsApp/20260318Waze.html')
html_content = html_path.read_text()

# Find all feed URLs with UUIDs
feed_pattern = r'https://www\.waze\.com/row-partnerhub-api/partners/18727209890/waze-feeds/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})\?format=1'
feed_urls = re.findall(feed_pattern, html_content)

# Remove duplicates and sort
unique_feed_uuids = sorted(set(feed_urls))

print(f"Found {len(unique_feed_uuids)} unique feed UUIDs:\n")

# Try to find the name for each UUID
feed_data = []
for uuid in unique_feed_uuids:
    # Search backwards from UUID to find the nearest feed name
    # Look for pattern: name ... uuid
    pattern = r'(NSC\s*-?\s*N\d{3}|N\d{3})[^<]*?' + re.escape(uuid)
    match = re.search(pattern, html_content, re.IGNORECASE)
    
    if match:
        name = match.group(1).strip()
        # Normalize spacing
        name = re.sub(r'\s+', ' ', name)
        feed_data.append({
            'name': name,
            'uuid': uuid
        })
    else:
        # Try reverse search: uuid ... name
        pattern = re.escape(uuid) + r'[^<]*?(NSC\s*-?\s*N\d{3}|N\d{3})'
        match = re.search(pattern, html_content, re.IGNORECASE)
        if match:
            name = match.group(1).strip()
            name = re.sub(r'\s+', ' ', name)
            feed_data.append({
                'name': name,
                'uuid': uuid
            })
        else:
            feed_data.append({
                'name': 'Unknown',
                'uuid': uuid
            })

# Print results
for i, feed in enumerate(feed_data, 1):
    print(f"{i:2}. {feed['name']:20} -> {feed['uuid']}")

# Generate TypeScript constant
print("\n\n" + "="*80)
print("TypeScript FEED_SOURCES array:")
print("="*80 + "\n")

print("export const FEED_SOURCES = [")
for feed in feed_data:
    # Normalize name for display
    display_name = feed['name']
    if display_name != 'Unknown':
        # Create ID from name
        feed_id = display_name.replace(' ', '-').replace('--', '-')
    else:
        feed_id = f"feed-{feed['uuid'][:8]}"
    
    print(f"  {{")
    print(f"    id: '{feed_id}',")
    print(f"    name: '{display_name}',")
    print(f"    url: 'https://www.waze.com/row-partnerhub-api/partners/18727209890/waze-feeds/{feed['uuid']}?format=1',")
    print(f"    tvtUrl: ''")
    print(f"  }},")

# Add custom and LTA feeds
print(f"  {{")
print(f"    id: 'custom',")
print(f"    name: 'Custom URL',")
print(f"    url: '',")
print(f"    tvtUrl: ''")
print(f"  }},")
print(f"  {{")
print(f"    id: 'LTA_Traffic',")
print(f"    name: 'Singapore LTA',")
print(f"    url: '/feed/lta',")
print(f"    tvtUrl: ''")
print(f"  }},")
print("];")
