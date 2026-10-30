with open(r'd:\THTT\THTT\integration\src\assets\data\mockData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re
pkg_titles = re.findall(r'title:\s*["\']([^"\']+)["\']', text)
print('Package titles sample:', pkg_titles[:15])

hotel_names = re.findall(r'name:\s*["\']([^"\']+)["\']', text)
print('Hotel names sample:', hotel_names[:10])

