"""Remove manual SQL/InfluxQL contents lists; the sidebar generates them.

Run from the repository root. Preview by default; use --write to apply.
Remove local-fragment lists in the introduction or immediately before a
heading. Preserve contextual lists, prose links, and code examples.
"""

import argparse
import re
from pathlib import Path

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--write', action='store_true')
args = parser.parse_args()
link = re.compile(r'^[ \t]*[-*+] \[[^\]\n]+\]\(#[^)]+\):?[ \t]*$')
fence = re.compile(r'^\s*(`{3,}|~{3,})')
changed = 0
removed = 0
for directory in ('sql-reference', 'influxql-v3-reference'):
    for path in sorted(Path('content/shared', directory).rglob('*.md')):
        original = path.read_text()
        blocks = re.split(r'(\n[ \t]*\n)', original)
        output = []
        in_comment = False
        in_fence = None
        seen_heading = False
        count = 0
        for index, block in enumerate(blocks):
            lines = block.splitlines()
            visible = re.sub(r'<!--[\s\S]*?-->', '', block).strip()
            visible_lines = visible.splitlines()
            following = ''.join(blocks[index + 1:])
            following = re.sub(r'^(?:\s|<!--[\s\S]*?-->)*', '', following)
            before_heading = bool(re.match(r'#{2,6} ', following))
            navigation = bool(visible_lines) and not in_comment and not in_fence
            navigation = navigation and (not seen_heading or before_heading)
            navigation = navigation and all(link.fullmatch(line) for line in visible_lines)
            if navigation:
                count += len(visible_lines)
                continue
            output.append(block)
            for line in lines:
                marker = fence.match(line)
                if marker and not in_comment:
                    value = marker.group(1)
                    if in_fence is None:
                        in_fence = value
                    elif value[0] == in_fence[0] and len(value) >= len(in_fence):
                        in_fence = None
                if in_fence is None:
                    if re.match(r'^#{2,6} ', line) and not in_comment:
                        seen_heading = True
                    if '<!--' in line:
                        in_comment = True
                    if '-->' in line:
                        in_comment = False
        if count:
            updated = ''.join(output)
            updated = re.sub(r'\n(?:[ \t]*\n){2,}', '\n\n', updated)
            updated = updated.lstrip('\n')
            if args.write:
                path.write_text(updated)
            print(f'{path}: {count} navigation links')
            changed += 1
            removed += count
print(f'{changed} files, {removed} navigation links')
