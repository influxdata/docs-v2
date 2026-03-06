#!/bin/bash

# Test code blocks filtered by programming language
# Usage: test-by-language.sh <language> <content_path>
#
# Example: test-by-language.sh python content/influxdb/cloud/**/*.md

set -e

LANGUAGE="$1"
shift
CONTENT_FILES="$@"

if [[ -z "$LANGUAGE" ]] || [[ -z "$CONTENT_FILES" ]]; then
  echo "Usage: test-by-language.sh <language> <content_path>"
  echo "Example: test-by-language.sh python content/influxdb/cloud/**/*.md"
  exit 1
fi

echo "Testing $LANGUAGE code blocks in: $CONTENT_FILES"

# Create temporary filtered files
TEMP_DIR=$(mktemp -d)
trap "rm -rf $TEMP_DIR" EXIT

# Extract only code blocks for the specified language
python3 << EOF
import sys
import re
import os
from pathlib import Path

language = "$LANGUAGE"
content_files = """$CONTENT_FILES""".split()
temp_dir = "$TEMP_DIR"

# Language aliases
language_map = {
    'python': ['python', 'py'],
    'bash': ['bash', 'sh', 'shell'],
    'sql': ['sql', 'influxql'],
    'javascript': ['js', 'javascript'],
}

# Get all aliases for this language
target_langs = language_map.get(language, [language])

for file_path in content_files:
    if not os.path.exists(file_path):
        continue

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Check if file contains code blocks in target language
        has_target_lang = False
        for lang in target_langs:
            if re.search(rf'^```{lang}\b', content, re.MULTILINE):
                has_target_lang = True
                break

        if has_target_lang:
            # Copy to temp directory
            rel_path = os.path.relpath(file_path, 'content')
            dest_path = os.path.join(temp_dir, rel_path)
            os.makedirs(os.path.dirname(dest_path), exist_ok=True)

            with open(dest_path, 'w', encoding='utf-8') as f:
                f.write(content)

            print(f"Included: {file_path}", file=sys.stderr)

    except Exception as e:
        print(f"Error processing {file_path}: {e}", file=sys.stderr)
EOF

# Count filtered files
FILE_COUNT=$(find "$TEMP_DIR" -name "*.md" 2>/dev/null | wc -l)

if [[ $FILE_COUNT -eq 0 ]]; then
  echo "No files found with $LANGUAGE code blocks"
  exit 0
fi

echo "Found $FILE_COUNT files with $LANGUAGE code blocks"

# Run pytest on filtered files
pytest \
  -ra \
  -s \
  --codeblocks \
  --suppress-no-test-exit-code \
  --exitfirst \
  --envfile=/app/.env.test \
  "$TEMP_DIR"/**/*.md
