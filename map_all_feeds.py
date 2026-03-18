import re
from pathlib import Path

# Read the HTML file
html_path = Path('/Users/aochinwen/WazeOpsApp/20260318Waze.html')
html_content = html_path.read_text()

# Known mappings from earlier extraction
known_mappings = {
    'a40b3615-d37b-4bb1-8770-b93292b59ccb': 'NSC - N106',
    '3ad950b5-f813-4fe7-a944-bf6ab2b3449c': 'NSC - N102',
    'cb390849-f2ef-459f-b136-c28cd473bc24': 'NSC - N115',
    '24239d32-2ad2-4f4f-ac53-e90ed7f76626': 'N108',
    '3e748db2-ce25-4ce7-a7eb-e80b8958bf3d': 'NSC - N107',
    '838924d4-1642-4419-9e9f-3d17ffe11fcf': 'NSC-N101',
    '2ae59ac0-2054-4681-9af0-e41a67da94d8': 'NSC-N103',
    '9340dec6-7bb3-4747-8118-74e9e33c1217': 'NSC-N109',
    'ef55d393-77d4-4c5b-b0a5-9e232d306a99': 'NSC-N110',
    '6df32654-29e2-41d6-9df2-f287efc799bd': 'NSC - N111',
    'ac49baf5-cbe1-44ea-8ee3-7c9bdbd82ff0': 'NSC-N112',
    'a2141ab7-ad83-4456-a614-54c572a780d4': 'N113',
}

# Find all feed URLs with UUIDs
feed_pattern = r'https://www\.waze\.com/row-partnerhub-api/partners/18727209890/waze-feeds/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})\?format=1'
feed_uuids = re.findall(feed_pattern, html_content)

# Remove duplicates and sort
unique_feed_uuids = sorted(set(feed_uuids))

print(f"Found {len(unique_feed_uuids)} unique feed UUIDs\n")

# Map UUIDs to names
feed_data = []
for uuid in unique_feed_uuids:
    name = known_mappings.get(uuid, f'Unknown-{uuid[:8]}')
    feed_data.append({
        'name': name,
        'uuid': uuid
    })

# Print results
print("Feed Mappings:")
print("=" * 80)
for i, feed in enumerate(feed_data, 1):
    status = "✓" if feed['name'] in known_mappings.values() else "?"
    print(f"{status} {i:2}. {feed['name']:25} -> {feed['uuid']}")

# Generate TypeScript constant
print("\n\n" + "="*80)
print("TypeScript FEED_SOURCES array (all feeds):")
print("="*80 + "\n")

print("export const FEED_SOURCES = [")
for feed in feed_data:
    # Create ID from name
    if feed['name'].startswith('Unknown'):
        feed_id = f"feed-{feed['uuid'][:8]}"
        display_name = f"Feed {feed['uuid'][:8]}"
    else:
        feed_id = feed['name'].replace(' ', '-').replace('--', '-')
        display_name = feed['name']
    
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

print("\n\n" + "="*80)
print(f"Summary: {len([f for f in feed_data if not f['name'].startswith('Unknown')])} feeds with known names, {len([f for f in feed_data if f['name'].startswith('Unknown')])} unknown")
print("="*80)
