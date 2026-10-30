with open(r'd:\THTT\THTT\integration\src\assets\data\mockData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re
titles = set(re.findall(r'title:\s*["\']([^"\']+)["\']', text))
destinations = [t for t in titles if any(k in t.lower() for k in ['thailand', 'bali', 'everest', 'annapurna', 'pokhara', 'dubai', 'japan', 'visa'])]
print('Destinations count:', len(destinations))
for d in sorted(destinations):
    print('-', d)

