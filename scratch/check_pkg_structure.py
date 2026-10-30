with open(r'd:\THTT\THTT\integration\src\assets\data\mockData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re
pkg_start = text.find('export const packages')
print(text[pkg_start:pkg_start+800])

